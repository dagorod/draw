class Wall extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = '#666666';
        this.tag = 'wall';
        this.solid = true;
    }

    render(ctx) {
        // Main wall
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Brick pattern
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        
        const brickHeight = 20;
        const brickWidth = 40;
        
        for (let y = 0; y < this.height; y += brickHeight) {
            for (let x = 0; x < this.width; x += brickWidth) {
                const offsetX = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
                ctx.strokeRect(
                    this.position.x + x + offsetX, 
                    this.position.y + y, 
                    brickWidth, 
                    brickHeight
                );
            }
        }
        
        // Shadow effect
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.position.x + this.width, this.position.y + 2, 3, this.height);
        ctx.fillRect(this.position.x + 2, this.position.y + this.height, this.width, 3);
    }

    onCollision(other) {
        if (other.tag === 'player') {
            // Push player away from wall
            this.pushPlayerAway(other);
        }
    }

    pushPlayerAway(player) {
        const playerBounds = player.getBounds();
        const wallBounds = this.getBounds();
        
        // Calculate overlap
        const overlapLeft = playerBounds.right - wallBounds.left;
        const overlapRight = wallBounds.right - playerBounds.left;
        const overlapTop = playerBounds.bottom - wallBounds.top;
        const overlapBottom = wallBounds.bottom - playerBounds.top;
        
        // Find minimum overlap direction
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft) {
            player.position.x = wallBounds.left - player.width;
            player.velocity.x = 0;
        } else if (minOverlap === overlapRight) {
            player.position.x = wallBounds.right;
            player.velocity.x = 0;
        } else if (minOverlap === overlapTop) {
            player.position.y = wallBounds.top - player.height;
            player.velocity.y = 0;
            player.isOnGround = true;
        } else if (minOverlap === overlapBottom) {
            player.position.y = wallBounds.bottom;
            player.velocity.y = 0;
        }
    }
}