import pennylane as qml


def rx_ry_cnot_encode(x):
    qml.Snapshot("flag1")
    qml.RX(x[0], wires=0)
    qml.RX(x[1], wires=1)
    qml.Snapshot("flag2")
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag3")
    qml.CNOT(wires=[0, 1])
    qml.Snapshot("flag4")


def rxy_cnot_encode(x):
    qml.Snapshot("flag1")
    qml.Snapshot("flag2")
    qml.RX(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag3")
    qml.CNOT(wires=[0, 1])
    qml.Snapshot("flag4")


def rz_ry_encode(x):
    qml.Snapshot("flag1")
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag2")
    qml.RZ(x[1], wires=0)
    qml.RZ(x[0], wires=1)
    qml.Snapshot("flag3")
    qml.Snapshot("flag4")


def rz_ry_cnot_encode(x):
    qml.Snapshot("flag1")
    qml.RZ(x[0], wires=0)
    qml.RZ(x[1], wires=1)
    qml.Snapshot("flag2")
    qml.RY(x[1], wires=0)
    qml.RY(x[0], wires=1)
    qml.Snapshot("flag3")
    qml.CNOT(wires=[0, 1])
    qml.Snapshot("flag4")


def ry_rx_encode(x):
    qml.Snapshot("flag1")
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag2")
    qml.RX(x[1], wires=0)
    qml.RX(x[0], wires=1)
    qml.Snapshot("flag3")
    qml.Snapshot("flag4")


def rx_ry_ry_cnot_encode(x):
    qml.Snapshot("flag1")
    qml.RX(x[0], wires=0)
    qml.RX(x[1], wires=1)
    qml.Snapshot("flag2")
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag3")
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.Snapshot("flag4")
    qml.CNOT(wires=[0, 1])
    qml.Snapshot("flag5")
