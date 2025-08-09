from scipy.spatial.distance import cdist
from scipy.spatial import distance


import pennylane as qml
from pennylane import numpy as np
from pennylane.optimize import NesterovMomentumOptimizer
import matplotlib.pyplot as plt
import math
from sklearn.datasets import make_circles, make_moons
from numpy import genfromtxt


# # Adjusting for a 2-dimensional feature input
# num_qubits = 2
# repetition = 2
# train_split = 0.75
# num_per_side = 20

# seed = 3407
# np.random.seed(seed)

# dev = qml.device("default.qubit", wires=num_qubits)
# lr = 0.02
# optimizer = NesterovMomentumOptimizer(lr)
# batch_size = 3
# epoch_number = 100

# import numpy as np
# # import matplotlib.pyplot as plt
# from pennylane import numpy as np


# def Jiang_dataset(num_per_side):
#     sum0 = 0
#     sum1 = 0

#     location = []
#     target = []
#     for x in np.linspace(0, 1, num=num_per_side):
#         for y in np.linspace(0, 1, num=num_per_side):
#             location.append([x,y])
#             if (x**2 + y**2 <= 0.55**2 or (x-1)**2 + (y-1)**2 <= 0.55**2):
#                 target.append(1.00)
#                 sum1 = sum1 + 1
#             else:
#                 target.append(-1.00)
#                 sum0 = sum0 + 1

#     return [location, target]


# # Data
# # data = genfromtxt('Data/dataset1.csv', delimiter=',', skip_header =1)
# data = Jiang_dataset(num_per_side)

# # convert tensor to number
# feature = [[round(item[0].numpy(), 3), round(item[1].numpy(), 3)] for item in data[0]]

# label = data[1]


def detect_boundary(features, labels, grid_size):
    boundary_points = []

    # Helper function to calculate midpoints
    def midpoint(p1, p2):
        return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]

    # Reshape the features and labels according to grid_size
    x_coords = np.reshape([f[0] for f in features], (grid_size, grid_size))
    y_coords = np.reshape([f[1] for f in features], (grid_size, grid_size))
    reshaped_labels = np.reshape(labels, (grid_size, grid_size))

    # Check for label changes between adjacent cells
    for y in range(grid_size):
        for x in range(grid_size - 1):
            # Check horizontally
            if reshaped_labels[y][x] != reshaped_labels[y][x + 1]:
                boundary_points.append(
                    midpoint(
                        [x_coords[y][x], y_coords[y][x]], [x_coords[y][x + 1], y_coords[y][x + 1]]
                    )
                )
            # Check vertically
            if y < grid_size - 1 and reshaped_labels[y][x] != reshaped_labels[y + 1][x]:
                boundary_points.append(
                    midpoint(
                        [x_coords[y][x], y_coords[y][x]], [x_coords[y + 1][x], y_coords[y + 1][x]]
                    )
                )

    return boundary_points


def assign_and_order_dots(dots, num_regions=2):
    # Step 1: Safely calculate initial centers using random selection
    indices = np.random.choice(len(dots), num_regions, replace=False)
    centers = np.array([dots[idx] for idx in indices])

    # Step 2: Assign dots to the nearest center
    if centers.shape[0] > 0:  # Ensure there are centers to compare to
        dists = cdist(dots, centers, "euclidean")
        labels = np.argmin(dists, axis=1)

        regions = [[] for _ in range(num_regions)]
        for label, dot in zip(labels, dots):
            regions[label].append(dot)

        # Step 3: Sort dots in each region based on x-coordinate, then y-coordinate
        ordered_regions = []
        for region in regions:
            if not region:
                continue
            # Sort region by x-coordinate, then by y if x's are the same
            ordered_region = sorted(region, key=lambda dot: (dot[1], dot[0]))
            ordered_regions.append(ordered_region)

        return ordered_regions
    else:
        return []
