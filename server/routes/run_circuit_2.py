import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
from numpy import genfromtxt

from functions.dim_reduction import compute_distribution_map
from functions.encoding import EncoderRxRyCnot
from functions.feature_mapping import (
    get_feature_map_by_name,
    get_default_feature_map_for_circuit,
)
from functions.utils import recursive_convert
from routes.hyperparameters import (
    TRAIN_SPLIT,
    NUM_QUBITS,
    BATCH_SIZE,
    DEFAULT_EPOCH_NUMBER,
    DEFAULT_LR,
)
from routes.ansatz import ansatz, ansatz_steps
from routes.cost import cost as cost_fn
from functools import partial
from routes.accuracy import accuracy


def run_circuit_2(
    feature_map_name: str | None = None,
    epoch_number: int = DEFAULT_EPOCH_NUMBER,
    lr: float = DEFAULT_LR,
):
    dataset_source = "Data/dataset_2.csv"
    dev = qml.device("default.qubit", wires=NUM_QUBITS)
    optimizer = NesterovMomentumOptimizer(lr)
    # Data
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    np.random.shuffle(data)
    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])

    if feature_map_name is None:
        fm = get_default_feature_map_for_circuit(2)
    else:
        fm = get_feature_map_by_name(feature_map_name)
    features = np.array([fm.feature_map(x) for x in X], requires_grad=False)
    encoder = EncoderRxRyCnot()

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
    cost_list = []
    acc_val_list = []
    counter = 0

    for iter in range(epoch_number):
        batch_index = np.random.randint(0, num_train, (BATCH_SIZE,))
        feats_train_batch = feats_train[batch_index]
        Y_train_batch = Y_train[batch_index]

        weights, _, _ = optimizer.step(cost, weights, feats_train_batch, Y_train_batch)

        predictions_val = np.sign(circuit(weights, feats_val.T))
        acc_val = accuracy(Y_val, predictions_val)
        cost_val = cost(weights, features, Y)
        print(
            f"Iter: {iter + 1:5d} | Cost: {cost_val:0.7f} | Acc validation: {acc_val:0.7f} "
        )  # ###
        cost_list.append(cost_val)
        acc_val_list.append(acc_val)

        counter = counter + 1

    # extract and draw the encoded data
    target_probs_list = []

    flag_list = encoder.flags()

    all_encoded_data = {flag: [] for flag in flag_list}

    result = {flag: [] for flag in flag_list}

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

    #  画acc和loss的数据
    cost_list = [x.item() for x in cost_list]
    acc_val_list = [x.item() for x in acc_val_list]
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

    # 创建trained map的数据
    trained_label = [x.item() for x in circuit(weights, features.T)]

    result_to_return = {
        "original_data": {"feature": feature, "label": label},
        "circuit": circuit_implementation,
        "encoded_data": {"feature": feature, "label": result[flag_list[-1]][0]},
        # 'boundary': grouped_boundary,
        "performance": {"epoch_number": epoch_number, "loss": cost_list, "accuracy": acc_val_list},
        "trained_data": {"feature": feature, "label": trained_label},
        "encoded_steps": [{"feature": feature, "label": result[f][0]} for f in flag_list[:-1]],
        "encoded_steps_sub": [
            [
                {"feature": feature, "label": result[f][1]},
                {"feature": feature, "label": result[f][2]},
            ]
            for f in flag_list[:-1]
        ],
        "distribution_map": distribution_map,
    }

    # Attach feature map formula for frontend description
    result_to_return["feature_map_formula"] = fm.get_formula()

    plain_result = recursive_convert(result_to_return)
    return plain_result
