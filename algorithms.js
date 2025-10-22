/**
 * Page Replacement Algorithms Implementation
 * 
 * This module contains the core logic for implementing various page replacement algorithms
 * used in operating system memory management. It provides a comprehensive simulation
 * of how different algorithms handle page faults and memory allocation.
 * 
 * Supported Algorithms:
 * - FIFO (First In First Out): Replaces the oldest page
 * - LRU (Least Recently Used): Replaces the least recently accessed page
 * - Optimal: Replaces the page that will be used furthest in the future
 * - Clock: Circular buffer algorithm with reference bits
 * 
 * @author OS Page Replacement Visualizer
 * @version 1.0.0
 */

/**
 * PageReplacementSimulator Class
 * 
 * Main class that handles the simulation of page replacement algorithms.
 * It maintains the state of memory frames, tracks page faults/hits, and
 * generates a complete execution trace for visualization.
 */
class PageReplacementSimulator {
  /**
   * Constructor - Initializes the simulator with given parameters
   * 
   * @param {string} referenceString - Comma-separated string of page references
   * @param {number} numFrames - Number of available memory frames
   * @param {string} algorithm - Algorithm type ('fifo', 'lru', 'optimal', 'clock')
   */
  constructor(referenceString, numFrames, algorithm) {
    // Parse and validate the reference string
    this.referenceString = referenceString.split(",").map((x) => Number.parseInt(x.trim()))
    this.numFrames = numFrames
    this.algorithm = algorithm
    
    // Initialize simulation state
    this.frames = []                    // Current pages in memory frames
    this.pageFaults = 0                 // Counter for page faults
    this.pageHits = 0                   // Counter for page hits
    this.history = []                   // Complete execution trace
    this.dataStructures = {}           // Algorithm-specific data structures

    // Set up algorithm-specific data structures
    this.initializeAlgorithm()
  }

  /**
   * Initialize Algorithm-Specific Data Structures
   * 
   * Sets up the necessary data structures for each algorithm:
   * - FIFO: Queue to track page insertion order
   * - LRU: List to track access recency
   * - Optimal: Precomputed future reference indices
   * - Clock: Reference flags and circular pointer
   */
  initializeAlgorithm() {
    switch (this.algorithm) {
      case "fifo":
        // FIFO uses a queue to track the order of page insertions
        this.dataStructures.queue = []
        break
      case "lru":
        // LRU uses a list to track the recency of page accesses
        this.dataStructures.recencyList = []
        break
      case "optimal":
        // Optimal algorithm needs future reference information
        this.dataStructures.futureReferences = this.calculateFutureReferences()
        break
      case "clock":
        // Clock algorithm uses reference flags and a circular pointer
        this.dataStructures.referenceFlags = {}
        this.dataStructures.clockPointer = 0
        break
    }
  }

  /**
   * Calculate Future References for Optimal Algorithm
   * 
   * Precomputes when each page will be referenced in the future.
   * This is essential for the optimal algorithm to make perfect decisions.
   * 
   * @returns {Object} Map of page numbers to arrays of future indices
   */
  calculateFutureReferences() {
    const futureRefs = {}
    
    // Build a map of each page to its future occurrence indices
    for (let i = 0; i < this.referenceString.length; i++) {
      const page = this.referenceString[i]
      if (!futureRefs[page]) {
        futureRefs[page] = []
      }
      futureRefs[page].push(i)
    }
    return futureRefs
  }

  /**
   * Process a Single Page Reference
   * 
   * Handles the core logic for processing each page reference:
   * 1. Check if page is already in memory (hit)
   * 2. If not, handle page fault and replacement
   * 3. Update algorithm-specific data structures
   * 4. Record the step in execution history
   * 
   * @param {number} pageNumber - The page number being referenced
   * @param {number} stepIndex - Current step index in the simulation
   */
  processPage(pageNumber, stepIndex) {
    // Check if page is already in memory (page hit)
    const isHit = this.frames.includes(pageNumber)

    if (isHit) {
      // Page Hit: Page is already in memory
      this.pageHits++
      this.updateDataStructures(pageNumber, stepIndex, true)
    } else {
      // Page Fault: Page is not in memory, need to load it
      this.pageFaults++

      if (this.frames.length < this.numFrames) {
        // Empty frame available - simply add the page
        this.frames.push(pageNumber)
      } else {
        // No empty frames - need to replace an existing page
        const pageToReplace = this.selectPageToReplace(stepIndex)
        const index = this.frames.indexOf(pageToReplace)
        this.frames[index] = pageNumber
      }

      // Update algorithm-specific data structures for the new page
      this.updateDataStructures(pageNumber, stepIndex, false)
    }

    // Record this step in the execution history
    this.history.push({
      step: stepIndex,
      page: pageNumber,
      isHit,
      frames: [...this.frames],  // Deep copy of current frame state
      dataStructures: JSON.parse(JSON.stringify(this.dataStructures)), // Deep copy of data structures
    })
  }

