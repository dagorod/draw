class Game {
    constructor() {
        this.engine = new GameEngine('gameCanvas');
        this.drawingSystem = new DrawingSystem(this.engine.canvas, this.engine);
        this.levelManager = new LevelManager(this);
        this.player = null;
        this.door = null;
        this.gameState = 'playing'; // 'playing', 'paused', 'won', 'completed', 'gameOver'
        
        this.setupGame();
    }

    setupGame() {
        // Load first level
        this.levelManager.loadLevel(1);

        // Setup input handlers
        this.setupInputHandlers();
        
        // Update level display
        this.updateLevelDisplay();
    }



    setupInputHandlers() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyP') {
                this.togglePause();
            } else if (event.code === 'KeyR') {
                // R key can restart current level anytime, or restart game when completed
                if (this.gameState === 'won' || this.gameState === 'gameOver' || this.gameState === 'completed') {
                    this.restartGame();
                } else if (this.gameState === 'playing' || this.gameState === 'paused') {
                    // Manual restart during gameplay
                    console.log('Manual restart requested...');
                    this.restartLevel();
                }
            } else if (event.code === 'KeyC') {
                // Clear all drawn platforms (except level platforms)
                this.clearDrawnPlatforms();
            } else if (event.code === 'KeyN' && this.gameState === 'won') {
                // Next level
                this.nextLevel();
            }
        });
    }

    start() {
        this.engine.start();
        this.gameLoop();
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        // Check if player and door exist
        if (!this.player || !this.door) return;

        // Check if player fell off the bottom (death condition)
        if (this.player.position.y > this.engine.getHeight()) {
            console.log(`Player fell! y=${this.player.position.y}, canvas height=${this.engine.getHeight()}`);
            this.playerDied();
            return;
        }

        // Check win condition
        if (this.door.collidesWith(this.player)) {
            this.playerWon();
            return;
        }

        // Continue game loop
        if (this.gameState === 'playing') {
            setTimeout(() => this.gameLoop(), 16); // ~60fps
        }
    }

    playerWon() {
        this.gameState = 'won';
        this.engine.stop();
        
        console.log(`Level ${this.levelManager.currentLevel} completed!`);
        
        // Open door animation
        this.door.open();
        
        if (this.levelManager.isLastLevel()) {
            console.log('🎉 Game completed! All levels finished!');
            this.gameState = 'completed';
            // Show win screen for final completion
            this.showWinScreen();
        } else {
            // Show brief celebration then auto-advance to next level
            this.showWinScreen();
            console.log('Advancing to next level...');
            
            // Auto-advance after 2 seconds
            setTimeout(() => {
                this.nextLevel();
            }, 2000);
        }
    }

    playerDied() {
        this.gameState = 'gameOver';
        this.engine.stop();
        
        console.log(`Player died! Restarting level ${this.levelManager.currentLevel}...`);
        
        // Show death screen briefly then restart level
        this.showDeathScreen();
        
        // Auto-restart after 1.5 seconds
        setTimeout(() => {
            this.restartLevel();
        }, 1500);
    }

    showDeathScreen() {
        const ctx = this.engine.ctx;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.fillRect(0, 0, this.engine.getWidth(), this.engine.getHeight());
        
        // Death message
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💀 OOPS!', this.engine.getWidth() / 2, this.engine.getHeight() / 2 - 40);
        
        ctx.fillStyle = '#ffaaaa';
        ctx.font = '24px Arial';
        ctx.fillText('You fell off the platform!', this.engine.getWidth() / 2, this.engine.getHeight() / 2);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.fillText('🔄 Restarting level...', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 40);
    }

    restartLevel() {
        console.log(`Restarting level ${this.levelManager.currentLevel}...`);
        
        // Clear game state
        this.engine.gameObjects = [];
        this.drawingSystem.platforms = [];
        
        // Reset ink for the current level
        const levelInfo = this.levelManager.getLevelInfo();
        this.drawingSystem.maxInk = levelInfo.maxInk;
        this.drawingSystem.currentInk = levelInfo.maxInk;
        this.drawingSystem.updateInkDisplay();
        
        // Reload current level
        this.levelManager.loadLevel(this.levelManager.currentLevel);
        
        // Reset game state and restart
        this.gameState = 'playing';
        this.engine.start();
        this.gameLoop();
        
        console.log(`Level ${this.levelManager.currentLevel} restarted!`);
    }

    showWinScreen() {
        const ctx = this.engine.ctx;
        const levelInfo = this.levelManager.getLevelInfo();
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.engine.getWidth(), this.engine.getHeight());
        
        if (this.gameState === 'completed') {
            // Game completed screen
            ctx.fillStyle = '#ffaa00';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 GAME COMPLETED! 🎉', this.engine.getWidth() / 2, this.engine.getHeight() / 2 - 60);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.fillText('You finished all levels!', this.engine.getWidth() / 2, this.engine.getHeight() / 2 - 20);
            
            ctx.font = '16px Arial';
            ctx.fillText('Press R to restart from level 1', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 20);
        } else {
            // Level completed screen with auto-advance message
            ctx.fillStyle = '#00ff88';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`LEVEL ${levelInfo.number} COMPLETED!`, this.engine.getWidth() / 2, this.engine.getHeight() / 2 - 60);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '20px Arial';
            ctx.fillText(levelInfo.name, this.engine.getWidth() / 2, this.engine.getHeight() / 2 - 30);
            
            // Show auto-advance message instead of manual instruction
            ctx.fillStyle = '#ffaa00';
            ctx.font = '18px Arial';
            ctx.fillText('🚀 Advancing to next level...', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 20);
            
            const inkUsed = this.drawingSystem.maxInk - this.drawingSystem.currentInk;
            const inkPercentage = ((this.drawingSystem.maxInk - inkUsed) / this.drawingSystem.maxInk * 100).toFixed(1);
            ctx.font = '18px Arial';
            ctx.fillText(`Ink Remaining: ${inkPercentage}%`, this.engine.getWidth() / 2, this.engine.getHeight() / 2);
            
            if (!levelInfo.isLast) {
                ctx.font = '16px Arial';
                ctx.fillText('Press N for next level', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 30);
                ctx.fillText('Press R to restart this level', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 50);
            } else {
                ctx.font = '16px Arial';
                ctx.fillText('Final level! Press R to restart', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 30);
            }
        }
        
        ctx.textAlign = 'left';
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.engine.stop();
            console.log('Game Paused - Press P to resume');
            this.showPauseScreen();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.engine.start();
            this.gameLoop();
            console.log('Game Resumed');
        }
    }

    showPauseScreen() {
        const ctx = this.engine.ctx;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.engine.getWidth(), this.engine.getHeight());
        
        // Pause text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', this.engine.getWidth() / 2, this.engine.getHeight() / 2);
        
        ctx.font = '16px Arial';
        ctx.fillText('Press P to resume', this.engine.getWidth() / 2, this.engine.getHeight() / 2 + 40);
        
        ctx.textAlign = 'left';
    }

    nextLevel() {
        if (this.levelManager.nextLevel()) {
            this.gameState = 'playing';
            this.updateLevelDisplay();
            this.engine.start();
            this.gameLoop();
        }
    }

    restartGame() {
        console.log('Restarting...');
        
        if (this.gameState === 'completed') {
            // Restart from level 1
            this.levelManager.loadLevel(1);
        } else {
            // Restart current level
            this.levelManager.restartLevel();
        }
        
        this.gameState = 'playing';
        this.updateLevelDisplay();
        this.engine.start();
        this.gameLoop();
    }

    updateLevelDisplay() {
        const levelInfo = this.levelManager.getLevelInfo();
        const levelDisplay = document.getElementById('levelDisplay');
        if (levelDisplay) {
            levelDisplay.textContent = `Level ${levelInfo.number}: ${levelInfo.name}`;
        }
        
        const levelDescription = document.getElementById('levelDescription');
        if (levelDescription) {
            levelDescription.textContent = levelInfo.description;
        }
    }

    // Enhanced render to include drawing system
    render() {
        // Let engine render game objects first
        this.engine.render();
        
        // Render drawing system (current line being drawn)
        this.drawingSystem.render(this.engine.ctx);
        
        // Render game state overlays
        if (this.gameState === 'paused') {
            this.showPauseScreen();
        } else if (this.gameState === 'won') {
            this.showWinScreen();
        }
    }

    clearDrawnPlatforms() {
        const platforms = this.engine.findGameObjectsByTag('platform');
        let clearedCount = 0;
        
        platforms.forEach(platform => {
            // Only clear user-drawn platforms (green ones), not level platforms (gray ones)
            if (platform.color === '#00ff88') { // Only clear drawn platforms
                platform.destroy();
                clearedCount++;
            }
        });
        
        // Refund some ink for cleared platforms
        if (clearedCount > 0) {
            const inkRefund = clearedCount * 10;
            this.drawingSystem.addInk(inkRefund);
            console.log(`Cleared ${clearedCount} platforms, refunded ${inkRefund} ink`);
        }
    }

    showGameCompletedScreen() {
        this.showWinScreen(); // Uses the same screen but with completed state
    }

    // Get game statistics
    getStats() {
        const levelInfo = this.levelManager.getLevelInfo();
        return {
            gameState: this.gameState,
            currentLevel: levelInfo.number,
            levelName: levelInfo.name,
            playerPosition: this.player ? this.player.position.copy() : null,
            inkRemaining: this.drawingSystem.getInkPercentage(),
            platformsDrawn: this.engine.findGameObjectsByTag('platform').filter(p => p.color === '#00ff88').length,
            totalObjects: this.engine.gameObjects.length,
            progress: this.levelManager.getLevelProgress()
        };
    }

    // Debug methods
    giveInk(amount = 50) {
        this.drawingSystem.addInk(amount);
        console.log(`Added ${amount} ink`);
    }

    teleportToTop() {
        if (this.player) {
            this.player.position.set(this.door.position.x, this.door.position.y + 100);
            console.log('Player teleported near door');
        }
    }

    jumpToLevel(levelNumber) {
        if (this.levelManager.loadLevel(levelNumber)) {
            this.gameState = 'playing';
            this.updateLevelDisplay();
            console.log(`Jumped to level ${levelNumber}`);
        }
    }

    showHelp() {
        console.log('=== Draw & Escape Help ===');
        console.log('🖱️  Click and drag to draw platforms');
        console.log('⌨️  WASD to move and jump');
        console.log('🎯 Goal: Reach the door at the top');
        console.log('💧 Watch your ink - it gets less each level!');
        console.log('⏸️  P to pause');
        console.log('🔄 C to clear drawn platforms (refunds ink)');
        console.log('➡️  N for next level (when level complete)');
        console.log('🔧 Debug: window.debugDraw.jumpToLevel(X) to skip levels');
    }
}