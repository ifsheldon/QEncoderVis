import numpy as np
from sklearn.decomposition import PCA
import pennylane as qml


def compute_distribution_map(circuit, weights, features, labels, snapshot):
    density_matrices = []
    for i, data_point in enumerate(features):
        encoded = qml.snapshots(circuit)(weights, data_point)
        # Get the snapshot specified by the snapshot parameter.
        state_vector = encoded[snapshot]
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
        distribution_map.append({"x": float(coord[0]), "y": float(coord[1]), "label": labels[i]})
    return distribution_map
