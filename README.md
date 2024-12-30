# Packing Algorithm React Application

## Overview

This React application determines the smallest box or combination of boxes required to fit a set of products, adhering to predefined constraints.

## Features

1. **Packing Algorithm**: Finds the most space-efficient and weight-compliant box configuration for the given products.
2. **Intuitive UI**: Users can input product details and view box-packing results.
3. **Error Handling**: Clearly displays errors if products cannot fit into any box.
4. **Reusable Components**: Implements modular and reusable React components.
5. **TypeScript**: Strongly typed props, state, and functions ensure reliability.
6. **Testing**: Comprehensive unit tests for the packing algorithm and key components.
7. **External Libraries**: Utilizes additional libraries like MUI for UI and lodash for utility functions.

---

## Installation and Setup

### Prerequisites

- Node.js (v20)
- npm (Comes with Node.js)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/zomeru/boxing-challenge-react.git
   cd boxing-challenge-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

### Build for Production

1. Build the app
   ```bash
   npm run build
   ```
2. Start the preview server:
   ```bash
   npm run preview
   ```
3. Open the application in your browser:
   ```
   http://localhost:3001
   ```

The production build will be available in the `dist/` folder.

### Run Tests

```bash
npm run test
```

---

## Usage

### Input Products

1. Add a product by clicking the `Add Product` button.
2. Choose a product from the dropdown menu.
3. You can add up to 10 products, each with its own quantity.
4. Click `Calculate Packing` to display the results.

### View Results

- The algorithm calculates the optimal box configuration and displays:
  - The selected boxes, their dimensions, weight limit, and total weight.
  - Total products in each box.
  - Utilization percentage per box.
- If a product cannot fit, an error message is shown.

---

## File Structure

```
src/
├── assets/             # Static files
├── components/         # Reusable React components
│   └── __tests__/      # Tests for components
├── data/               # Json files for products and boxes
├── tests/              # General or global test setup
├── theme/              # Theme
├── types/              # TypeScript types and interfaces
├── utils/
│   ├── __tests__/      # Tests for utils
│   └── packingAlgo.ts  # Packing algorithm and helper functions
├── App.test.tsx        # Tests for root component
├── App.tsx             # Root component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

---

## Algorithm Overview

### Constraints

1. **Volume Constraint**: Box volume must exceed product volume.
2. **Dimension Constraint**: Product dimensions cannot exceed box dimensions.
3. **Weight Constraint**: Total weight in a box must not exceed its weight limit.

### Steps

1. **Filter Boxes**: Identify boxes that meet the product’s dimension and weight constraints.
2. **Minimize Volume**: Select the smallest box or combination of boxes to fit the products.
3. **Fallback**:
   - Allocate oversized products to individual boxes.
   - Return an error for products exceeding the largest box size.

### Example

#### Input

- Product A: Length = 10cm, Width = 5cm, Height = 5cm, Weight = 1kg
- Product B: Length = 15cm, Width = 10cm, Height = 10cm, Weight = 2kg

#### Output

- Box 1: Fits Product A and B
- Box Dimensions: Length = 20cm, Width = 15cm, Height = 10cm, Weight Limit = 5kg

---

## Unit Testing

### Test Suite

- **Algorithm Tests**:
  - Verify correct box selection for given products.
  - Ensure proper handling of edge cases (e.g., oversized products).
- **Component Tests**:
  - Test user interaction with the product input form.
  - Validate output display of box results.

### Run Tests

1. Run all tests:
   ```bash
   npm run test
   ```
2. Watch mode:
   ```bash
   npm run test:watch
   ```
3. View test coverage:
   ```bash
   npm run test:coverage
   ```

---

## Known Limitations

1. Limited to 10 products per input session.
2. Assumes accurate product dimensions and weights.
3. Does not account for irregularly shaped products.

---

## External Dependencies

- **React**: Frontend framework
- **Vite**: Frontend build tool
- **Material UI**: UI components
- **Lodash**: Utility functions
- **Vitest & React Testing Library**: Testing framework

---
