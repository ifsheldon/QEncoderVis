from pennylane import numpy as np
from numpy import genfromtxt
from functools import lru_cache


@lru_cache(maxsize=6)
def get_dataset(dataset_source: str):
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])
    return X, Y


@lru_cache(maxsize=6)
def get_original_data(dataset_source: str):
    X, Y = get_dataset(dataset_source)
    original_feature = X.tolist()
    original_label = Y.tolist()
    return {"feature": original_feature, "label": original_label}
