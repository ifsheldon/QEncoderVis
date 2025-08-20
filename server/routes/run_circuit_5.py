from functions.encoding import EncoderRzRyCnot
from routes.hyperparameters import (
    DEFAULT_EPOCH_NUMBER,
)

from routes.run_circuit import run_circuit


def run_circuit_5(
    encoder_name: str | None = None, epoch_number: int = DEFAULT_EPOCH_NUMBER, lr: float = 0.2
):
    dataset_source = "Data/dataset_5.csv"
    encoder = EncoderRzRyCnot()
    return run_circuit(encoder, epoch_number, lr, dataset_source)
