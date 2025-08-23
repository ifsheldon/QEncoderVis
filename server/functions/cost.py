from pennylane import numpy as np


def cost(circuit, weights, X, Y):
    predictions = circuit(weights, X.T)
    return np.mean((Y - predictions) ** 2)
