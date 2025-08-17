# good encoder 1 (bad encoder 2 is also from this encoder circuit but implementation has not been saved)

import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
from functions.dim_reduction import compute_distribution_map

from numpy import genfromtxt
from functions.utils import recursive_convert
from functions.encoding import (
    ry_rx_encode,
    get_feature_map_by_name,
    get_default_feature_map_for_circuit,
)


def run_circuit_4(feature_map_name: str | None = None):
    num_qubits = 2
    train_split = 0.75
    num_per_side = 20
    seed = 3407
    np.random.seed(seed)

    dev = qml.device("default.qubit", wires=num_qubits)
    lr = 0.02
    optimizer = NesterovMomentumOptimizer(lr)
    batch_size = 3
    epoch_number = 100

    data = genfromtxt("Data/dataset_4.csv", delimiter=",", skip_header=1)
    np.random.shuffle(data)

    feature = np.array(data[:, :2])
    label = np.array(data[:, 2])

    if feature_map_name is None:
        fm = get_default_feature_map_for_circuit(4)
    else:
        fm = get_feature_map_by_name(feature_map_name)
    features = np.array([fm.feature_map(x) for x in feature], requires_grad=False)

    # Define the quantum node
    @qml.qnode(dev)
    def circuit(weights, x):
        ry_rx_encode(x)

        # Ansatz
        qml.RZ(weights[0], wires=0)
        qml.RY(weights[1], wires=0)
        qml.RZ(weights[2], wires=1)
        qml.RY(weights[3], wires=1)
        qml.CNOT(wires=[0, 1])
        return qml.expval(qml.PauliZ(0))

    # Prepare training/validation splits
    num_data = len(label)
    num_train = int(train_split * num_data)
    feats_train, Y_train = features[:num_train], label[:num_train]
    feats_val, Y_val = features[num_train:], label[num_train:]

    # Initialize weights
    weights = 0.01 * np.random.randn(4, requires_grad=True)

    def cost(weights, X, Y):
        return np.mean((Y - circuit(weights, X.T)) ** 2)

    def accuracy(labels, predictions):
        return np.mean(labels == np.sign(predictions))

    # Optimization loop
    cost_list, acc_val_list = [], []
    for iter in range(epoch_number):
        batch_index = np.random.randint(0, num_train, (batch_size,))
        weights, _, _ = optimizer.step(
            cost, weights, feats_train[batch_index], Y_train[batch_index]
        )
        # Use feats_val for validation
        acc_val = accuracy(Y_val, np.sign(circuit(weights, feats_val.T)))
        _cost = cost(weights, features, label)
        print(f"Iter: {iter + 1:5d} | Cost: {_cost:0.7f} | Acc validation: {acc_val:0.7f}")
        cost_list.append(_cost)
        acc_val_list.append(acc_val)

    # Compute encoded data from snapshots
    flag_list = ["flag1", "flag2", "flag3"]
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
    distribution_map = compute_distribution_map(circuit, weights, features, label, snapshot="flag3")

    original_feature = feature.tolist()
    original_label = label.tolist()

    result_to_return = {
        "original_data": {"feature": original_feature, "label": original_label},
        "circuit": {
            "qubit_number": 2,
            "encoder_step": 2,
            "encoder": [["RY(x)", "RY(x)"], ["RX(x)", "RX(x)"]],
            "ansatz": [["RZ", "RZ"], ["RY", "RY"], ["CX-0", "CX-1"]],
            "measure": [["Measure(Z)", ""]],
        },
        "encoded_data": {"feature": original_feature, "label": result["flag3"][0]},
        "performance": {"epoch_number": epoch_number, "loss": cost_list, "accuracy": acc_val_list},
        "trained_data": {"feature": original_feature, "label": trained_label},
        "encoded_steps": [
            {"feature": original_feature, "label": result[flag][0]} for flag in ["flag1", "flag2"]
        ],
        "encoded_steps_sub": [
            [
                {"feature": original_feature, "label": result[flag][1]},
                {"feature": original_feature, "label": result[flag][2]},
            ]
            for flag in ["flag1", "flag2"]
        ],
        "distribution_map": distribution_map,
    }

    # Recursively convert the result to plain Python types.
    # Attach feature map formula for frontend description
    result_to_return["feature_map_formula"] = fm.get_formula()

    plain_result = recursive_convert(result_to_return)
    return plain_result
