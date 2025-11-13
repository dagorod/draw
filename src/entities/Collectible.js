class Collectible extends GameObject {
    constructor(x, y, itemType = 'score') {
        super(x, y, 16, 16);
        this.itemType = itemType;
        this.value = this.getValueForType(itemType);
        this.color = this.getColorForType(itemType);
        this.tag = 'collectible';
        this.solid = true;
        
        // Animation properties
        this.originalY = y;
        this.bobSpeed = 2;
        this.bobHeight = 3;
        this.time = Math.random() * Math.PI * 2; // Random start phase
        
        // Sparkle effect
        this.sparkles = [];
        this.lastSparkle = 0;
        this.sparkleInterval = 500; // milliseconds
    }

    getValueForType(itemType) {
        switch (itemType) {
            case 'health':
                return 20;
            case 'score':
                return 10;
            case 'bonus':
                return 50;
            case 'power':
                return 100;
            default:
                return 10;
        }
    }

    getColorForType(itemType) {
        switch (itemType) {
            case 'health':
                return '#00ff00'; // Green
            case 'score':
                return '#ffff00'; // Yellow
            case 'bonus':
                return '#ff8800'; // Orange
            case 'power':
                return '#8800ff'; // Purple
            default:
                return '#ffffff'; // White
        }
    }

    update(deltaTime) {
        // Floating animation
        this.time += this.bobSpeed * deltaTime;
        this.position.y = this.originalY + Math.sin(this.time) * this.bobHeight;

        // Generate sparkles
        this.updateSparkles(deltaTime);

        super.update(deltaTime);
    }

    updateSparkles(deltaTime) {
        const currentTime = performance.now();
        
        // Create new sparkles
        if (currentTime - this.lastSparkle > this.sparkleInterval) {
            this.createSparkle();
            this.lastSparkle = currentTime;
        }

        // Update existing sparkles
        this.sparkles = this.sparkles.filter(sparkle => {
            sparkle.life -= deltaTime;
            sparkle.y -= sparkle.speed * deltaTime;
            sparkle.alpha = sparkle.life / sparkle.maxLife;
            return sparkle.life > 0;
        });
    }

    createSparkle() {
        const sparkle = {
            x: this.position.x + Math.random() * this.width,
            y: this.position.y + Math.random() * this.height,
            speed: 20 + Math.random() * 30,
            life: 1.0,
            maxLife: 1.0,
            alpha: 1.0,
            size: 1 + Math.random() * 2
        };
        this.sparkles.push(sparkle);
    }

    render(ctx) {
        // Render sparkles first (behind the item)
        this.renderSparkles(ctx);

        // Render the collectible with glow effect
        this.renderWithGlow(ctx);

        // Render item type indicator
        this.renderTypeIndicator(ctx);
    }

    renderWithGlow(ctx) {
        const center = this.getCenter();
        
        // Glow effect
        const glowSize = this.width + 4;
        const gradient = ctx.createRadialGradient(
            center.x, center.y, 0,
            center.x, center.y, glowSize / 2
        );
        gradient.addColorStop(0, this.color + '80'); // Semi-transparent
        gradient.addColorStop(1, this.color + '00'); // Fully transparent
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            center.x - glowSize / 2,
            center.y - glowSize / 2,
            glowSize,
            glowSize
        );

        // Main item
        super.render(ctx);

        // Inner highlight
        ctx.fillStyle = '#ffffff80';
        ctx.fillRect(
            this.position.x + 2,
            this.position.y + 2,
            this.width - 4,
            this.height - 4
        );
    }

    renderSparkles(ctx) {
        ctx.fillStyle = '#ffffff';
        
        for (const sparkle of this.sparkles) {
            ctx.globalAlpha = sparkle.alpha;
            ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
        }
        
        ctx.globalAlpha = 1.0;
    }

    renderTypeIndicator(ctx) {
        const center = this.getCenter();
        ctx.fillStyle = '#000000';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        
        let symbol = '';
        switch (this.itemType) {
            case 'health':
                symbol = '+';
                break;
            case 'score':
                symbol = '$';
                break;
            case 'bonus':
                symbol = '★';
                break;
            case 'power':
                symbol = '⚡';
                break;
            default:
                symbol = '?';
                break;
        }
        
        ctx.fillText(symbol, center.x, center.y + 2);
        ctx.textAlign = 'left';
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Play collect effect
            this.playCollectEffect();
            // Collision is handled by player
        }
    }

    playCollectEffect() {
        // Create burst of sparkles
        for (let i = 0; i < 8; i++) {
            this.createSparkle();
        }
    }

    // Static methods for creating different types
    static createHealth(x, y) {
        return new Collectible(x, y, 'health');
    }

    static createScore(x, y) {
        return new Collectible(x, y, 'score');
    }

    static createBonus(x, y) {
        return new Collectible(x, y, 'bonus');
    }

    static createPower(x, y) {
        return new Collectible(x, y, 'power');
    }

    static createRandom(engine) {
        const types = ['health', 'score', 'bonus', 'power'];
        const weights = [0.4, 0.4, 0.15, 0.05]; // Health and score more common
        
        let randomValue = Math.random();
        let selectedType = 'score';
        
        for (let i = 0; i < types.length; i++) {
            randomValue -= weights[i];
            if (randomValue <= 0) {
                selectedType = types[i];
                break;
            }
        }

        const x = Math.random() * (engine.getWidth() - 16);
        const y = Math.random() * (engine.getHeight() - 16);
        
        return new Collectible(x, y, selectedType);
    }

    // Get item info
    getInfo() {
        return {
            type: this.itemType,
            value: this.value,
            position: this.position.copy()
        };
    }
}