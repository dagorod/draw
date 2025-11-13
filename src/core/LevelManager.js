class LevelManager {
    constructor(game) {
        this.game = game;
        this.currentLevel = 1;
        this.maxLevel = 5; // We'll create 5 levels
        this.levels = this.createLevels();
    }

    createLevels() {
        return {
            1: {
                name: "First Steps",
                description: "Learn to draw and jump",
                ink: 100,
                obstacles: [],
                doorPosition: { x: 400, y: 50 },
                playerStart: { x: 50, y: 450 },
                platforms: [
                    // Small starting platform
                    { start: { x: 30, y: 480 }, end: { x: 70, y: 480 } }
                ]
            },
            
            2: {
                name: "The Gap",
                description: "Navigate around obstacles",
                ink: 80,
                obstacles: [
                    { type: "wall", x: 300, y: 400, width: 20, height: 200 },
                    { type: "wall", x: 500, y: 200, width: 20, height: 300 }
                ],
                doorPosition: { x: 700, y: 30 },
                playerStart: { x: 50, y: 450 },
                platforms: [
                    // Small starting platform
                    { start: { x: 30, y: 480 }, end: { x: 70, y: 480 } }
                ]
            },

            3: {
                name: "Narrow Passage",
                description: "Precision drawing required",
                ink: 60,
                obstacles: [
                    { type: "wall", x: 200, y: 300, width: 400, height: 20 },
                    { type: "wall", x: 200, y: 420, width: 400, height: 20 },
                    { type: "spike", x: 150, y: 560, width: 500, height: 20 }
                ],
                doorPosition: { x: 400, y: 250 },
                playerStart: { x: 50, y: 450 },
                platforms: [
                    // Small starting platform
                    { start: { x: 30, y: 480 }, end: { x: 70, y: 480 } }
                ]
            },

            4: {
                name: "The Maze",
                description: "Find the path through",
                ink: 50,
                obstacles: [
                    { type: "wall", x: 150, y: 450, width: 20, height: 150 },
                    { type: "wall", x: 250, y: 350, width: 20, height: 150 },
                    { type: "wall", x: 350, y: 450, width: 20, height: 150 },
                    { type: "wall", x: 450, y: 250, width: 20, height: 200 },
                    { type: "wall", x: 550, y: 350, width: 20, height: 200 },
                    { type: "moving", x: 300, y: 200, width: 100, height: 10, speed: 50 }
                ],
                doorPosition: { x: 650, y: 50 },
                playerStart: { x: 50, y: 450 },
                platforms: [
                    // Small starting platform
                    { start: { x: 30, y: 480 }, end: { x: 70, y: 480 } }
                ]
            },

            5: {
                name: "Final Challenge",
                description: "Master level - minimal ink!",
                ink: 30,
                obstacles: [
                    { type: "wall", x: 100, y: 400, width: 20, height: 200 },
                    { type: "wall", x: 200, y: 300, width: 20, height: 200 },
                    { type: "wall", x: 300, y: 400, width: 20, height: 200 },
                    { type: "wall", x: 400, y: 200, width: 20, height: 300 },
                    { type: "wall", x: 500, y: 350, width: 20, height: 200 },
                    { type: "wall", x: 600, y: 250, width: 20, height: 300 },
                    { type: "moving", x: 150, y: 150, width: 80, height: 10, speed: 60 },
                    { type: "moving", x: 350, y: 100, width: 80, height: 10, speed: -70 },
                    { type: "spike", x: 50, y: 560, width: 100, height: 20 },
                    { type: "spike", x: 650, y: 560, width: 100, height: 20 }
                ],
                doorPosition: { x: 700, y: 30 },
                playerStart: { x: 30, y: 450 },
                platforms: [
                    // Small starting platform  
                    { start: { x: 10, y: 480 }, end: { x: 50, y: 480 } }
                ]
            }
        };
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    loadLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > this.maxLevel) {
            console.log('Invalid level number');
            return false;
        }

        this.currentLevel = levelNumber;
        const level = this.getCurrentLevel();
        
        // Clear existing game objects
        this.game.engine.clearGameObjects();
        this.game.drawingSystem.clearAllPlatforms();
        
        // Set ink for this level
        this.game.drawingSystem.currentInk = level.ink;
        this.game.drawingSystem.maxInk = level.ink;
        this.game.drawingSystem.updateInkDisplay();
        
        // Create player at level start position
        this.game.player = new Player(level.playerStart.x, level.playerStart.y);
        this.game.engine.addGameObject(this.game.player);
        
        // Create door at level position
        this.game.door = new Door(level.doorPosition.x, level.doorPosition.y);
        this.game.engine.addGameObject(this.game.door);
        
        // Create level platforms
        this.createLevelPlatforms(level.platforms);
        
        // Create level obstacles
        this.createLevelObstacles(level.obstacles);
        
        console.log(`Level ${levelNumber}: ${level.name} loaded!`);
        console.log(`Description: ${level.description}`);
        console.log(`Available ink: ${level.ink}`);
        
        return true;
    }

    createLevelPlatforms(platforms) {
        platforms.forEach(platformData => {
            const platform = new DrawnPlatform(
                new Vector2(platformData.start.x, platformData.start.y),
                new Vector2(platformData.end.x, platformData.end.y)
            );
            platform.color = '#444444'; // Different color for level platforms
            this.game.engine.addGameObject(platform);
        });
    }

    createLevelObstacles(obstacles) {
        obstacles.forEach(obstacleData => {
            let obstacle;
            
            switch (obstacleData.type) {
                case 'wall':
                    obstacle = new Wall(obstacleData.x, obstacleData.y, obstacleData.width, obstacleData.height);
                    break;
                case 'spike':
                    obstacle = new Spike(obstacleData.x, obstacleData.y, obstacleData.width, obstacleData.height);
                    break;
                case 'moving':
                    obstacle = new MovingPlatform(
                        obstacleData.x, obstacleData.y, 
                        obstacleData.width, obstacleData.height,
                        obstacleData.speed || 50
                    );
                    break;
            }
            
            if (obstacle) {
                this.game.engine.addGameObject(obstacle);
            }
        });
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.loadLevel(this.currentLevel + 1);
            return true;
        } else {
            // Game completed!
            this.gameCompleted();
            return false;
        }
    }

    gameCompleted() {
        console.log('🎉 Congratulations! You completed all levels!');
        this.game.gameState = 'completed';
        this.game.showGameCompletedScreen();
    }

    restartLevel() {
        this.loadLevel(this.currentLevel);
    }

    isLastLevel() {
        return this.currentLevel === this.maxLevel;
    }

    getLevelProgress() {
        return {
            current: this.currentLevel,
            max: this.maxLevel,
            percentage: (this.currentLevel / this.maxLevel) * 100
        };
    }

    // Get level info for UI
    getLevelInfo() {
        const level = this.getCurrentLevel();
        return {
            number: this.currentLevel,
            name: level.name,
            description: level.description,
            ink: level.ink,
            isLast: this.isLastLevel()
        };
    }
}