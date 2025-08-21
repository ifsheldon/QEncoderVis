from pennylane import numpy as np
from numpy import genfromtxt


def get_original_data(dataset_source: str):
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])
    original_feature = X.tolist()
    original_label = Y.tolist()
    return {"feature": original_feature, "label": original_label}
