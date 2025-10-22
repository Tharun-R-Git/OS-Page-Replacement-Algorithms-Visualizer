/**
 * Canvas Visualization Engine
 * 
 * This module provides a comprehensive canvas-based visualization system for
 * page replacement algorithms. It renders memory frames, page references,
 * and algorithm-specific data structures in an interactive visual format.
 * 
 * Features:
 * - Real-time frame visualization with color-coded states
 * - Reference string display with step highlighting
 * - Responsive canvas that adapts to container size
 * - Dark/light theme support
 * - Smooth animations and visual feedback
 * 
 * @author OS Page Replacement Visualizer
 * @version 1.0.0
 */

/**
 * PageReplacementVisualizer Class
 * 
 * Handles all canvas-based rendering for the page replacement simulation.
 * Provides methods for drawing frames, reference strings, and maintaining
 * visual state throughout the simulation.
 */
class PageReplacementVisualizer {
  /**
   * Constructor - Initializes the canvas and sets up event listeners
   * 
   * @param {string} canvasId - ID of the HTML canvas element to use
   */
  constructor(canvasId) {
    // Get canvas element and 2D rendering context
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext("2d")
    
    // Set up responsive canvas sizing
    this.resizeCanvas()
    window.addEventListener("resize", () => this.resizeCanvas())

    // Define color scheme for different visual states
    this.colors = {
      frameEmpty: "#334155",      // Empty frame background
      frameOccupied: "#3b82f6",   // Occupied frame background
      frameHit: "#10b981",        // Page hit highlight (green)
      frameFault: "#ef4444",      // Page fault highlight (red)
      text: "#f1f5f9",           // Primary text color
      border: "#475569",         // Frame border color
    }
  }

  /**
   * Resize Canvas to Fit Container
   * 
   * Dynamically adjusts canvas dimensions to match its container size.
   * This ensures the visualization scales properly on different screen sizes.
   */
  resizeCanvas() {
    const container = this.canvas.parentElement
    this.canvas.width = container.clientWidth
    this.canvas.height = container.clientHeight
  }

  /**
   * Draw Memory Frames Visualization
   * 
   * Renders the memory frames with their current page contents.
   * Uses color coding to indicate frame states and highlights
   * pages involved in hits or faults.
   * 
   * @param {Array} frames - Array of page numbers currently in frames
   * @param {number} numFrames - Total number of available frames
   * @param {string|null} highlightType - Type of highlight ('hit' or 'fault')
   * @param {number|null} highlightPage - Page number to highlight
   */
  drawFrames(frames, numFrames, highlightType = null, highlightPage = null) {
    // Define frame dimensions and spacing
    const frameWidth = 80
    const frameHeight = 100
    const spacing = 20

    // Calculate total width and center the frames horizontally
    const totalWidth = numFrames * frameWidth + (numFrames - 1) * spacing
    const startX = (this.canvas.width - totalWidth) / 2
    const startY = 80

    // Clear canvas with dark background
    this.ctx.fillStyle = "#0f172a"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw section title
    this.ctx.fillStyle = "#f1f5f9"
    this.ctx.font = "bold 18px sans-serif"
    this.ctx.textAlign = "center"
    this.ctx.fillText("Page Frames", this.canvas.width / 2, 30)

    // Draw each memory frame
    for (let i = 0; i < numFrames; i++) {
      const x = startX + i * (frameWidth + spacing)
      const y = startY
      const page = frames[i]

      // Determine frame color based on state and highlights
      let frameColor = this.colors.frameEmpty
      if (page !== undefined) {
        frameColor = this.colors.frameOccupied
        // Apply special highlighting for hits or faults
        if (highlightType === "hit" && page === highlightPage) {
          frameColor = this.colors.frameHit
        } else if (highlightType === "fault" && page === highlightPage) {
          frameColor = this.colors.frameFault
        }
      }

      // Draw frame background rectangle
      this.ctx.fillStyle = frameColor
      this.ctx.fillRect(x, y, frameWidth, frameHeight)

      // Draw frame border
      this.ctx.strokeStyle = this.colors.border
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(x, y, frameWidth, frameHeight)

      // Draw page number or empty indicator
      this.ctx.fillStyle = this.colors.text
      this.ctx.font = "bold 24px sans-serif"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      if (page !== undefined) {
        this.ctx.fillText(page, x + frameWidth / 2, y + frameHeight / 2)
      } else {
        // Show empty frame indicator
        this.ctx.fillStyle = "#64748b"
        this.ctx.fillText("-", x + frameWidth / 2, y + frameHeight / 2)
      }

      // Draw frame label below each frame
      this.ctx.fillStyle = "#94a3b8"
      this.ctx.font = "12px sans-serif"
      this.ctx.textBaseline = "top"
      this.ctx.fillText(`Frame ${i}`, x + frameWidth / 2, y + frameHeight + 10)
    }
  }

