import matplotlib.pyplot as plt


def draw_cost_and_acc_plot(epoch_number, cost_list, acc_val_list):
    epochs = range(
        1, epoch_number + 1
    )  # assuming acc_train and acc_val are lists containing the accuracy per epoch

    # Create a figure and a set of subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # Plot cost data
    ax1.plot(epochs, cost_list, color="blue", marker="o", linestyle="-", linewidth=2, markersize=5)
    ax1.set_title("Training Cost per Epoch")
    ax1.set_xlabel("Epochs")
    ax1.set_ylabel("Cost")
    ax1.grid(True)

    # Plot validation accuracy data
    ax2.plot(
        epochs, acc_val_list, color="red", marker="o", linestyle="-", linewidth=2, markersize=5
    )
    ax2.set_title("Validation Accuracy per Epoch")
    ax2.set_xlabel("Epochs")
    ax2.set_ylabel("Accuracy")
    ax2.grid(True)

    # Display the plots
    plt.tight_layout()
    plt.show()