  /**
   * Select Page to Replace Based on Algorithm
   * 
   * Determines which page should be replaced when a page fault occurs
   * and no empty frames are available. The selection depends on the
   * specific algorithm being used.
   * 
   * @param {number} currentStep - Current step index
   * @returns {number} The page number to be replaced
   */
  selectPageToReplace(currentStep) {
    switch (this.algorithm) {
      case "fifo":
        // FIFO: Replace the page that was loaded first (oldest)
        return this.dataStructures.queue.shift()
      case "lru":
        // LRU: Replace the least recently used page
        return this.dataStructures.recencyList.shift()
      case "optimal":
        // Optimal: Replace the page that will be used furthest in the future
        return this.selectOptimalPage(currentStep)
      case "clock":
        // Clock: Use circular buffer with reference bits
        return this.selectClockPage()
    }
  }

  /**
   * Select Optimal Page for Replacement
   * 
   * Implements the optimal page replacement algorithm by finding the page
   * that will be referenced furthest in the future (or never again).
   * This algorithm provides the theoretical minimum number of page faults.
   * 
   * @param {number} currentStep - Current step index
   * @returns {number} The page number to replace
   */
  selectOptimalPage(currentStep) {
    let farthestPage = this.frames[0]
    let farthestIndex = currentStep

    // Check each page in memory to find the one used furthest in the future
    for (const page of this.frames) {
      const futureIndices = this.dataStructures.futureReferences[page] || []
      // Find the next occurrence of this page after current step
      const nextIndex = futureIndices.find((idx) => idx > currentStep) || Number.POSITIVE_INFINITY

      // If this page is used further in the future, it's a better candidate for replacement
      if (nextIndex > farthestIndex) {
        farthestIndex = nextIndex
        farthestPage = page
      }
    }

    return farthestPage
  }

  /**
   * Select Page Using Clock Algorithm
   * 
   * Implements the clock (second chance) algorithm using a circular buffer
   * with reference bits. Pages with reference bit set get a second chance.
   * 
   * @returns {number} The page number to replace
   */
  selectClockPage() {
    // Continue until we find a page with reference bit = 0
    while (true) {
      const page = this.frames[this.dataStructures.clockPointer]
      
      if (this.dataStructures.referenceFlags[page]) {
        // Page has reference bit set - give it a second chance
        this.dataStructures.referenceFlags[page] = false
        this.dataStructures.clockPointer = (this.dataStructures.clockPointer + 1) % this.frames.length
      } else {
        // Page has reference bit = 0 - replace it
        this.dataStructures.clockPointer = (this.dataStructures.clockPointer + 1) % this.frames.length
        return page
      }
    }
  }

  /**
   * Update Algorithm-Specific Data Structures
   * 
   * Maintains the data structures required by each algorithm when a page
   * is accessed or loaded into memory.
   * 
   * @param {number} pageNumber - The page being accessed
   * @param {number} stepIndex - Current step index
   * @param {boolean} isHit - Whether this was a page hit or fault
   */
  updateDataStructures(pageNumber, stepIndex, isHit) {
    switch (this.algorithm) {
      case "fifo":
        // FIFO: Only add to queue on page faults (new pages)
        if (!isHit) {
          this.dataStructures.queue.push(pageNumber)
        }
        break
      case "lru":
        // LRU: Update recency list on every access
        // Remove page from current position and add to end (most recent)
        this.dataStructures.recencyList = this.dataStructures.recencyList.filter((p) => p !== pageNumber)
        this.dataStructures.recencyList.push(pageNumber)
        break
      case "clock":
        // Clock: Set reference bit when page is accessed
        this.dataStructures.referenceFlags[pageNumber] = true
        break
    }
  }

  /**
   * Get Simulation Statistics
   * 
   * Calculates and returns comprehensive statistics about the simulation:
   * - Number of page faults and hits
   * - Hit ratio percentage
   * - Total number of references
   * 
   * @returns {Object} Statistics object with fault/hit counts and ratios
   */
  getStatistics() {
    const total = this.pageFaults + this.pageHits
    return {
      pageFaults: this.pageFaults,
      pageHits: this.pageHits,
      hitRatio: total > 0 ? ((this.pageHits / total) * 100).toFixed(2) : 0,
      totalReferences: total,
    }
  }

  /**
   * Run Complete Simulation
   * 
   * Executes the entire page replacement simulation by processing
   * each page reference in sequence and building the complete
   * execution history.
   * 
   * @returns {Array} Complete execution history with all steps
   */
  simulate() {
    // Process each page reference in the sequence
    for (let i = 0; i < this.referenceString.length; i++) {
      this.processPage(this.referenceString[i], i)
    }
    return this.history
  }

  /**
   * Generate Execution Trace Report
   * 
   * Creates a detailed text report of the simulation including:
   * - Algorithm configuration
   * - Statistics summary
   * - Step-by-step execution trace
   * 
   * @returns {string} Formatted execution trace report
   */
  getExecutionTrace() {
    let trace = `Page Replacement Algorithm: ${this.algorithm.toUpperCase()}\n`
    trace += `Number of Frames: ${this.numFrames}\n`
    trace += `Reference String: ${this.referenceString.join(", ")}\n\n`
    trace += `Statistics:\n`
    trace += `- Page Faults: ${this.pageFaults}\n`
    trace += `- Page Hits: ${this.pageHits}\n`
    trace += `- Hit Ratio: ${this.getStatistics().hitRatio}%\n\n`
    trace += `Execution Trace:\n`

    // Add detailed step-by-step trace
    for (const entry of this.history) {
      trace += `Step ${entry.step}: Page ${entry.page} - ${entry.isHit ? "HIT" : "FAULT"} - Frames: [${entry.frames.join(", ")}]\n`
    }

    return trace
  }
}
