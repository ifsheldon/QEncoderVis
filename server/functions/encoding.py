from pennylane import numpy as np


def get_angles_arcsin(x):
    # ###
    beta0 = 2 * np.arcsin(np.sqrt(x[0]))
    beta1 = 2 * np.arcsin(np.sqrt(x[1]))

    return [beta0, beta1]


def get_angles_arc_log_trig(x):
    return [
        np.arccos(np.clip(x[0], -1, 1)) + np.log1p(x[0]) + np.sin(np.pi * x[1]),
        np.arcsin(np.clip(x[1], -1, 1)) + np.log1p(x[1]) + np.cos(np.pi * x[0]),
    ]


def get_angles_arctan_trig(x):
    return [
        np.pi * np.arctan(x[0]) + np.cos(np.pi * x[1]),
        np.pi * np.arctan(x[1]) + np.sin(np.pi * x[0]),
    ]


def get_angles_exp_trig(x):
    return [
        np.pi * np.exp(-x[0]) + np.sin(2 * np.pi * x[1]),
        np.pi * np.exp(-x[1]) + np.cos(2 * np.pi * x[0]),
    ]
