class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.input = new Input();
        
        this.lastTime = 0;
        this.running = false;
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game stats
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
    }

    // Add a game object to the scene
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        return gameObject;
    }

    // Remove a game object from the scene
    removeGameObject(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }

    // Find game objects by tag
    findGameObjectsByTag(tag) {
        return this.gameObjects.filter(obj => obj.tag === tag);
    }

    // Find first game object by tag
    findGameObjectByTag(tag) {
        return this.gameObjects.find(obj => obj.tag === tag);
    }

    // Start the game loop
    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    // Stop the game loop
    stop() {
        this.running = false;
    }

    // Main game loop
    gameLoop() {
        if (!this.running) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update FPS counter
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate > 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }

        // Update game
        this.update(deltaTime);

        // Render game
        this.render();

        // Update input (clear frame-specific states)
        this.input.update();

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    // Update all game objects
    update(deltaTime) {
        // Remove inactive objects
        this.gameObjects = this.gameObjects.filter(obj => obj.active);

        // Update all active objects
        for (let obj of this.gameObjects) {
            if (obj.active) {
                obj.update(deltaTime);
            }
        }

        // Check collisions
        this.checkCollisions();
    }

    // Render all game objects
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Render all active objects
        for (let obj of this.gameObjects) {
            if (obj.active) {
                obj.render(this.ctx);
            }
        }

        // Render debug info if needed
        this.renderDebugInfo();
    }

    // Check collisions between all solid objects
    checkCollisions() {
        const solidObjects = this.gameObjects.filter(obj => obj.active && obj.solid);
        
        for (let i = 0; i < solidObjects.length; i++) {
            for (let j = i + 1; j < solidObjects.length; j++) {
                const obj1 = solidObjects[i];
                const obj2 = solidObjects[j];
                
                if (obj1.collidesWith(obj2)) {
                    obj1.onCollision(obj2);
                    obj2.onCollision(obj1);
                }
            }
        }
    }

    // Render debug information
    renderDebugInfo() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        this.ctx.fillText(`Objects: ${this.gameObjects.length}`, 10, 35);
    }

    // Utility methods
    getRandomPosition() {
        return new Vector2(
            Math.random() * this.width,
            Math.random() * this.height
        );
    }

    getRandomColor() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Clear all game objects
    clearGameObjects() {
        this.gameObjects = [];
    }

    // Get canvas dimensions
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}