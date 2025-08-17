from scipy.spatial.distance import cdist
from pennylane import numpy as np


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
