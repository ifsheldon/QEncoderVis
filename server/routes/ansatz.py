import pennylane as qml


def ansatz(weights):
    qml.RZ(weights[0], wires=0)
    qml.RY(weights[1], wires=0)
    qml.RZ(weights[2], wires=1)
    qml.RY(weights[3], wires=1)
    qml.CNOT(wires=[0, 1])


ansatz_steps = [
    ["RZ", "RZ"],  # ansatz step 1
    ["RY", "RY"],  # ansatz step 2
    ["CX-0", "CX-1"],  # ansatz step 3
]
