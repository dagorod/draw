class DrawingSystem {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = gameEngine;
        
        this.isDrawing = false;
        this.currentPath = [];
        this.platforms = [];
        this.maxInk = 100;
        this.currentInk = this.maxInk;
        this.inkConsumptionRate = 0.5; // ink per pixel drawn
        
        this.setupMouseEvents();
        this.updateInkDisplay();
    }

    setupMouseEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        
        // Simple touch events (convert touch to mouse events)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.startDrawing(mouseEvent);
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.draw(mouseEvent);
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        }, { passive: false });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        
        // Get the actual displayed size of the canvas
        const displayWidth = rect.width;
        const displayHeight = rect.height;
        
        // Get the actual canvas internal dimensions
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Calculate the scale factors
        const scaleX = canvasWidth / displayWidth;
        const scaleY = canvasHeight / displayHeight;
        
        // Calculate raw position relative to canvas display area
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Debug logging (remove in production)
        if (Math.random() < 0.01) { // Log occasionally to avoid spam
            console.log(`Canvas: ${canvasWidth}x${canvasHeight}, Display: ${displayWidth.toFixed(1)}x${displayHeight.toFixed(1)}, Scale: ${scaleX.toFixed(2)}x${scaleY.toFixed(2)}, Pos: ${x.toFixed(1)},${y.toFixed(1)}`);
        }
        
        return new Vector2(x, y);
    }

    startDrawing(e) {
        if (this.currentInk <= 0) return;
        
        this.isDrawing = true;
        this.currentPath = [];
        const pos = this.getMousePos(e);
        this.currentPath.push(pos);
    }

    draw(e) {
        if (!this.isDrawing || this.currentInk <= 0) return;
        
        const pos = this.getMousePos(e);
        const lastPos = this.currentPath[this.currentPath.length - 1];
        
        if (lastPos) {
            const distance = pos.distanceTo(lastPos);
            
            // Only create a new segment if mouse moved enough (smaller threshold for responsiveness)
            if (distance > 2) {
                const inkCost = distance * this.inkConsumptionRate;
                
                if (this.currentInk >= inkCost) {
                    this.currentInk -= inkCost;
                    
                    // Create platform segment immediately for instant feedback
                    const platform = new DrawnPlatform(lastPos, pos);
                    this.platforms.push(platform);
                    this.engine.addGameObject(platform);
                    
                    this.currentPath.push(pos);
                    this.updateInkDisplay();
                } else {
                    // Not enough ink, stop drawing
                    this.stopDrawing();
                }
            }
        }
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        this.currentPath = [];
    }

    drawPreview() {
        // No longer needed with instant drawing
    }

    render(ctx) {
        // No need to render preview since platforms are created instantly
    }

    updateInkDisplay() {
        const inkPercentage = (this.currentInk / this.maxInk) * 100;
        const inkFill = document.getElementById('inkBarFill');
        if (inkFill) {
            inkFill.style.width = `${inkPercentage}%`;
            
            // Change color based on ink level
            if (inkPercentage > 60) {
                inkFill.style.background = 'linear-gradient(90deg, #00ff88, #00cc66)';
            } else if (inkPercentage > 30) {
                inkFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff8800)';
            } else {
                inkFill.style.background = 'linear-gradient(90deg, #ff4444, #cc2222)';
            }
        }
    }

    hasInk() {
        return this.currentInk > 0;
    }

    getInkPercentage() {
        return (this.currentInk / this.maxInk) * 100;
    }

    addInk(amount) {
        this.currentInk = Math.min(this.maxInk, this.currentInk + amount);
        this.updateInkDisplay();
    }

    resetInk() {
        this.currentInk = this.maxInk;
        this.updateInkDisplay();
    }

    clearAllPlatforms() {
        this.platforms.forEach(platform => platform.destroy());
        this.platforms = [];
    }

    // Get ink info for game state
    getInkInfo() {
        return {
            current: this.currentInk,
            max: this.maxInk,
            percentage: this.getInkPercentage()
        };
    }
}