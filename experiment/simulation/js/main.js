// main.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");
const stepBtn = document.getElementById("stepBtn");
const autoBtn = document.getElementById("autoBtn");
const decayRateInput = document.getElementById("decayRate");
const decayValueSpan = document.getElementById("decayValue");
const autoSpeedInput = document.getElementById("autoSpeed");
const autoSpeedValueSpan = document.getElementById("autoSpeedValue");
const iterationDisplay = document.getElementById("iterationDisplay");
const showBestBtn = document.getElementById("showBestBtn");

let points = [];  // Each point: {x, y, label}
let weights = null; // {w0, w1, bias}
let bestWeights = null; // Keeps track of the best weights found
let bestErrorCount = Infinity; // Number of errors with the best weights
let iteration = 0;
let learningRate = 0.1;
let decayRate = parseFloat(decayRateInput.value);
let trainingComplete = false;
let autoInterval = null;
let showingBest = false; // Flag to toggle showing the best boundary

// Completely revised function to compute intersections of the decision boundary with canvas edges
function getLineIntersections(A, B, C) {
  const intersections = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Helper: check if point is inside canvas boundaries (with small margin for floating-point errors)
  const isValid = (pt) => {
    const margin = 0.0001;
    return pt.x >= -margin && pt.x <= width + margin && 
           pt.y >= -margin && pt.y <= height + margin;
  };

  // Apply a small epsilon to avoid division by zero
  const epsilon = 1e-10;
  
  // Normalize coefficients to prevent numerical issues
  const magnitude = Math.sqrt(A*A + B*B);
  if (magnitude > epsilon) {
    A = A / magnitude;
    B = B / magnitude;
    C = C / magnitude;
  }

  try {
    // Check for horizontal line (B is approximately zero)
    if (Math.abs(B) < epsilon) {
      if (Math.abs(A) < epsilon) return []; // Invalid line (both A and B are ~0)
      
      // Calculate x-intercept: x = -C/A
      const x = -C / A;
      
      // If x is within canvas width, return top and bottom intersections
      if (x >= 0 && x <= width) {
        return [{ x, y: 0 }, { x, y: height }];
      }
      return []; // No valid intersections
    }
    
    // Check for vertical line (A is approximately zero)
    if (Math.abs(A) < epsilon) {
      // Calculate y-intercept: y = -C/B
      const y = -C / B;
      
      // If y is within canvas height, return left and right intersections
      if (y >= 0 && y <= height) {
        return [{ x: 0, y }, { x: width, y }];
      }
      return []; // No valid intersections
    }
    
    // For all other lines, calculate intersections with all four edges
    
    // Left edge (x = 0): y = (-C - A*0) / B
    const leftY = -C / B;
    if (leftY >= 0 && leftY <= height) {
      intersections.push({ x: 0, y: leftY });
    }
    
    // Right edge (x = width): y = (-C - A*width) / B
    const rightY = (-C - A * width) / B;
    if (rightY >= 0 && rightY <= height) {
      intersections.push({ x: width, y: rightY });
    }
    
    // Top edge (y = 0): x = (-C - B*0) / A
    const topX = -C / A;
    if (topX >= 0 && topX <= width) {
      intersections.push({ x: topX, y: 0 });
    }
    
    // Bottom edge (y = height): x = (-C - B*height) / A
    const bottomX = (-C - B * height) / A;
    if (bottomX >= 0 && bottomX <= width) {
      intersections.push({ x: bottomX, y: height });
    }
    
    // Remove duplicate points (may occur at corners)
    const uniquePoints = [];
    for (const pt of intersections) {
      if (!uniquePoints.some(up => Math.hypot(up.x - pt.x, up.y - pt.y) < 1)) {
        uniquePoints.push(pt);
      }
    }
    
    // We need exactly 2 points to draw a line
    if (uniquePoints.length === 2) {
      return uniquePoints;
    } 
    // If more than 2 unique points, select the two farthest apart
    else if (uniquePoints.length > 2) {
      let maxDist = -1;
      let bestPair = [uniquePoints[0], uniquePoints[1]];
      
      for (let i = 0; i < uniquePoints.length; i++) {
        for (let j = i + 1; j < uniquePoints.length; j++) {
          const dist = Math.pow(uniquePoints[i].x - uniquePoints[j].x, 2) + 
                       Math.pow(uniquePoints[i].y - uniquePoints[j].y, 2);
          if (dist > maxDist) {
            maxDist = dist;
            bestPair = [uniquePoints[i], uniquePoints[j]];
          }
        }
      }
      return bestPair;
    }
    
    return uniquePoints;
  } catch (e) {
    console.error("Error calculating line intersections:", e);
    return [];
  }
}

