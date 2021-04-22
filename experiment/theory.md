Assume that the samples of the two classes are linearly separable in the feature space. i.e., there exists a plane w.x+w0 = 0 such that all samples belonging to the first class are on one side of the plane, and all samples of the second class are on the opposite side. If such planes exist, the goal of the perceptron algorithm is to learn any one such plane, given the data points. Once we learn the plane, it will be easy to classify new points in the future, as the points on one side of the plane will result in a positive value for w.x+w0, while points on the other side will give a negative value.

**Special Case: One dimensional feature vector**

To understand the working of the algorithm, we first take the simplest case, where the samples are represented by a single feature (one-dimensional).
