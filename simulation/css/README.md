# Linear Perceptron Learning Visualization - Stylesheet Documentation

## Overview
This CSS file (`main.css`) provides styling for the Linear Perceptron Learning (LPL) visualization tool, creating a modern, clean interface for the interactive learning experience.

## Features

### General Styling
- Uses Roboto font from Google Fonts for clarity and readability
- Implements a subtle gradient background for the page
- Applies consistent box-sizing to all elements

### Layout & Structure
- Responsive container with maximum width of 950px
- Card-based interface with clean separation between sections
- Consistent spacing and padding throughout the application

### Color Scheme
- Main application background: Gradient from light green to light orange
- Headers: Dark blue-gray (#2c3e50) for main title, orange (#e67e22) for section headers
- Subtitle: Teal (#16a085)
- Cards: Light blue-gray (#f7f9fc) with subtle borders
- Iteration counter: Orange (#d35400)

### Interactive Elements
- **Buttons**:
  - Reset: Red (#e74c3c)
  - Start: Blue (#2980b9)
  - Step: Orange (#f39c12)
  - Automate: Green (#27ae60)
  - Show Best: Purple (#9b59b6)
  - All buttons include hover effects with slight scaling and color change

### Canvas & Visualization
- Canvas has a light gray background with a subtle border
- Provides visual consistency for the learning visualization
- Decision boundary lines are styled with different colors:
  - Current boundary: Solid green line
  - Best boundary: Dashed purple line

### Legend
- Clean legend with color boxes matching the boundary lines
- Flexbox-based layout for easy horizontal alignment
- Visual reference for understanding the different displayed lines

## CSS Organization
- Imports Google Fonts at the top
- Groups related styles together (general, header, cards, controls)
- Uses descriptive class names for easy maintenance
- Implements consistent transition effects for interactive elements

## Usage
Link this stylesheet in the HTML head section:
```html
<link rel="stylesheet" href="css/main.css">
```

This CSS was designed specifically for the Linear Perceptron Learning visualization tool and works in conjunction with the JavaScript functionality to provide an optimal learning experience.