// Count the number of misclassified points with given weights
function countErrors(w) {
  let errorCount = 0;
  points.forEach(point => {
    const x = point.x;
    const y = point.y;
    const linearOutput = w.w0 * x + w.w1 * y + w.bias;
    const predicted = (linearOutput >= 0) ? 1 : -1;
    const desired = (point.label === 1) ? 1 : -1;
    if (predicted !== desired) errorCount++;
  });
  return errorCount;
}

// Improve the drawing function for better visualization
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines for better visual reference (optional)
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;
  
  // Draw vertical grid lines
  for (let x = 50; x < canvas.width; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Draw horizontal grid lines
  for (let y = 50; y < canvas.height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw points
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = (point.label === 1) ? "#e74c3c" : "#3498db";
    ctx.fill();
    ctx.closePath();
  });

  // Draw best decision boundary if requested
  if (showingBest && bestWeights) {
    const intersections = getLineIntersections(bestWeights.w0, bestWeights.w1, bestWeights.bias);
    if (intersections.length === 2) {
      ctx.beginPath();
      ctx.moveTo(intersections[0].x, intersections[0].y);
      ctx.lineTo(intersections[1].x, intersections[1].y);
      ctx.strokeStyle = "#9b59b6"; // Purple for best boundary
      ctx.lineWidth = 5;
      ctx.setLineDash([5, 5]); // Dashed line for best boundary
      ctx.stroke();
      ctx.closePath();
    }
  }

  // Draw current decision boundary if weights are initialized
  if (weights) {
    const intersections = getLineIntersections(weights.w0, weights.w1, weights.bias);
    if (intersections.length === 2) {
      ctx.beginPath();
      ctx.moveTo(intersections[0].x, intersections[0].y);
      ctx.lineTo(intersections[1].x, intersections[1].y);
      ctx.strokeStyle = "#2ecc71"; // Green for current boundary
      ctx.lineWidth = 3;
      ctx.setLineDash([]); // Solid line for current boundary
      ctx.stroke();
      ctx.closePath();
    }
  }
}

// Canvas click: add a new point (if training not started)
canvas.addEventListener("click", function(event) {
  if (trainingComplete) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const label = parseInt(document.querySelector('input[name="class"]:checked').value);
  points.push({ x, y, label });
  drawCanvas();
});

// Reset simulation
resetBtn.addEventListener("click", function() {
  points = [];
  weights = null;
  bestWeights = null;
  bestErrorCount = Infinity;
  iteration = 0;
  learningRate = 0.1;
  trainingComplete = false;
  clearInterval(autoInterval);
  autoInterval = null;
  iterationDisplay.textContent = "Iterations: 0";
  autoBtn.textContent = "Automate";
  showingBest = false;
  if (showBestBtn) showBestBtn.textContent = "Show Best";
  drawCanvas();
});

// Modified initialize weights function to support more diverse starting positions
function initializeWeights() {
  // Generate weights that can create lines anywhere in the canvas
  const randomValue = () => Math.random() * 2 - 1;  // Random between -1 and 1
  
  // Start with completely random weights
  weights = {
    w0: randomValue(),
    w1: randomValue(),
    bias: randomValue() * Math.max(canvas.width, canvas.height) // Larger bias range for better coverage
  };
  
  // Alternative initialization: sometimes create a vertical or horizontal line
  // This helps ensure we generate a wide variety of starting positions
  const randomChoice = Math.random();
  if (randomChoice < 0.15) {
    // Near-vertical line (small w1)
    weights.w0 = randomValue() * 5;
    weights.w1 = randomValue() * 0.1;
    weights.bias = randomValue() * canvas.width;
  } else if (randomChoice < 0.3) {
    // Near-horizontal line (small w0)
    weights.w0 = randomValue() * 0.1;
    weights.w1 = randomValue() * 5;
    weights.bias = randomValue() * canvas.height;
  }
  
  bestWeights = null;
  bestErrorCount = Infinity;
  iteration = 0;
  trainingComplete = false;
  iterationDisplay.textContent = "Iterations: 0";
  drawCanvas();
}