  /**
   * Draw Reference String Visualization
   * 
   * Renders the sequence of page references with visual indicators
   * showing the current step and completed steps. Limits display
   * to first 15 references for readability.
   * 
   * @param {Array} referenceString - Array of page reference numbers
   * @param {number} currentStep - Current step index in the simulation
   */
  drawReferenceString(referenceString, currentStep) {
    // Define reference item dimensions and spacing
    const itemWidth = 40
    const itemHeight = 40
    const spacing = 10
    const startY = 250

    // Calculate display area (limit to 15 items for readability)
    const displayCount = Math.min(referenceString.length, 15)
    const totalWidth = displayCount * itemWidth + (displayCount - 1) * spacing
    const startX = (this.canvas.width - totalWidth) / 2

    // Draw section title
    this.ctx.fillStyle = "#94a3b8"
    this.ctx.font = "12px sans-serif"
    this.ctx.textAlign = "center"
    this.ctx.fillText("Reference String", this.canvas.width / 2, startY - 30)

    // Draw each reference item
    for (let i = 0; i < displayCount; i++) {
      const x = startX + i * (itemWidth + spacing)
      const y = startY
      const page = referenceString[i]

      // Determine background color based on step status
      let bgColor = "#334155"  // Default: not yet processed
      if (i === currentStep) {
        bgColor = "#3b82f6"    // Current step: blue highlight
      } else if (i < currentStep) {
        bgColor = "#475569"    // Completed steps: darker gray
      }

      // Draw reference item background
      this.ctx.fillStyle = bgColor
      this.ctx.fillRect(x, y, itemWidth, itemHeight)

      // Draw reference item border
      this.ctx.strokeStyle = this.colors.border
      this.ctx.lineWidth = 1
      this.ctx.strokeRect(x, y, itemWidth, itemHeight)

      // Draw page number
      this.ctx.fillStyle = this.colors.text
      this.ctx.font = "bold 16px sans-serif"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillText(page, x + itemWidth / 2, y + itemHeight / 2)
    }
  }

  /**
   * Main Draw Method - Orchestrates the Complete Visualization
   * 
   * This is the primary method called to render the entire visualization.
   * It coordinates the drawing of frames and reference string to create
   * a cohesive visual representation of the current simulation state.
   * 
   * @param {Array} frames - Current state of memory frames
   * @param {number} numFrames - Total number of frames
   * @param {Array} referenceString - Complete reference string
   * @param {number} currentStep - Current step in simulation
   * @param {string|null} highlightType - Type of highlight to apply
   * @param {number|null} highlightPage - Page number to highlight
   */
  draw(frames, numFrames, referenceString, currentStep, highlightType = null, highlightPage = null) {
    // Draw memory frames with current state
    this.drawFrames(frames, numFrames, highlightType, highlightPage)
    
    // Draw reference string with step indicators
    this.drawReferenceString(referenceString, currentStep)
  }
}
