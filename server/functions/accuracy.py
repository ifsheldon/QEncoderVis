from pennylane import numpy as np


def accuracy(labels, predictions):
    predictions = np.sign(predictions)
    acc = np.mean(labels == predictions)
    return acc
