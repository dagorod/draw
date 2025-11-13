class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 24, 32);
        this.color = '#4CAF50';
        this.speed = 180; // horizontal movement speed
        this.jumpForce = 400; // jump strength
        this.gravity = 800; // gravity force
        this.maxFallSpeed = 600;
        this.tag = 'player';
        this.solid = true;
        
        // Platform physics
        this.isOnGround = false;
        this.canJump = true;
        this.groundCheckDistance = 5;
        
        // Visual effects
        this.facingRight = true;
        this.jumpParticles = [];
        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
        
        // Handle input
        this.handleMovement(deltaTime);
        
        // Apply gravity
        this.applyGravity(deltaTime);
        
        // Apply movement
        super.update(deltaTime);
        
        // Check platform collisions
        this.checkPlatformCollisions();
        
        // NO BOUNDARIES AT ALL - let player move freely
        // Removed all position constraints to allow true free fall
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Note: All boundary checks removed - let Game.js handle death when falling
    }

    handleMovement(deltaTime) {
        const input = game.engine.input;
        let horizontalInput = 0;
        
        // Horizontal movement
        if (input.isKeyPressed('KeyA') || input.isKeyPressed('ArrowLeft')) {
            horizontalInput = -1;
            this.facingRight = false;
        }
        if (input.isKeyPressed('KeyD') || input.isKeyPressed('ArrowRight')) {
            horizontalInput = 1;
            this.facingRight = true;
        }
        
        // Set horizontal velocity
        this.velocity.x = horizontalInput * this.speed;
        
        // Jumping
        if ((input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp') || input.isKeyDown('Space')) && this.canJump) {
            this.jump();
        }
    }

    jump() {
        if (this.isOnGround || this.canJump) {
            this.velocity.y = -this.jumpForce;
            this.isOnGround = false;
            this.canJump = false;
            this.createJumpParticles();
        }
    }

    applyGravity(deltaTime) {
        if (!this.isOnGround) {
            this.velocity.y += this.gravity * deltaTime;
            if (this.velocity.y > this.maxFallSpeed) {
                this.velocity.y = this.maxFallSpeed;
            }
        }
    }

    checkPlatformCollisions() {
        const platforms = game.engine.findGameObjectsByTag('platform');
        let wasOnGround = this.isOnGround;
        this.isOnGround = false;
        
        for (const platform of platforms) {
            if (platform.collidesWith(this)) {
                this.handlePlatformCollision(platform);
            }
        }
        
        // Check if player just landed
        if (!wasOnGround && this.isOnGround) {
            this.createLandParticles();
            this.canJump = true;
        }
    }

    handlePlatformCollision(platform) {
        const playerBounds = this.getBounds();
        const platformBounds = platform.getBounds();
        
        // Handle collision if player is falling and roughly above the platform
        if (this.velocity.y >= 0 && playerBounds.bottom <= platformBounds.top + 15) {
            const closestPoint = platform.getClosestPoint(this.getCenter());
            
            // Validate the closest point to prevent invalid positioning
            if (closestPoint && 
                closestPoint.x >= 0 && closestPoint.x <= game.engine.getWidth() &&
                closestPoint.y >= 0) {
                
                // Position player on top of platform
                const newY = Math.max(0, closestPoint.y - this.height);
                this.position.y = newY;
                this.velocity.y = 0;
                this.isOnGround = true;
                this.canJump = true;
            }
        }
    }

    createJumpParticles() {
        for (let i = 0; i < 8; i++) {
            this.jumpParticles.push({
                x: this.position.x + Math.random() * this.width,
                y: this.position.y + this.height,
                vx: (Math.random() - 0.5) * 100,
                vy: Math.random() * -50 - 25,
                life: 0.8,
                maxLife: 0.8,
                size: 2 + Math.random() * 2
            });
        }
    }

    createLandParticles() {
        for (let i = 0; i < 6; i++) {
            this.jumpParticles.push({
                x: this.position.x + Math.random() * this.width,
                y: this.position.y + this.height,
                vx: (Math.random() - 0.5) * 80,
                vy: Math.random() * -30,
                life: 0.6,
                maxLife: 0.6,
                size: 1 + Math.random() * 2
            });
        }
    }

    updateParticles(deltaTime) {
        this.jumpParticles = this.jumpParticles.filter(particle => {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.vy += 200 * deltaTime; // Particle gravity
            particle.life -= deltaTime;
            return particle.life > 0;
        });
    }

    render(ctx) {
        // Render particles first
        this.renderParticles(ctx);
        
        // Render player with animation
        this.renderPlayer(ctx);
        
        // Render ground check indicator in debug mode
        if (window.debugMode) {
            this.renderDebugInfo(ctx);
        }
    }

    renderPlayer(ctx) {
        const center = this.getCenter();
        
        // Slight bounce effect when moving
        const bounceOffset = this.isOnGround && Math.abs(this.velocity.x) > 0 
            ? Math.sin(this.time * 10) * 2 
            : 0;
        
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x, 
            this.position.y + bounceOffset, 
            this.width, 
            this.height
        );
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        const eyeY = this.position.y + 8 + bounceOffset;
        if (this.facingRight) {
            ctx.fillRect(this.position.x + 16, eyeY, 4, 4);
            ctx.fillRect(this.position.x + 16, eyeY + 6, 4, 4);
        } else {
            ctx.fillRect(this.position.x + 4, eyeY, 4, 4);
            ctx.fillRect(this.position.x + 4, eyeY + 6, 4, 4);
        }
        
        // Pupils
        ctx.fillStyle = '#000000';
        if (this.facingRight) {
            ctx.fillRect(this.position.x + 18, eyeY + 1, 2, 2);
            ctx.fillRect(this.position.x + 18, eyeY + 7, 2, 2);
        } else {
            ctx.fillRect(this.position.x + 4, eyeY + 1, 2, 2);
            ctx.fillRect(this.position.x + 4, eyeY + 7, 2, 2);
        }
        
        // Ground indicator (feet)
        if (this.isOnGround) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x + 2, this.position.y + this.height, 4, 2);
            ctx.fillRect(this.position.x + this.width - 6, this.position.y + this.height, 4, 2);
        }
    }

    renderParticles(ctx) {
        ctx.fillStyle = '#88ff88';
        for (const particle of this.jumpParticles) {
            const alpha = particle.life / particle.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
        ctx.globalAlpha = 1.0;
    }

    renderDebugInfo(ctx) {
        // Ground check indicator
        ctx.strokeStyle = this.isOnGround ? '#00ff00' : '#ff0000';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            this.position.x, 
            this.position.y + this.height, 
            this.width, 
            this.groundCheckDistance
        );
        
        // Velocity vector
        const center = this.getCenter();
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(
            center.x + this.velocity.x * 0.1,
            center.y + this.velocity.y * 0.1
        );
        ctx.stroke();
    }

    onCollision(other) {
        if (other.tag === 'door') {
            // Collision handled by door
        }
    }

    respawn() {
        // Reset to level starting position
        const level = game.levelManager.getCurrentLevel();
        this.position.set(level.playerStart.x, level.playerStart.y);
        this.velocity.set(0, 0);
        this.isOnGround = false;
        this.canJump = true;
        
        console.log('Player respawned!');
    }

    // Get player stats for UI
    getStats() {
        return {
            position: this.position.copy(),
            velocity: this.velocity.copy(),
            isOnGround: this.isOnGround,
            canJump: this.canJump,
            facingRight: this.facingRight
        };
    }
}