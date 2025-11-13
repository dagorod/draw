class Spike extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = '#ff4444';
        this.tag = 'spike';
        this.solid = true;
        this.dangerous = true;
        
        // Animation
        this.time = 0;
        this.pulseSpeed = 3;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.time += deltaTime;
    }

    render(ctx) {
        // Pulsing danger effect
        const pulse = 0.7 + 0.3 * Math.sin(this.time * this.pulseSpeed);
        
        // Base
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.position.x, this.position.y + this.height - 5, this.width, 5);
        
        // Spikes
        ctx.fillStyle = this.color;
        ctx.globalAlpha = pulse;
        
        const spikeWidth = 20;
        const spikeCount = Math.floor(this.width / spikeWidth);
        
        for (let i = 0; i < spikeCount; i++) {
            const x = this.position.x + i * spikeWidth;
            const y = this.position.y + this.height - 5;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + spikeWidth / 2, this.position.y);
            ctx.lineTo(x + spikeWidth, y);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.globalAlpha = 1.0;
        
        // Danger outline
        ctx.strokeStyle = '#ff8888';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Player touched spikes - respawn them
            other.respawn();
            this.createDangerParticles();
        }
    }

    createDangerParticles() {
        // Could add particle effects here
        console.log('💀 Ouch! You touched the spikes!');
    }
}