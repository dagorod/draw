class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.color = '#ff0000';
        this.speed = 50 + Math.random() * 100; // Random speed between 50-150
        this.tag = 'enemy';
        this.solid = true;
        this.target = null;
        this.lastDirectionChange = 0;
        this.directionChangeInterval = 2000; // Change direction every 2 seconds
        this.currentDirection = new Vector2(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize();
        this.behaviorType = this.chooseBehaviorType();
        this.detectionRadius = 150;
    }

    chooseBehaviorType() {
        const types = ['wanderer', 'chaser', 'patrol'];
        return types[Math.floor(Math.random() * types.length)];
    }

    update(deltaTime) {
        // Find player target
        if (!this.target) {
            this.target = game.engine.findGameObjectByTag('player');
        }

        // Update behavior based on type
        switch (this.behaviorType) {
            case 'chaser':
                this.chaserBehavior(deltaTime);
                break;
            case 'patrol':
                this.patrolBehavior(deltaTime);
                break;
            default:
                this.wandererBehavior(deltaTime);
                break;
        }

        // Apply movement
        super.update(deltaTime);

        // Bounce off walls
        this.bounceOffWalls();

        // Keep within bounds
        this.constrainToBounds(0, 0, game.engine.getWidth(), game.engine.getHeight());
    }

    wandererBehavior(deltaTime) {
        // Change direction periodically
        const currentTime = performance.now();
        if (currentTime - this.lastDirectionChange > this.directionChangeInterval) {
            this.currentDirection = new Vector2(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
            this.lastDirectionChange = currentTime;
        }

        this.velocity.set(
            this.currentDirection.x * this.speed,
            this.currentDirection.y * this.speed
        );
    }

    chaserBehavior(deltaTime) {
        if (this.target) {
            const playerCenter = this.target.getCenter();
            const enemyCenter = this.getCenter();
            const distance = enemyCenter.distanceTo(playerCenter);

            // Only chase if player is within detection radius
            if (distance < this.detectionRadius) {
                const direction = new Vector2(
                    playerCenter.x - enemyCenter.x,
                    playerCenter.y - enemyCenter.y
                ).normalize();

                this.velocity.set(
                    direction.x * this.speed,
                    direction.y * this.speed
                );
            } else {
                // Wander if player is too far
                this.wandererBehavior(deltaTime);
            }
        } else {
            this.wandererBehavior(deltaTime);
        }
    }

    patrolBehavior(deltaTime) {
        // Simple patrol - move in current direction until hitting wall
        this.velocity.set(
            this.currentDirection.x * this.speed,
            this.currentDirection.y * this.speed
        );

        // Check if we need to turn around (hitting walls)
        const bounds = this.getBounds();
        if (bounds.left <= 0 || bounds.right >= game.engine.getWidth()) {
            this.currentDirection.x *= -1;
        }
        if (bounds.top <= 0 || bounds.bottom >= game.engine.getHeight()) {
            this.currentDirection.y *= -1;
        }
    }

    bounceOffWalls() {
        const bounds = this.getBounds();
        
        if (bounds.left <= 0 || bounds.right >= game.engine.getWidth()) {
            this.velocity.x *= -1;
            this.currentDirection.x *= -1;
        }
        
        if (bounds.top <= 0 || bounds.bottom >= game.engine.getHeight()) {
            this.velocity.y *= -1;
            this.currentDirection.y *= -1;
        }
    }

    render(ctx) {
        // Render enemy
        super.render(ctx);

        // Render behavior indicator
        this.renderBehaviorIndicator(ctx);

        // Render detection radius for chasers
        if (this.behaviorType === 'chaser') {
            this.renderDetectionRadius(ctx);
        }
    }

    renderBehaviorIndicator(ctx) {
        const center = this.getCenter();
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        
        let indicator = '';
        switch (this.behaviorType) {
            case 'chaser': indicator = '👁'; break;
            case 'patrol': indicator = '🔄'; break;
            default: indicator = '🎲'; break;
        }
        
        ctx.fillText(indicator, center.x, center.y - this.height / 2 - 5);
        ctx.textAlign = 'left';
    }

    renderDetectionRadius(ctx) {
        const center = this.getCenter();
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.detectionRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Collision with player is handled by player
        } else if (other.tag === 'enemy') {
            // Simple separation from other enemies
            const direction = new Vector2(
                this.position.x - other.position.x,
                this.position.y - other.position.y
            ).normalize();
            
            this.position.add(new Vector2(direction.x * 2, direction.y * 2));
        }
    }

    // Static method to create random enemy
    static createRandom(engine) {
        const x = Math.random() * (engine.getWidth() - 24);
        const y = Math.random() * (engine.getHeight() - 24);
        return new Enemy(x, y);
    }

    // Get enemy info
    getInfo() {
        return {
            behaviorType: this.behaviorType,
            speed: this.speed,
            position: this.position.copy(),
            hasTarget: this.target !== null
        };
    }
}