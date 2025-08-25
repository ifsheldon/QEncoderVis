from pennylane import numpy as np
from numpy import genfromtxt
from functools import lru_cache


@lru_cache(maxsize=6)
def get_dataset(dataset_source: str):
    data = genfromtxt(dataset_source, delimiter=",", skip_header=1)
    X = np.array(data[:, :2])
    Y = np.array(data[:, 2])
    return X, Y
