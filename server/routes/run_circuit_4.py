# good encoder 1 (bad encoder 2 is also from this encoder circuit but implementation has not been saved)

import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
import math
import json

from functions.detect_boundary import detect_boundary, assign_and_order_dots
from functions.dim_reduction import compute_distribution_map

from numpy import genfromtxt


def recursive_convert(o):
    """
    Recursively convert objects to plain Python types.
    If an object has a 'tolist' method, call it and recursively convert the result.
    """
    if isinstance(o, dict):
        return {k: recursive_convert(v) for k, v in o.items()}
    elif isinstance(o, (list, tuple)):
        return [recursive_convert(x) for x in o]
    elif hasattr(o, "tolist"):
        return recursive_convert(o.tolist())
    elif isinstance(o, (int, float, str)):
        return o
    else:
        try:
            return float(o)
        except Exception:
            return o


def run_circuit_4():
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

    # Define feature mapping (angle encoding)
    def get_angles(x):
        return [
            np.pi * np.arctan(x[0]) + np.cos(np.pi * x[1]),
            np.pi * np.arctan(x[1]) + np.sin(np.pi * x[0]),
        ]

    data = genfromtxt("Data/dataset_4.csv", delimiter=",", skip_header=1)
    np.random.shuffle(data)

    feature = np.array(data[:, :2])
    label = np.array(data[:, 2])

    features = np.array([get_angles(x) for x in feature], requires_grad=False)

    # Define the quantum node
    @qml.qnode(dev)
    def circuit(weights, x):
        qml.Snapshot("flag1")
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)

        qml.Snapshot("flag2")
        qml.RX(x[1], wires=0)
        qml.RX(x[0], wires=1)

        qml.Snapshot("flag3")

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
    # boundary = assign_and_order_dots(detect_boundary(feature.tolist(), label.tolist(), num_per_side), 2)
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
        # 'boundary': boundary,
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
    plain_result = recursive_convert(result_to_return)
    return plain_result
