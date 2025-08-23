import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
from numpy import genfromtxt

from functions.dim_reduction import compute_distribution_map
from functions.encoding import Encoder
from functions.utils import recursive_convert
from routes.hyperparameters import (
    TRAIN_SPLIT,
    NUM_QUBITS,
    BATCH_SIZE,
)

from routes.ansatz import ansatz, ansatz_steps
from routes.cost import cost as cost_fn
from functools import partial
from routes.accuracy import accuracy
from routes.get_original_data import get_dataset


def run_circuit(encoder: Encoder, epoch_number: int, lr: float, dataset_source: str):
    X, Y = get_dataset(dataset_source)
    permutation = np.random.permutation(len(X))
    X = X[permutation]
    Y = Y[permutation]

    fm = encoder.get_feature_mapping()
    features = np.array([fm.feature_map(x) for x in X], requires_grad=False)

    dev = qml.device("default.qubit", wires=NUM_QUBITS)

    @qml.qnode(dev)
    def circuit(weights, x):
        encoder.encode(x)
        ansatz(weights)
        return qml.expval(qml.PauliZ(0))  ### single qubit measurement

    # Prepare training and validation splits
    num_data = len(Y)
    num_train = int(TRAIN_SPLIT * num_data)
    feats_train = features[:num_train]
    Y_train = Y[:num_train]
    feats_val = features[num_train:]
    Y_val = Y[num_train:]

    # Initialize weights
    weights_init = 0.01 * np.random.randn(4, requires_grad=True)

    cost = partial(cost_fn, circuit)

    # Optimization
    weights = weights_init
    costs = np.zeros(epoch_number)
    acc_values = np.zeros(epoch_number)
    optimizer = NesterovMomentumOptimizer(lr)

    for iter in range(epoch_number):
        batch_index = np.random.randint(0, num_train, (BATCH_SIZE,))
        feats_train_batch = feats_train[batch_index]
        Y_train_batch = Y_train[batch_index]

        weights, _, _ = optimizer.step(cost, weights, feats_train_batch, Y_train_batch)

        predictions_val = np.sign(circuit(weights, feats_val.T))
        acc_val = accuracy(Y_val, predictions_val)
        cost_val = cost(weights, features, Y)
        print(f"Iter: {iter + 1:5d} | Cost: {cost_val:0.7f} | Acc validation: {acc_val:0.7f} ")
        costs[iter] = cost_val
        acc_values[iter] = acc_val

    flag_list = encoder.flags()
    # record all encoded data for each flag
    all_encoded_data = {flag: [] for flag in flag_list}
    for data_point in features:
        encoded = qml.snapshots(circuit)(weights, data_point)
        for flag in flag_list:
            state_for_single_datapoint = encoded[flag]
            target_probs = np.abs(state_for_single_datapoint) ** 2
            all_encoded_data[flag].append(target_probs)

    # test qubit 0 measured expectancy
    expvalues = {}
    probs_measure_q0_1 = {}
    probs_measure_q0_0 = {}
    for flag in flag_list:
        target_probs = np.stack(all_encoded_data[flag])
        prob_measure_q0_0 = np.sum(target_probs[:, :2], axis=-1)
        prob_measure_q0_1 = np.sum(target_probs[:, 2:], axis=-1)
        expval = prob_measure_q0_1 - prob_measure_q0_0
        expvalues[flag] = expval.tolist()
        probs_measure_q0_1[flag] = prob_measure_q0_1.tolist()
        probs_measure_q0_0[flag] = prob_measure_q0_0.tolist()

    distribution_map = compute_distribution_map(
        circuit, weights, features, Y, snapshot=flag_list[-1]
    )

    # 创建dict for encoder, 来给前端返回, 画circuit的数据
    circuit_implementation = {
        "qubit_number": NUM_QUBITS,
        "encoder_step": encoder.num_steps(),
        "encoder": encoder.steps(),
        "ansatz": ansatz_steps,
        "measure": [["Measure(Z)", ""]],
    }

    original_feature = X.tolist()
    # 创建trained map的数据
    trained_label = [float(x) for x in circuit(weights, features.T)]

    result_to_return = {
        "circuit": circuit_implementation,
        "encoded_data": {"feature": original_feature, "label": expvalues[flag_list[-1]]},
        "performance": {
            "epoch_number": epoch_number,
            "loss": costs.tolist(),
            "accuracy": acc_values.tolist(),
        },
        "trained_data": {"feature": original_feature, "label": trained_label},
        "encoded_steps": [
            {"feature": original_feature, "label": expvalues[f]} for f in flag_list[:-1]
        ],
        "encoded_steps_sub": [
            [
                {"feature": original_feature, "label": probs_measure_q0_1[f]},
                {"feature": original_feature, "label": probs_measure_q0_0[f]},
            ]
            for f in flag_list[:-1]
        ],
        "distribution_map": distribution_map,
        "feature_map_formula": fm.get_formula(),
    }

    plain_result = recursive_convert(result_to_return)
    return plain_result
