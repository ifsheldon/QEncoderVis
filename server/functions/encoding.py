import pennylane as qml
from abc import ABC, abstractmethod
from typing import List
from functions.feature_mapping import (
    FeatureMap,
    FMArcsin,
    FMArcLogTrig,
    FMArctanTrig,
    FMExpTrig,
    FMArcsinSqrt,
)


class Encoder(ABC):
    @staticmethod
    @abstractmethod
    def steps() -> List[List[str]]:
        pass

    def num_steps(self) -> int:
        return len(self.steps())

    def flags(self) -> List[str]:
        return [f"flag{i}" for i in range(1, self.num_steps() + 2)]

    @abstractmethod
    def encode(self, x):
        pass

    @staticmethod
    @abstractmethod
    def get_feature_mapping(self) -> FeatureMap:
        pass

    def __hash__(self) -> int:
        return hash(str(self.steps()))

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Encoder):
            return False
        return str(self.steps()) == str(other.steps())


class EncoderRxxRyyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RX(x)", "RX(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["CNOT-0", "CNOT-1"],  # encoder step 3
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        # Used by circuits 0 and 2 → default FMArcsin
        return FMArcsin()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RX(x[0], wires=0)
        qml.RX(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[2])
        qml.CNOT(wires=[0, 1])
        qml.Snapshot(flags[3])


# def rx_ry_cnot_encode(x):
#     qml.Snapshot("flag1")
#     qml.RX(x[0], wires=0)
#     qml.RX(x[1], wires=1)
#     qml.Snapshot("flag2")
#     qml.RY(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag3")
#     qml.CNOT(wires=[0, 1])
#     qml.Snapshot("flag4")


class EncoderRxyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RX(x)", "RY(x)"],  # encoder step 1
            ["CNOT-0", "CNOT-1"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        # Used by circuit 1 → default FMArcsin
        return FMArcsin()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RX(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.CNOT(wires=[0, 1])
        qml.Snapshot(flags[2])


# def rxy_cnot_encode(x):
#     qml.Snapshot("flag1")
#     qml.Snapshot("flag2")
#     qml.RX(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag3")
#     qml.CNOT(wires=[0, 1])
#     qml.Snapshot("flag4")


class EncoderRyyRzz(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RY(x)"],  # encoder step 1
            ["RZ(x)", "RZ(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        # Used by circuit 3 → default FMArcLogTrig
        return FMArcLogTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RZ(x[1], wires=0)
        qml.RZ(x[0], wires=1)
        qml.Snapshot(flags[2])


# def rz_ry_encode(x):
#     qml.Snapshot("flag1")
#     qml.RY(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag2")
#     qml.RZ(x[1], wires=0)
#     qml.RZ(x[0], wires=1)
#     qml.Snapshot("flag3")
#     qml.Snapshot("flag4")


class EncoderRzzRyyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RZ(x)", "RZ(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["CNOT-0", "CNOT-1"],  # encoder step 3
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        # Used by circuit 5 → default FMExpTrig
        return FMExpTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RZ(x[0], wires=0)
        qml.RZ(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[1], wires=0)
        qml.RY(x[0], wires=1)
        qml.Snapshot(flags[2])
        qml.CNOT(wires=[0, 1])
        qml.Snapshot(flags[3])


# def rz_ry_cnot_encode(x):
#     qml.Snapshot("flag1")
#     qml.RZ(x[0], wires=0)
#     qml.RZ(x[1], wires=1)
#     qml.Snapshot("flag2")
#     qml.RY(x[1], wires=0)
#     qml.RY(x[0], wires=1)
#     qml.Snapshot("flag3")
#     qml.CNOT(wires=[0, 1])
#     qml.Snapshot("flag4")


class EncoderRyyRxx(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RY(x)"],  # encoder step 1
            ["RX(x)", "RX(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        # Used by circuit 4 → default FMArctanTrig
        return FMArctanTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RX(x[1], wires=0)
        qml.RX(x[0], wires=1)
        qml.Snapshot(flags[2])


# def ry_rx_encode(x):
#     qml.Snapshot("flag1")
#     qml.RY(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag2")
#     qml.RX(x[1], wires=0)
#     qml.RX(x[0], wires=1)
#     qml.Snapshot("flag3")
#     qml.Snapshot("flag4")


class EncoderRyRz(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", ""],  # encoder step 1
            ["RZ(x)", ""],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        return FMArcsinSqrt()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RY(x[0], wires=0)
        qml.Snapshot(flags[1])
        qml.RZ(x[0], wires=0)
        qml.Snapshot(flags[2])


class EncoderRyzRyz(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RZ(x)"],  # encoder step 1
            ["RY(x)", "RZ(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        return FMArcLogTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RY(x[0], wires=0)
        qml.RZ(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[1], wires=0)
        qml.RZ(x[0], wires=1)
        qml.Snapshot(flags[2])


class EncoderRyxRyx(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RX(x)"],  # encoder step 1
            ["RY(x)", "RX(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        return FMArctanTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RY(x[0], wires=0)
        qml.RX(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[1], wires=0)
        qml.RX(x[0], wires=1)
        qml.Snapshot(flags[2])


class EncoderRzyRzy(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RZ(x)", "RY(x)"],  # encoder step 1
            ["RZ(x)", "RY(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        return FMExpTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RZ(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RZ(x[1], wires=0)
        qml.RY(x[0], wires=1)
        qml.Snapshot(flags[2])


class EncoderRzzRyy(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RZ(x)", "RZ(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
        ]

    @staticmethod
    def get_feature_mapping() -> FeatureMap:
        return FMExpTrig()

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RZ(x[0], wires=0)
        qml.RZ(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[1], wires=0)
        qml.RY(x[0], wires=1)
        qml.Snapshot(flags[2])
