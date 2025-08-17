import pennylane as qml
from abc import ABC, abstractmethod
from typing import List


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


class EncoderRxRyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RX(x)", "RX(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["CNOT-0", "CNOT-1"],  # encoder step 3
        ]

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


class EncoderRyRz(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RY(x)"],  # encoder step 1
            ["RZ(x)", "RZ(x)"],  # encoder step 2
        ]

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


class EncoderRzRyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RZ(x)", "RZ(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["CNOT-0", "CNOT-1"],  # encoder step 3
        ]

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


class EncoderRyRx(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RY(x)", "RY(x)"],  # encoder step 1
            ["RX(x)", "RX(x)"],  # encoder step 2
        ]

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


class EncoderRxRyRyCnot(Encoder):
    @staticmethod
    def steps() -> List[List[str]]:
        return [
            ["RX(x)", "RX(x)"],  # encoder step 1
            ["RY(x)", "RY(x)"],  # encoder step 2
            ["RY(x)", "RY(x)"],  # encoder step 3
            ["CNOT-0", "CNOT-1"],  # encoder step 4
        ]

    def encode(self, x):
        flags = self.flags()
        qml.Snapshot(flags[0])
        qml.RX(x[0], wires=0)
        qml.RX(x[1], wires=1)
        qml.Snapshot(flags[1])
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[2])
        qml.RY(x[0], wires=0)
        qml.RY(x[1], wires=1)
        qml.Snapshot(flags[3])
        qml.CNOT(wires=[0, 1])
        qml.Snapshot(flags[4])


# def rx_ry_ry_cnot_encode(x):
#     qml.Snapshot("flag1")
#     qml.RX(x[0], wires=0)
#     qml.RX(x[1], wires=1)
#     qml.Snapshot("flag2")
#     qml.RY(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag3")
#     qml.RY(x[0], wires=0)
#     qml.RY(x[1], wires=1)
#     qml.Snapshot("flag4")
#     qml.CNOT(wires=[0, 1])
#     qml.Snapshot("flag5")
