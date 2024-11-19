import numpy as np
# import matplotlib.pyplot as plt
from pennylane import numpy as np



def Jiang_dataset(num_per_side):
    sum0 = 0
    sum1 = 0

    location = []
    target = []
    for x in np.linspace(0, 1, num=num_per_side):
        for y in np.linspace(0, 1, num=num_per_side):
            location.append([x,y])
            if (x**2 + y**2 <= 0.55**2 or (x-1)**2 + (y-1)**2 <= 0.55**2):
                target.append(1.00)
                sum1 = sum1 + 1
            else:
                target.append(-1.00)
                sum0 = sum0 + 1

    

# # draw figure
#     color_min = -1
#     color_max = 1 

#     X = np.array(location)

#     scatter = plt.scatter(X[:, 0], X[:, 1], c=target, cmap="viridis", vmin=color_min, vmax=color_max)

#     plt.colorbar(label='Value')
#     plt.title('Dataset')
#     plt.xlabel('X coordinate')
#     plt.ylabel('Y coordinate')
#     plt.show()

    
    return [location, target]