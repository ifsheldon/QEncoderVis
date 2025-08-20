from functions.encoding import EncoderRxRyCnot
from routes.hyperparameters import (
    DEFAULT_EPOCH_NUMBER,
    DEFAULT_LR,
)

from routes.run_circuit import run_circuit


def run_circuit_0(
    encoder_name: str | None = None,
    epoch_number: int = DEFAULT_EPOCH_NUMBER,
    lr: float = DEFAULT_LR,
):
    dataset_source = "Data/dataset_0.csv"
    encoder = EncoderRxRyCnot()
    return run_circuit(encoder, epoch_number, lr, dataset_source)
