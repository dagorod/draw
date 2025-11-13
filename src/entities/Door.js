class Door extends GameObject {
    constructor(x, y) {
        super(x, y, 48, 64);
        this.color = '#ffaa00';
        this.tag = 'door';
        this.solid = false; // Allow player to overlap with door for collision detection
        
        // Animation properties
        this.time = 0;
        this.glowIntensity = 0;
        this.pulseSpeed = 2;
        
        // Door state
        this.isOpen = false;
        this.animationProgress = 0;
        
        // Visual effects
        this.particles = [];
        this.lastParticleTime = 0;
        this.particleInterval = 200; // ms
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        this.time += deltaTime;
        this.glowIntensity = 0.5 + 0.5 * Math.sin(this.time * this.pulseSpeed);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Generate particles
        const currentTime = performance.now();
        if (currentTime - this.lastParticleTime > this.particleInterval) {
            this.createParticle();
            this.lastParticleTime = currentTime;
        }
    }

    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.y -= particle.speed * deltaTime;
            particle.x += particle.drift * deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }

    createParticle() {
        const particle = {
            x: this.position.x + Math.random() * this.width,
            y: this.position.y + this.height,
            speed: 30 + Math.random() * 40,
            drift: (Math.random() - 0.5) * 20,
            life: 2.0,
            maxLife: 2.0,
            alpha: 1.0,
            size: 2 + Math.random() * 3,
            color: Math.random() > 0.5 ? '#ffaa00' : '#ffdd44'
        };
        this.particles.push(particle);
    }

    render(ctx) {
        // Render particles first (behind door)
        this.renderParticles(ctx);
        
        // Render glow effect
        const center = this.getCenter();
        const glowSize = Math.max(this.width, this.height) * (1 + this.glowIntensity * 0.5);
        
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
        
        // Render door
        this.renderDoor(ctx);
        
        // Render door indicator
        this.renderIndicator(ctx);
    }

    renderDoor(ctx) {
        // Door frame
        ctx.fillStyle = '#8B4513'; // Brown
        ctx.fillRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
        
        // Door itself
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Door panels
        ctx.strokeStyle = '#CC8800';
        ctx.lineWidth = 2;
        
        // Vertical center line
        ctx.beginPath();
        ctx.moveTo(this.position.x + this.width / 2, this.position.y + 5);
        ctx.lineTo(this.position.x + this.width / 2, this.position.y + this.height - 5);
        ctx.stroke();
        
        // Horizontal lines
        const panelHeight = (this.height - 10) / 3;
        for (let i = 1; i < 3; i++) {
            const y = this.position.y + 5 + panelHeight * i;
            ctx.beginPath();
            ctx.moveTo(this.position.x + 5, y);
            ctx.lineTo(this.position.x + this.width - 5, y);
            ctx.stroke();
        }
        
        // Door handle
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.beginPath();
        ctx.arc(
            this.position.x + this.width * 0.8,
            this.position.y + this.height / 2,
            3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Keyhole
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(
            this.position.x + this.width * 0.8,
            this.position.y + this.height / 2 + 8,
            2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    renderParticles(ctx) {
        for (const particle of this.particles) {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
        ctx.globalAlpha = 1.0;
    }

    renderIndicator(ctx) {
        const center = this.getCenter();
        
        // Floating "EXIT" text
        const textY = this.position.y - 30 + Math.sin(this.time * 3) * 5;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText('EXIT', center.x, textY);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        
        // Arrow pointing down to door
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(center.x, textY + 5);
        ctx.lineTo(center.x, textY + 15);
        ctx.moveTo(center.x - 5, textY + 10);
        ctx.lineTo(center.x, textY + 15);
        ctx.lineTo(center.x + 5, textY + 10);
        ctx.stroke();
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Player reached the door!
            this.onPlayerReached(other);
        }
    }

    onPlayerReached(player) {
        // Trigger win condition
        if (game) {
            game.playerWon();
        }
    }

    // Open door animation
    open() {
        this.isOpen = true;
        this.animationProgress = 0;
        // Create celebration particles
        for (let i = 0; i < 20; i++) {
            this.createParticle();
        }
    }

    // Check if player is near door
    isPlayerNear(player) {
        const center = this.getCenter();
        const playerCenter = player.getCenter();
        const distance = center.distanceTo(playerCenter);
        return distance < 100; // 100 pixel radius
    }

    // Get door info
    getInfo() {
        return {
            isOpen: this.isOpen,
            position: this.position.copy(),
            animationProgress: this.animationProgress
        };
    }

    // Static method to create door at top of level
    static createAtTop(canvasWidth, canvasHeight) {
        const x = canvasWidth / 2 - 24; // Center horizontally
        const y = 20; // Near top
        return new Door(x, y);
    }
}