# OS Page Replacement Algorithm Visualizer

A comprehensive, interactive visualization tool for understanding page replacement algorithms used in operating system memory management. This project provides both a modern React/Next.js implementation.

## 🚀 Features

### Core Functionality
- **Four Page Replacement Algorithms**: FIFO, LRU, Optimal, and Clock
- **Interactive Visualization**: Real-time canvas-based rendering with color-coded states
- **Step-by-Step Simulation**: Detailed execution trace with visual feedback
- **Performance Analytics**: Comprehensive statistics and fault rate analysis
- **Export Capabilities**: Download simulation results as CSV or JSON
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Experience
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Playback Controls**: Play, pause, step forward/backward with speed control
- **Real-time Statistics**: Live updates of page faults, hits, and fault rates
- **Preset Examples**: Quick access to common test cases

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Algorithms](#algorithms)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites
- Node.js 18+ (for React version)
- Modern web browser with Canvas support
- Git (optional, for cloning)

### React/Next.js Version (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd os-page-replacement_1

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
npm run start
```

### Vanilla JavaScript Version

Simply open `index.html` in a web browser - no build process required!

```bash
# Open directly in browser
open index.html
# or
start index.html
```

## 🎯 Usage

### Basic Usage

1. **Select Algorithm**: Choose from FIFO, LRU, Optimal, or Clock
2. **Configure Parameters**: 
   - Set number of frames (1-10)
   - Enter page reference sequence (space or comma separated)
3. **Run Simulation**: Click "Start Simulation" or use playback controls
4. **Analyze Results**: View statistics and step-by-step execution

### Example Sequences

**Default Sequence**: `7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1`

**Simple Sequence**: `1 2 3 4 1 2 5 1 2 3 4 5`

**Belady's Anomaly**: `1 2 3 4 1 2 5 1 2 3 4 5` (demonstrates FIFO anomaly)

### Controls

- **Play/Pause**: Start or stop automatic simulation
- **Step Forward/Backward**: Navigate through simulation steps manually
- **Speed Control**: Adjust animation speed (0.1x to 2.0x)
- **Reset**: Return to initial state
- **Export**: Download results as CSV or JSON

## 🧮 Algorithms

### FIFO (First In First Out)
- **Principle**: Replaces the oldest page first
- **Implementation**: Uses a queue to track page insertion order
- **Time Complexity**: O(1) for replacement decision
- **Space Complexity**: O(n) for queue storage
- **Characteristics**: Simple but can suffer from Belady's anomaly

### LRU (Least Recently Used)
- **Principle**: Replaces the least recently accessed page
- **Implementation**: Maintains access timestamps for each page
- **Time Complexity**: O(n) for finding least recent page
- **Space Complexity**: O(n) for timestamp storage
- **Characteristics**: Good performance but requires additional overhead

### Optimal
- **Principle**: Replaces the page that will be used furthest in the future
- **Implementation**: Precomputes future reference indices
- **Time Complexity**: O(n) for finding optimal page
- **Space Complexity**: O(n) for future reference storage
- **Characteristics**: Theoretical minimum page faults (not practical)

### Clock (Second Chance)
- **Principle**: Circular buffer with reference bits for second chances
- **Implementation**: Uses reference flags and circular pointer
- **Time Complexity**: O(n) worst case, O(1) average
- **Space Complexity**: O(n) for reference flags
- **Characteristics**: Good balance of performance and simplicity

## 📁 Project Structure

```
os-page-replacement_1/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main application page
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Input component
│   │   ├── label.tsx            # Label component
│   │   ├── select.tsx           # Select component
│   │   ├── separator.tsx        # Separator component
│   │   ├── slider.tsx           # Slider component
│   │   └── toast.tsx            # Toast component
│   ├── export-panel.tsx         # Export functionality
│   ├── input-panel.tsx          # Configuration inputs
│   ├── playback-controls.tsx    # Simulation controls
│   ├── statistics-panel.tsx     # Performance statistics
│   ├── theme-toggle.tsx        # Theme switcher
│   └── visualization-engine.tsx # Canvas visualization
├── hooks/                        # Custom React hooks
│   └── use-page-replacement.ts  # Main algorithm hook
├── lib/                          # Utility functions
│   └── utils.ts                 # Common utilities
├── public/                       # Static assets
├── algorithms.js                 # Vanilla JS algorithm implementation
├── visualizer.js                # Vanilla JS canvas visualization
├── index.html                    # Vanilla JS HTML interface
├── styles.css                    # Vanilla JS styles
├── package.json                  # Dependencies and scripts
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                     # This file
```

## 🔧 API Reference

### React Hook: `usePageReplacement`

```typescript
function usePageReplacement(
  pageSequenceStr: string,
  frameCount: number,
  algorithm: "FIFO" | "LRU" | "Optimal" | "Clock"
): {
  steps: StepData[],
  stats: Stats,
  totalSteps: number
}
```

**Parameters:**
- `pageSequenceStr`: Space-separated string of page references
- `frameCount`: Number of memory frames (1-10)
- `algorithm`: Algorithm type to simulate

**Returns:**
- `steps`: Array of step-by-step execution data
- `stats`: Performance statistics object
- `totalSteps`: Total number of simulation steps

### Vanilla JS Class: `PageReplacementSimulator`

```javascript
class PageReplacementSimulator {
  constructor(referenceString, numFrames, algorithm)
  simulate()                    // Run complete simulation
  getStatistics()              // Get performance statistics
  getExecutionTrace()          // Get detailed execution report
}
```

### Vanilla JS Class: `PageReplacementVisualizer`

```javascript
class PageReplacementVisualizer {
  constructor(canvasId)         // Initialize with canvas element ID
  draw(frames, numFrames, referenceString, currentStep, highlightType, highlightPage)
  resizeCanvas()                // Handle responsive resizing
}
```

## 🎨 Customization

### Adding New Algorithms

1. **React Version**: Extend the `usePageReplacement` hook
2. **Vanilla JS**: Add new case to `PageReplacementSimulator.selectPageToReplace()`

### Styling

- **React Version**: Modify Tailwind classes in components
- **Vanilla JS**: Update CSS variables in `styles.css`

### Color Scheme

Update color definitions in:
- **React**: `app/globals.css` CSS variables
- **Vanilla JS**: `visualizer.js` colors object

## 🧪 Testing

### Manual Testing

1. **Algorithm Correctness**: Compare results with known test cases
2. **Edge Cases**: Test with empty sequences, single frames, etc.
3. **Performance**: Verify smooth animation with large sequences
4. **Responsiveness**: Test on different screen sizes

### Test Cases

```javascript
// Belady's Anomaly (FIFO)
const beladySequence = "1 2 3 4 1 2 5 1 2 3 4 5"
// 3 frames: 9 faults, 4 frames: 10 faults

// LRU Optimal Case
const lruOptimal = "1 2 3 4 1 2 3 4"
// Should have minimal faults

// Clock Algorithm Test
const clockTest = "1 2 3 4 1 2 5 1 2 3 4 5"
// Should perform better than FIFO
```

## 🚀 Performance

### Optimization Features

- **React Memoization**: `useMemo` prevents unnecessary recalculations
- **Canvas Optimization**: Efficient rendering with minimal redraws
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Lazy Loading**: Components load only when needed

### Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Canvas Support**: Required for visualization
- **ES6+ Features**: Arrow functions, destructuring, modules

