
#Add Train ing Data Points

* Click anywhere on the **canvas** to add a training point.
* Use the **radio buttons** to select the class label:

  * 🔴 **Class 1 (Red)** – for one category
  * 🔵 **Class 2 (Blue)** – for the other category
* Add several points from both classes to build a dataset.


# Start the Learning Simulation

* Click the **"Start"** button to initialize the perceptron with a random weight vector.
* The canvas will show the initial **decision boundary** (line) separating the two classes.

# Step Through the Algorithm

* Click the **"Step"** button to perform one iteration of the perceptron update rule.
* Each step checks misclassified points and updates the weights.
* Observe the **boundary updating** with each step and how it improves classification.


# Automate the Process

* Click **"Automate"** to continuously run the learning steps until convergence or manual stop.
* Use the **Automation Speed** slider to adjust how fast steps run (in milliseconds).

# Adjust Learning Parameters

* Modify the **Decay Rate** using its slider. This influences how quickly the learning rate decays over time:

  * Low decay → stable learning
  * High decay → faster convergence but may underfit
* You can change this value before or during automation.

# View Best Decision Boundary

* Click the **"Show Best"** button to toggle between:

  * The **current boundary** (latest weights)
  * The **best boundary** (lowest classification error so far)


# Reset the Experiment

* Click **"Reset"** to clear:

  * All points on the canvas
  * Iteration count
  * Boundary and learning history
* Use this when starting a new dataset or experiment.


# Monitor Progress

* View the **iteration count** just below the canvas.
* Watch the boundary shift and converge with each step or automated run.


# Legend

* 🟢 **Current Boundary** – reflects the model’s most recent update
* 🟡 **Best Boundary** – represents the boundary with the fewest classification errors

