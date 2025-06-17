### Basic Concepts

The linear perceptron is a fundamental algorithm for binary classification that learns a linear decision boundary to separate two classes. The key components are:

1. **Input Space**: A $d$-dimensional feature space where each data point is represented as a vector $\mathbf{x} = (x_1, x_2, \ldots, x_n)$
2. **Weight Vector**: A vector $\mathbf{w} = (w_1, w_2, \ldots, w_n)$ that defines the orientation of the decision boundary
3. **Bias Term**: A scalar $w_0$ that shifts the decision boundary from the origin
4. **Decision Function**: $f(\mathbf{x}) = \mathbf{w} \cdot \mathbf{x} + w_0$, where:
   - $f(\mathbf{x}) > 0$ for class $C_1$
   - $f(\mathbf{x}) < 0$ for class $C_2$

### Mathematical Formulation

#### Decision Boundary
The decision boundary is defined by the hyperplane:
$$\mathbf{w} \cdot \mathbf{x} + w_0 = 0$$

#### Learning Rule
The perceptron learning algorithm updates the weights using the following rule:
- If a point $\mathbf{x}$ is misclassified:
  - For class $C_1$ (should be positive but is negative):
    $$\mathbf{w} = \mathbf{w} + \eta\mathbf{x}$$
    $$w_0 = w_0 + \eta$$
  - For class $C_2$ (should be negative but is positive):
    $$\mathbf{w} = \mathbf{w} - \eta\mathbf{x}$$
    $$w_0 = w_0 - \eta$$
where $\eta$ is the learning rate.

### Convergence Properties

1. **Linear Separability**: The algorithm converges if and only if the classes are linearly separable
2. **Convergence Theorem**: If the classes are linearly separable, the perceptron algorithm will converge in a finite number of steps
3. **Margin**: The distance of the closest point to the decision boundary affects convergence speed

### Special Cases

#### One-Dimensional Case
- Decision boundary is a point
- Weight vector is a scalar
- Easier to visualize and understand the learning process

#### Two-Dimensional Case
- Decision boundary is a line
- Weight vector has two components
- Most common case for visualization and understanding

#### Higher Dimensions
- Decision boundary is a hyperplane
- Same principles apply but harder to visualize
- Important for real-world applications

### Limitations

1. Only works for linearly separable data
2. May not find the optimal separating hyperplane
3. Sensitive to the learning rate parameter
4. May not converge if data is not linearly separable

### Applications

1. Binary classification problems
2. Feature selection
3. Understanding more complex neural networks
4. Educational tool for learning machine learning concepts
