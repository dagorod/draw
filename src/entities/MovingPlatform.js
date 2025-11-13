class MovingPlatform extends GameObject {
    constructor(x, y, width, height, speed = 50) {
        super(x, y, width, height);
        this.color = '#8844ff';
        this.tag = 'platform';
        this.solid = true;
        
        // Movement properties
        this.speed = speed;
        this.originalX = x;
        this.direction = speed > 0 ? 1 : -1;
        this.moveDistance = 150; // How far it moves
        this.time = 0;
        
        // Visual effects
        this.glowIntensity = 0;
        this.particles = [];
        this.lastParticleTime = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
        
        // Move platform back and forth
        this.velocity.x = this.speed * this.direction;
        
        // Check if we need to reverse direction
        const distanceFromStart = Math.abs(this.position.x - this.originalX);
        if (distanceFromStart >= this.moveDistance) {
            this.direction *= -1;
            this.speed = Math.abs(this.speed) * this.direction;
        }
        
        super.update(deltaTime);
        
        // Update glow effect
        this.glowIntensity = 0.5 + 0.5 * Math.sin(this.time * 4);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Generate trail particles
        const currentTime = performance.now();
        if (currentTime - this.lastParticleTime > 100) {
            this.createTrailParticle();
            this.lastParticleTime = currentTime;
        }
    }

    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.y += particle.speed * deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }

    createTrailParticle() {
        this.particles.push({
            x: this.position.x + Math.random() * this.width,
            y: this.position.y + this.height,
            speed: 20 + Math.random() * 30,
            life: 1.0,
            maxLife: 1.0,
            alpha: 1.0,
            size: 2 + Math.random() * 2
        });
    }

    render(ctx) {
        // Render trail particles
        this.renderParticles(ctx);
        
        // Glow effect
        const center = this.getCenter();
        const glowSize = Math.max(this.width, this.height) * (1 + this.glowIntensity * 0.3);
        
        const gradient = ctx.createRadialGradient(
            center.x, center.y, 0,
            center.x, center.y, glowSize / 2
        );
        gradient.addColorStop(0, this.color + '40');
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            center.x - glowSize / 2,
            center.y - glowSize / 2,
            glowSize,
            glowSize
        );
        
        // Main platform
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Platform pattern
        ctx.fillStyle = '#aa66ff';
        for (let x = 0; x < this.width; x += 10) {
            ctx.fillRect(this.position.x + x, this.position.y + 2, 6, this.height - 4);
        }
        
        // Direction indicator
        ctx.fillStyle = '#ffffff';
        const arrowX = center.x + (this.direction * 15);
        ctx.beginPath();
        ctx.moveTo(arrowX, center.y);
        ctx.lineTo(arrowX - (this.direction * 8), center.y - 4);
        ctx.lineTo(arrowX - (this.direction * 8), center.y + 4);
        ctx.closePath();
        ctx.fill();
    }

    renderParticles(ctx) {
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
        ctx.globalAlpha = 1.0;
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Move player with platform
            const playerBounds = other.getBounds();
            const platformBounds = this.getBounds();
            
            // If player is on top of platform
            if (playerBounds.bottom <= platformBounds.top + 10 && other.velocity.y >= 0) {
                other.position.y = this.position.y - other.height;
                other.velocity.y = 0;
                other.isOnGround = true;
                
                // Move player with platform
                other.position.x += this.velocity.x * (1/60); // Approximate deltaTime
            }
        }
    }

    // Get platform normal for physics (always up for horizontal moving platforms)
    getNormal() {
        return new Vector2(0, -1);
    }

    // Check if platform can support player
    canSupport(player) {
        const playerBottom = player.position.y + player.height;
        const platformTop = this.position.y;
        
        return Math.abs(playerBottom - platformTop) < 10;
    }

    // Get closest point for collision
    getClosestPoint(point) {
        const center = this.getCenter();
        return new Vector2(center.x, this.position.y);
    }
}