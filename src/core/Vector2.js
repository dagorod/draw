class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Add another vector to this one
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    // Subtract another vector from this one
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    // Multiply by a scalar
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Calculate magnitude (length) of vector
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize the vector (make length = 1)
    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }

    // Calculate distance to another vector
    distanceTo(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Create a copy of this vector
    copy() {
        return new Vector2(this.x, this.y);
    }

    // Set values
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    // Static methods for creating vectors
    static zero() {
        return new Vector2(0, 0);
    }

    static up() {
        return new Vector2(0, -1);
    }

    static down() {
        return new Vector2(0, 1);
    }

    static left() {
        return new Vector2(-1, 0);
    }

    static right() {
        return new Vector2(1, 0);
    }
}