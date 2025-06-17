# Linear Perceptron Learning Simulation - JavaScript Documentation

## Overview
This JavaScript file (`main.js`) implements a visual simulation of the linear perceptron learning algorithm. It provides an interactive environment where users can create datasets, observe the learning process step by step, and understand how perceptron training works.

## Core Functionality

### Data Model
- **Points**: Collection of data points with x, y coordinates and class labels (1 or 2)
- **Weights**: Coefficients (w0, w1, bias) that define the linear decision boundary
- **Best Weights**: Tracks the weight configuration with the lowest error count

### Algorithm Implementation
- **Perceptron Learning Rule**: Updates weights based on misclassified points
- **Convergence Detection**: Checks if all points are correctly classified
- **Learning Rate Decay**: Implements gradual reduction in step size over time
- **Error Counting**: Tracks misclassifications to identify the best boundary

### Visualization
- **Canvas Rendering**: Displays points and decision boundaries on a 2D canvas
- **Decision Boundary Visualization**: Shows the current and best decision boundaries
- **Grid Lines**: Provides visual reference for the 2D coordinate space
- **Color-Coding**: Distinguishes between classes (red/blue) and boundary types (green/purple)

## Key Functions

### `getLineIntersections(A, B, C)`
Calculates where the decision boundary (Ax + By + C = 0) intersects with the canvas edges. 
Handles all possible line orientations including vertical, horizontal, and special cases.

### `countErrors(w)`
Counts how many points are misclassified by a given weight configuration.

### `drawCanvas()`
Renders the entire visualization with grid, points, and decision boundaries.

### `initializeWeights()`
Sets up the initial weight vector with random values to ensure diverse starting positions.

### `perceptronStep()`
Executes a single iteration of the perceptron learning algorithm:
1. Shuffles points for better convergence
2. Updates weights when points are misclassified
3. Tracks the best weights configuration
4. Decays the learning rate gradually
5. Checks for convergence

## Event Handlers
- **Canvas Click**: Adds new points to the dataset
- **Reset Button**: Clears the simulation state
- **Start Button**: Initializes the weights
- **Step Button**: Executes one perceptron update iteration
- **Automate Button**: Toggles continuous training
- **Show Best Button**: Toggles display of the best decision boundary
- **Sliders**: Control decay rate and automation speed

## Usage Notes
- The simulation works best when points are linearly separable
- For non-separable data, the "best boundary" feature shows the boundary with least errors
- The perceptron algorithm can find any possible linear decision boundary
- Grid lines help with spatial orientation and understanding the coordinate space
- Learning rate decay helps fine-tune the boundary position over time

This implementation provides a complete, interactive environment for learning about perceptron training and linear classification.