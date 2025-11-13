class GameObject {
    constructor(x = 0, y = 0, width = 32, height = 32) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.width = width;
        this.height = height;
        this.color = '#ffffff';
        this.active = true;
        this.solid = false;
        this.tag = '';
    }

    // Update the game object (override in subclasses)
    update(deltaTime) {
        // Apply velocity to position
        this.position.add(new Vector2(this.velocity.x * deltaTime, this.velocity.y * deltaTime));
    }

    // Render the game object (override in subclasses)
    render(ctx) {
        if (!this.active) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Get the bounding box for collision detection
    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.width,
            top: this.position.y,
            bottom: this.position.y + this.height,
            centerX: this.position.x + this.width / 2,
            centerY: this.position.y + this.height / 2
        };
    }

    // Check collision with another game object
    collidesWith(other) {
        if (!this.active || !other.active) return false;

        const thisBounds = this.getBounds();
        const otherBounds = other.getBounds();

        return thisBounds.left < otherBounds.right &&
               thisBounds.right > otherBounds.left &&
               thisBounds.top < otherBounds.bottom &&
               thisBounds.bottom > otherBounds.top;
    }

    // Get center position
    getCenter() {
        return new Vector2(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
    }

    // Set center position
    setCenter(x, y) {
        this.position.x = x - this.width / 2;
        this.position.y = y - this.height / 2;
    }

    // Destroy the object
    destroy() {
        this.active = false;
    }

    // Called when object collides with another
    onCollision(other) {
        // Override in subclasses
    }

    // Keep object within bounds
    constrainToBounds(minX, minY, maxX, maxY) {
        if (this.position.x < minX) this.position.x = minX;
        if (this.position.y < minY) this.position.y = minY;
        if (this.position.x + this.width > maxX) this.position.x = maxX - this.width;
        if (this.position.y + this.height > maxY) this.position.y = maxY - this.height;
    }
}