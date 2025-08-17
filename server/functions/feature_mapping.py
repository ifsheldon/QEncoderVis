from pennylane import numpy as np
from abc import ABC, abstractmethod


class FeatureMap(ABC):
    @abstractmethod
    def feature_map(self, x):
        pass

    @abstractmethod
    def get_formula(self):
        pass


# def get_angles_arcsin(x):
#     # ###
#     beta0 = 2 * np.arcsin(np.sqrt(x[0]))
#     beta1 = 2 * np.arcsin(np.sqrt(x[1]))
#     return [beta0, beta1]


class FMArcsin(FeatureMap):
    def feature_map(self, x):
        beta0 = 2 * np.arcsin(np.sqrt(x[0]))
        beta1 = 2 * np.arcsin(np.sqrt(x[1]))
        return [beta0, beta1]

    def get_formula(self):
        # latex formula
        return r"\beta_0 = 2 \cdot \arcsin(\sqrt{x_0}), \beta_1 = 2 \cdot \arcsin(\sqrt{x_1})"


# def get_angles_arc_log_trig(x):
#     return [
#         np.arccos(np.clip(x[0], -1, 1)) + np.log1p(x[0]) + np.sin(np.pi * x[1]),
#         np.arcsin(np.clip(x[1], -1, 1)) + np.log1p(x[1]) + np.cos(np.pi * x[0]),
#     ]


class FMArcLogTrig(FeatureMap):
    def feature_map(self, x):
        # Corresponds to get_angles_arc_log_trig
        beta0 = np.arccos(np.clip(x[0], -1, 1)) + np.log1p(x[0]) + np.sin(np.pi * x[1])
        beta1 = np.arcsin(np.clip(x[1], -1, 1)) + np.log1p(x[1]) + np.cos(np.pi * x[0])
        return [beta0, beta1]

    def get_formula(self):
        return r"\beta_0 = \arccos(\mathrm{clip}(x_0, -1, 1)) + \log(1 + x_0) + \sin(\pi x_1),\ \beta_1 = \arcsin(\mathrm{clip}(x_1, -1, 1)) + \log(1 + x_1) + \cos(\pi x_0)"


class FMArctanTrig(FeatureMap):
    def feature_map(self, x):
        # Corresponds to get_angles_arctan_trig
        beta0 = np.pi * np.arctan(x[0]) + np.cos(np.pi * x[1])
        beta1 = np.pi * np.arctan(x[1]) + np.sin(np.pi * x[0])
        return [beta0, beta1]

    def get_formula(self):
        return r"\beta_0 = \pi \cdot \arctan(x_0) + \cos(\pi x_1),\ \beta_1 = \pi \cdot \arctan(x_1) + \sin(\pi x_0)"


# def get_angles_exp_trig(x):
#     return [
#         np.pi * np.exp(-x[0]) + np.sin(2 * np.pi * x[1]),
#         np.pi * np.exp(-x[1]) + np.cos(2 * np.pi * x[0]),
#     ]


class FMExpTrig(FeatureMap):
    def feature_map(self, x):
        # Corresponds to get_angles_exp_trig
        beta0 = np.pi * np.exp(-x[0]) + np.sin(2 * np.pi * x[1])
        beta1 = np.pi * np.exp(-x[1]) + np.cos(2 * np.pi * x[0])
        return [beta0, beta1]

    def get_formula(self):
        return r"\beta_0 = \pi \cdot e^{-x_0} + \sin(2\pi x_1),\ \beta_1 = \pi \cdot e^{-x_1} + \cos(2\pi x_0)"


# ------------------------------
# Registry and helpers for FeatureMaps
# ------------------------------
FEATURE_MAP_CLASSES = {
    "FMArcsin": FMArcsin,
    "FMArcLogTrig": FMArcLogTrig,
    "FMArctanTrig": FMArctanTrig,
    "FMExpTrig": FMExpTrig,
}

ALLOWED_FEATURE_MAP_NAMES = set(FEATURE_MAP_CLASSES.keys())


def get_feature_map_by_name(name):
    """
    Return an instance of the FeatureMap class by name.
    Raises KeyError if the name is not registered.
    """
    cls = FEATURE_MAP_CLASSES.get(name)
    if cls is None:
        raise KeyError(f"Unknown feature map name: {name}")
    return cls()


DEFAULT_FEATURE_MAP_BY_CIRCUIT = {
    0: "FMArcsin",
    1: "FMArcsin",
    2: "FMArcsin",
    3: "FMArcLogTrig",
    4: "FMArctanTrig",
    5: "FMExpTrig",
}


def get_default_feature_map_for_circuit(circuit_id: int):
    name = DEFAULT_FEATURE_MAP_BY_CIRCUIT[circuit_id]
    return get_feature_map_by_name(name)