// Improved perceptron step for better convergence and stability
function perceptronStep() {
  let errorCount = 0;
  let shuffledPoints = [...points].sort(() => Math.random() - 0.5); // Shuffle points for better convergence
  
  shuffledPoints.forEach(point => {
    const x = point.x;
    const y = point.y;
    // Compute linear output: A*x + B*y + bias
    const linearOutput = weights.w0 * x + weights.w1 * y + weights.bias;
    // Activation: sign function (Class 1: +1, Class 2: -1)
    const predicted = (linearOutput >= 0) ? 1 : -1;
    const desired = (point.label === 1) ? 1 : -1;
    if (predicted !== desired) {
      // Perceptron weight update rule
      weights.w0 += learningRate * desired * x;
      weights.w1 += learningRate * desired * y;
      weights.bias += learningRate * desired;
      errorCount++;
    }
  });
  
  // Calculate current error count
  errorCount = countErrors(weights);
  
  iteration++;
  iterationDisplay.textContent = `Iterations: ${iteration}`;
  
  // Check if current weights are better than best weights
  if (errorCount < bestErrorCount) {
    bestErrorCount = errorCount;
    bestWeights = { ...weights }; // Copy weights to avoid reference issues
  }
  
  // Decay learning rate
  learningRate = learningRate * (1 - decayRate);
  drawCanvas();

  // Check for convergence: if no misclassified points remain
  if (errorCount === 0) {
    trainingComplete = true;
    clearInterval(autoInterval);
    autoInterval = null;
    autoBtn.textContent = "Automate";
    alert(`Training converged in ${iteration} iterations!`);
  }
}

// Start button: initialize weights if not already set
startBtn.addEventListener("click", function() {
  if (points.length === 0) {
    alert("Please add some points first.");
    return;
  }
  if (!weights) {
    initializeWeights();
  }
});

// Step button: perform one perceptron update step
stepBtn.addEventListener("click", function() {
  if (!weights) {
    alert("Please click Start to initialize the weights first.");
    return;
  }
  if (trainingComplete) {
    alert("Training has already converged.");
    return;
  }
  perceptronStep();
});

// Automate button: toggle automated training
autoBtn.addEventListener("click", function() {
  if (!weights) {
    alert("Please click Start to initialize the weights first.");
    return;
  }
  if (trainingComplete) {
    alert("Training has already converged.");
    return;
  }
  // If automation is running, stop it; otherwise, start automated steps.
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
    autoBtn.textContent = "Automate";
  } else {
    autoBtn.textContent = "Stop";
    autoInterval = setInterval(() => {
      if (!trainingComplete) {
        perceptronStep();
      } else {
        clearInterval(autoInterval);
        autoInterval = null;
        autoBtn.textContent = "Automate";
      }
    }, parseInt(autoSpeedInput.value));
  }
});

// Show Best button: toggle display of best decision boundary
if (showBestBtn) {
  showBestBtn.addEventListener("click", function() {
    if (!bestWeights) {
      alert("No best weights available yet. Run some training first.");
      return;
    }
    showingBest = !showingBest;
    showBestBtn.textContent = showingBest ? "Hide Best" : "Show Best";
    drawCanvas();
  });
}

// Update decay rate display
decayRateInput.addEventListener("input", function() {
  decayRate = parseFloat(decayRateInput.value);
  decayValueSpan.textContent = decayRate.toFixed(2);
});

// Update automation speed display
autoSpeedInput.addEventListener("input", function() {
  autoSpeedValueSpan.textContent = autoSpeedInput.value;
  // If automation is running, update the interval speed by restarting the interval
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      if (!trainingComplete) {
        perceptronStep();
      } else {
        clearInterval(autoInterval);
        autoInterval = null;
        autoBtn.textContent = "Automate";
      }
    }, parseInt(autoSpeedInput.value));
  }
});
