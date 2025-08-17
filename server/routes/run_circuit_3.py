# good encoder 1 (bad encoder 2 is also from this encoder circuit but implementation has not been saved)

import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
from functions.dim_reduction import compute_distribution_map

from numpy import genfromtxt
from functions.utils import recursive_convert
from functions.encoding import EncoderRyRz
from functions.feature_mapping import (
    get_feature_map_by_name,
    get_default_feature_map_for_circuit,
)

from routes.hyperparameters import (
    TRAIN_SPLIT,
    NUM_QUBITS,
    BATCH_SIZE,
    DEFAULT_EPOCH_NUMBER,
    DEFAULT_LR,
)
from routes.cost import cost as cost_fn
from functools import partial
from routes.accuracy import accuracy
from routes.ansatz import ansatz, ansatz_steps


def run_circuit_3(
    feature_map_name: str | None = None,
    epoch_number: int = DEFAULT_EPOCH_NUMBER,
    lr: float = DEFAULT_LR,
):
    dev = qml.device("default.qubit", wires=NUM_QUBITS)
    optimizer = NesterovMomentumOptimizer(lr)
    data = genfromtxt("Data/dataset_3.csv", delimiter=",", skip_header=1)
    np.random.shuffle(data)
    feature = np.array(data[:, :2])
    label = np.array(data[:, 2])

    if feature_map_name is None:
        fm = get_default_feature_map_for_circuit(3)
    else:
        fm = get_feature_map_by_name(feature_map_name)
    features = np.array([fm.feature_map(x) for x in feature], requires_grad=False)
    encoder = EncoderRyRz()

    # Define the quantum node
    @qml.qnode(dev)
    def circuit(weights, x):
        encoder.encode(x)
        ansatz(weights)
        return qml.expval(qml.PauliZ(0))

    # Prepare training/validation splits
    num_data = len(label)
    num_train = int(TRAIN_SPLIT * num_data)
    feats_train, Y_train = features[:num_train], label[:num_train]
    feats_val, Y_val = features[num_train:], label[num_train:]

    # Initialize weights
    weights = 0.01 * np.random.randn(4, requires_grad=True)

    cost = partial(cost_fn, circuit)

    # Optimization loop
    cost_list, acc_val_list = [], []
    for iter in range(epoch_number):
        batch_index = np.random.randint(0, num_train, (BATCH_SIZE,))
        weights, _, _ = optimizer.step(
            cost, weights, feats_train[batch_index], Y_train[batch_index]
        )
        # Use feats_val for validation
        acc_val = accuracy(Y_val, np.sign(circuit(weights, feats_val.T)))
        cost_val = cost(weights, features, label)
        print(f"Iter: {iter + 1:5d} | Cost: {cost_val:0.7f} | Acc validation: {acc_val:0.7f}")
        cost_list.append(cost_val)
        acc_val_list.append(acc_val)

    # Compute encoded data from snapshots
    flag_list = encoder.flags()
    result = {flag: [] for flag in flag_list}
    all_encoded_data = {flag: [] for flag in flag_list}

    for data_point in features:
        encoded = qml.snapshots(circuit)(weights, data_point)
        for flag in flag_list:
            # For each snapshot, convert probabilities to strings
            all_encoded_data[flag].append(
                [format((ele.real**2 + ele.imag**2).item(), ".2f") for ele in encoded[flag]]
            )

    for flag in flag_list:
        target_probs_arr = np.array(all_encoded_data[flag])
        # Convert each element to float
        prob_measure_q0_0 = np.array(
            [float(a) + float(b) for a, b in zip(target_probs_arr[:, 0], target_probs_arr[:, 1])]
        )
        prob_measure_q0_1 = np.array(
            [float(a) + float(b) for a, b in zip(target_probs_arr[:, 2], target_probs_arr[:, 3])]
        )
        diff = prob_measure_q0_1 - prob_measure_q0_0
        result[flag] = [diff.tolist(), prob_measure_q0_1.tolist(), prob_measure_q0_0.tolist()]

    # Compute boundary and performance metrics.
    cost_list = [float(x) for x in cost_list]
    acc_val_list = [float(x) for x in acc_val_list]
    trained_label = [float(x) for x in circuit(weights, features.T)]
    distribution_map = compute_distribution_map(
        circuit, weights, features, label, snapshot=flag_list[-1]
    )

    original_feature = feature.tolist()
    original_label = label.tolist()

    result_to_return = {
        "original_data": {"feature": original_feature, "label": original_label},
        "circuit": {
            "qubit_number": NUM_QUBITS,
            "encoder_step": encoder.num_steps(),
            "encoder": encoder.steps(),
            "ansatz": ansatz_steps,
            "measure": [["Measure(Z)", ""]],
        },
        "encoded_data": {"feature": original_feature, "label": result[flag_list[-1]][0]},
        "performance": {"epoch_number": epoch_number, "loss": cost_list, "accuracy": acc_val_list},
        "trained_data": {"feature": original_feature, "label": trained_label},
        "encoded_steps": [
            {"feature": original_feature, "label": result[f][0]} for f in flag_list[:-1]
        ],
        "encoded_steps_sub": [
            [
                {"feature": original_feature, "label": result[f][1]},
                {"feature": original_feature, "label": result[f][2]},
            ]
            for f in flag_list[:-1]
        ],
        "distribution_map": distribution_map,
    }

    # Recursively convert the result to plain Python types.
    # Attach feature map formula for frontend description
    result_to_return["feature_map_formula"] = fm.get_formula()

    plain_result = recursive_convert(result_to_return)
    return plain_result
