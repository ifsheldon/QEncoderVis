import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
from numpy import genfromtxt

from functions.detect_boundary import detect_boundary, assign_and_order_dots
from functions.dim_reduction import compute_distribution_map
from functions.utils import recursive_convert
from functions.encoding import FMArcsin, rx_ry_cnot_encode


def run_circuit_2():
    # Adjusting for a 2-dimensional feature input
    num_qubits = 2
    repetition = 2
    train_split = 0.75
    num_per_side = 20
    dataset_source = "Data/dataset_2.csv"

    seed = 3407
    np.random.seed(seed)

    dev = qml.device("default.qubit", wires=num_qubits)
    lr = 0.02
    optimizer = NesterovMomentumOptimizer(lr)
    batch_size = 3
    epoch_number = 100

    # Data
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    np.random.shuffle(data)

    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])

    X = np.array(X)

    fm = FMArcsin()
    features = np.array([fm.feature_map(x) for x in X], requires_grad=False)

    @qml.qnode(dev)
    def circuit(weights, x):
        # Provide snapshots so frontend encoded step views are available
        # Encoding: RX -> RY -> CNOT
        rx_ry_cnot_encode(x)

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

        predictions_val = np.sign(circuit(weights, feats_val.T))
        acc_val = accuracy(Y_val, predictions_val)
        _cost = cost(weights, features, Y)
        print(f"Iter: {iter + 1:5d} | Cost: {_cost:0.7f} | Acc validation: {acc_val:0.7f} ")  # ###
        cost_list.append(_cost)
        acc_val_list.append(acc_val)

        counter = counter + 1

    # extract and draw the encoded data
    target_probs_list = []

    flag_list = ["flag1", "flag2", "flag3", "flag4"]

    all_encoded_data = {
        "flag1": [],
        "flag2": [],
        "flag3": [],
        "flag4": [],
    }

    result = {
        "flag1": [],
        "flag2": [],
        "flag3": [],
        "flag4": [],
    }

    for i, data_point in enumerate(features):
        encoded = qml.snapshots(circuit)(weights, data_point)
        for flag in flag_list:
            state_for_single_datapoint = encoded[flag]
            target_probs = [
                format((ele.real**2 + ele.imag**2).item(), ".2f")
                for ele in state_for_single_datapoint
            ]
            all_encoded_data[flag].append(target_probs)

    # test qubit 0 measured expectancy
    for flag in flag_list:
        target_probs_list = all_encoded_data[flag]
        target_probs_list = np.array(target_probs_list)

        prob_measure_q0_0 = np.array(
            [
                float(a.item()) + float(b.item())
                for a, b in zip(target_probs_list[:, 0], target_probs_list[:, 1])
            ]
        )
        prob_measure_q0_1 = np.array(
            [
                float(a.item()) + float(b.item())
                for a, b in zip(target_probs_list[:, 2], target_probs_list[:, 3])
            ]
        )

        expval = [x.item() for x in (prob_measure_q0_1 - prob_measure_q0_0)]
        prob_measure_q0_1 = [x.item() for x in prob_measure_q0_1]
        prob_measure_q0_0 = [x.item() for x in prob_measure_q0_0]

        result[flag] = [expval, prob_measure_q0_1, prob_measure_q0_0]

    #############################################################################################################
    # 画original data的数据
    # convert tensor to number
    feature = [[round(item[0].numpy(), 3), round(item[1].numpy(), 3)] for item in X]
    label = [round(item.item(), 3) for item in Y]

    # 画encoder map里面的boundary线的数据
    boundary = detect_boundary(feature, label, num_per_side)
    grouped_boundary = assign_and_order_dots(boundary, 2)
    grouped_boundary = [
        [[float(tensor.item()) for tensor in pair] for pair in region]
        for region in grouped_boundary
    ]

    #  画acc和loss的数据
    cost_list = [x.item() for x in cost_list]
    acc_val_list = [x.item() for x in acc_val_list]
    distribution_map = compute_distribution_map(circuit, weights, features, Y, snapshot="flag3")

    # 创建dict for encoder, 来给前端返回, 画circuit的数据
    circuit_implementation = {
        "qubit_number": 2,
        "encoder_step": 3,
        "encoder": [
            ["H", "H"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["CNOT-0", "CNOT-1"],  # encoder step 3
        ],
        "ansatz": [
            ["RZ", "RZ"],  # ansatz step 1
            ["RY", "RY"],  # ansatz step 2
            ["CX-0", "CX-1"],  # ansatz step 3
        ],
        "measure": [["Measure(Z)", ""]],
    }

    # 创建trained map的数据
    trained_label = [x.item() for x in circuit(weights, features.T)]

    result_to_return = {
        "original_data": {"feature": feature, "label": label},
        "circuit": circuit_implementation,
        "encoded_data": {"feature": feature, "label": result["flag4"][0]},
        # 'boundary': grouped_boundary,
        "performance": {"epoch_number": epoch_number, "loss": cost_list, "accuracy": acc_val_list},
        "trained_data": {"feature": feature, "label": trained_label},
        "encoded_steps": [
            {"feature": feature, "label": result["flag1"][0]},
            {"feature": feature, "label": result["flag2"][0]},
            {"feature": feature, "label": result["flag3"][0]},
        ],
        "encoded_steps_sub": [
            [
                {"feature": feature, "label": result["flag1"][1]},
                {"feature": feature, "label": result["flag1"][2]},
            ],
            [
                {"feature": feature, "label": result["flag2"][1]},
                {"feature": feature, "label": result["flag2"][2]},
            ],
            [
                {"feature": feature, "label": result["flag3"][1]},
                {"feature": feature, "label": result["flag3"][2]},
            ],
        ],
        "distribution_map": distribution_map,
    }

    plain_result = recursive_convert(result_to_return)
    return plain_result
