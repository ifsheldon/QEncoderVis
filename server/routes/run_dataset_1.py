# More tests based on 13.py by Rohan


import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
import matplotlib.pyplot as plt
import math

from numpy import genfromtxt


def run_dataset_1():
    # Adjusting for a 2-dimensional feature input
    num_qubits = 2
    repetition = 2
    train_split = 0.75
    num_per_side = 50
    dataset_source = "Data/dataset_1.csv"

    seed = 3407
    np.random.seed(seed)

    dev = qml.device("default.qubit", wires=num_qubits)
    lr = 0.04
    optimizer = NesterovMomentumOptimizer(lr)
    batch_size = 3
    epoch_number = 200

    def get_angles(x):
        # ###
        beta0 = 2 * np.arcsin(np.sqrt(x[0]))
        beta1 = 2 * np.arcsin(np.sqrt(x[1]))

        return [beta0, beta1]

    # Data
    # data = make_moon()
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    np.random.shuffle(data)

    # print(data)
    # exit()
    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])

    X = np.array(X)

    features = np.array([get_angles(x) for x in X], requires_grad=False)

    @qml.qnode(dev)
    def circuit(weights, x):
        # ### encoding
        qml.Hadamard(wires=0)
        qml.Hadamard(wires=1)
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        # qml.CNOT(wires=[0,1])

        # encoding
        # qml.RZ(x[0], wires=0)
        # qml.RZ(x[1], wires=1)

        # qml.RZ(x[0], wires=0)
        # qml.RZ(x[1], wires=1)

        qml.Snapshot("encoded")

        # ansatz

        qml.RZ(weights[0], wires=0)
        qml.RY(weights[1], wires=0)

        qml.RZ(weights[2], wires=1)
        qml.RY(weights[3], wires=1)

        qml.CNOT(wires=[0, 1])

        return qml.expval(qml.PauliZ(0))  ### single qubit measurement

    # Prepare training and validation splits
    num_data = len(Y)
    num_train = int(train_split * num_data)
    feats_train = features[:num_train]
    Y_train = Y[:num_train]
    feats_val = features[num_train:]
    Y_val = Y[num_train:]

    # Initialize weights
    weights_init = 0.01 * np.random.randn(4, requires_grad=True)

    def cost(weights, X, Y):
        predictions = circuit(weights, X.T)
        return np.mean((Y - predictions) ** 2)

    def accuracy(labels, predictions):
        predictions = np.sign(predictions)
        acc = np.mean(labels == predictions)
        return acc

    # Optimization
    weights = weights_init
    cost_list = []
    acc_val_list = []
    counter = 0

    for iter in range(epoch_number):
        batch_index = np.random.randint(0, num_train, (batch_size,))
        feats_train_batch = feats_train[batch_index]
        Y_train_batch = Y_train[batch_index]

        weights, _, _ = optimizer.step(cost, weights, feats_train_batch, Y_train_batch)
        # print(qml.snapshots(circuit)(weights, feats_train_batch))
        # print(counter)

        predictions_val = np.sign(circuit(weights, feats_val.T))
        acc_val = accuracy(Y_val, predictions_val)

        # print(Y_val, predictions_val)
        # exit()
        _cost = cost(weights, features, Y)
        print(f"Iter: {iter + 1:5d} | Cost: {_cost:0.7f} | Acc validation: {acc_val:0.7f} ")
        cost_list.append(_cost)
        acc_val_list.append(acc_val)

        counter = counter + 1

    # extract and draw the encoded data
    target_probs_list = []

    for i, data_point in enumerate(features):
        encoded = qml.snapshots(circuit)(weights, data_point)["encoded"]
        target_probs = [format((ele.real**2 + ele.imag**2).item(), ".2f") for ele in encoded]
        target_probs_list.append(target_probs)

    target_probs_list = np.array(target_probs_list)

    x_coords = [x[0] for x in X]
    y_coords = [x[1] for x in X]

    # test qubit 0 measured expectancy
    result1 = np.array(
        [
            float(a.item()) + float(b.item())
            for a, b in zip(target_probs_list[:, 0], target_probs_list[:, 1])
        ]
    )
    result2 = np.array(
        [
            float(a.item()) + float(b.item())
            for a, b in zip(target_probs_list[:, 2], target_probs_list[:, 3])
        ]
    )

    # # test qubit 1 measured expectancy
    # result1 = np.array([float(a.item()) + float(b.item()) for a, b in zip(target_probs_list[:, 0], target_probs_list[:, 2])])
    # result2 = np.array([float(a.item()) + float(b.item()) for a, b in zip(target_probs_list[:, 1], target_probs_list[:, 3])])

    result3 = result2 - result1

    # draw trained label figure

    # plt.scatter(x_coords, y_coords, c=circuit(weights, features.T), cmap="viridis", vmin=color_min, vmax=color_max)

    #############################################################################################################
    # 画original data的数据
    # convert tensor to number
    X = [[round(item[0].numpy(), 3), round(item[1].numpy(), 3)] for item in X]
    Y = [round(item.item(), 3) for item in Y]

    return {
        "original_data": {"feature": X, "label": Y},
        "circuit": circuit_implementation,
        "encoded_data": {"feature": feature, "label": result3},
        "boundary": grouped_boundary,
        "performance": {"epoch_number": epoch_number, "loss": cost_list, "accuracy": acc_val_list},
        "trained_data": {"feature": feature, "label": trained_label},
    }

    return "success"
