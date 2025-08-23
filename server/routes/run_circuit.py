import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer

from functions.encoding import Encoder
from functions.utils import recursive_convert
from routes.hyperparameters import (
    TRAIN_SPLIT,
    NUM_QUBITS,
    BATCH_SIZE,
)

from routes.ansatz import ansatz
from routes.cost import cost as cost_fn
from functools import partial
from routes.accuracy import accuracy
from routes.get_original_data import get_dataset

from sklearn.decomposition import PCA
from functools import lru_cache
import time

DELAY_BETWEEN_EPOCHS = 0.15


@lru_cache(maxsize=12)
def get_encoded_data(dataset_source: str, encoder: Encoder):
    features_for_encoding, labels = get_dataset(dataset_source)
    fm = encoder.get_feature_mapping()
    features = np.array([fm.feature_map(x) for x in features_for_encoding], requires_grad=False)

    dev = qml.device("default.qubit", wires=NUM_QUBITS)

    @qml.qnode(dev)
    def circuit(x):
        encoder.encode(x)
        return qml.expval(qml.PauliZ(0))

    flag_list = encoder.flags()
    all_encoded_data = {flag: [] for flag in flag_list}
    last_flag = flag_list[-1]
    density_matrices = []
    for data_point in features:
        encoded = qml.snapshots(circuit)(data_point)
        # calculate data needed for encoder map
        for flag in flag_list:
            state_for_single_datapoint = encoded[flag]
            target_probs = np.abs(state_for_single_datapoint) ** 2
            all_encoded_data[flag].append(target_probs)
        # calculate data needed for distribution map
        state_vector = encoded[last_flag]
        psi = np.array(state_vector)
        density_matrix = np.outer(psi, np.conj(psi))
        # Convert the flattened density matrix to its real part.
        flat_density = np.real(density_matrix.flatten())
        density_matrices.append(flat_density)
    density_matrices = np.array(density_matrices)

    # Apply PCA to reduce to 2 dimensions.
    pca = PCA(n_components=2)
    coords = pca.fit_transform(density_matrices)

    # Combine the coordinates with their corresponding labels.
    distribution_map = []
    for i, coord in enumerate(coords):
        distribution_map.append(
            {"x": float(coord[0]), "y": float(coord[1]), "label": float(labels[i])}
        )

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

    return (
        features_for_encoding,
        expvalues,
        probs_measure_q0_1,
        probs_measure_q0_0,
        distribution_map,
    )


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

    original_feature = X.tolist()
    # 创建trained map的数据
    trained_label = [float(x) for x in circuit(weights, features.T)]

    result_to_return = {
        "performance": {
            "epoch_number": epoch_number,
            "loss": costs.tolist(),
            "accuracy": acc_values.tolist(),
        },
        "trained_data": {"feature": original_feature, "label": trained_label},
        "feature_map_formula": fm.get_formula(),
    }

    plain_result = recursive_convert(result_to_return)
    return plain_result


def run_circuit_stream(
    encoder: Encoder, epoch_number: int, lr: float, dataset_source: str, control: dict
):
    """
    Streaming variant of run_circuit that yields per-epoch training updates.

    control: a mutable dict with keys like 'paused' (bool) and 'stopped' (bool).
    The caller may mutate these flags to pause/resume/stop the loop.
    """

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
        return qml.expval(qml.PauliZ(0))

    # Prepare training and validation splits
    num_data = len(Y)
    num_train = int(TRAIN_SPLIT * num_data)
    feats_train = features[:num_train]
    Y_train = Y[:num_train]
    feats_val = features[num_train:]
    Y_val = Y[num_train:]

    # Initialize weights
    weights = 0.01 * np.random.randn(4, requires_grad=True)

    cost = partial(cost_fn, circuit)
    optimizer = NesterovMomentumOptimizer(lr)

    for iter in range(epoch_number):
        # Handle pause
        while control.get("paused") and not control.get("stopped"):
            time.sleep(0.1)
        if control.get("stopped"):
            break

        batch_index = np.random.randint(0, num_train, (BATCH_SIZE,))
        feats_train_batch = feats_train[batch_index]
        Y_train_batch = Y_train[batch_index]

        weights, _, _ = optimizer.step(cost, weights, feats_train_batch, Y_train_batch)

        predictions_val = np.sign(circuit(weights, feats_val.T))
        acc_val = accuracy(Y_val, predictions_val)
        cost_val = cost(weights, features, Y)

        # Current trained labels for all features
        trained_label = [float(x) for x in circuit(weights, features.T)]

        time.sleep(DELAY_BETWEEN_EPOCHS)

        # Yield incremental update
        yield recursive_convert(
            {
                "epoch": iter + 1,
                "epoch_number": epoch_number,
                "loss": float(cost_val.round(3)),
                "accuracy": float(acc_val),
                "trained_data": {"feature": X.tolist(), "label": trained_label},
            }
        )
