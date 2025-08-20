from functions.encoding import EncoderRxyCnot
from routes.hyperparameters import (
    DEFAULT_EPOCH_NUMBER,
    DEFAULT_LR,
)

from routes.run_circuit import run_circuit


def run_circuit_1(
    encoder_name: str | None = None,
    epoch_number: int = DEFAULT_EPOCH_NUMBER,
    lr: float = DEFAULT_LR,
):
    dataset_source = "Data/dataset_1.csv"
    encoder = EncoderRxyCnot()
    return run_circuit(encoder, epoch_number, lr, dataset_source)
