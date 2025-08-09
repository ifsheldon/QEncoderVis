from Data.Jiang_dataset import Jiang_dataset


def func_get_original_data():
    dataset = Jiang_dataset(num_per_side=20)

    # convert tensor to number
    feature = [[round(item[0].numpy(), 3), round(item[1].numpy(), 3)] for item in dataset[0]]

    label = dataset[1]

    return [feature, label]
