class DrawnPlatform extends GameObject {
    constructor(startPos, endPos) {
        // Calculate bounding box
        const minX = Math.min(startPos.x, endPos.x);
        const minY = Math.min(startPos.y, endPos.y);
        const maxX = Math.max(startPos.x, endPos.x);
        const maxY = Math.max(startPos.y, endPos.y);
        
        super(minX, minY, maxX - minX || 4, maxY - minY || 4);
        
        this.startPos = startPos.copy();
        this.endPos = endPos.copy();
        this.thickness = 4;
        this.color = '#00ff88';
        this.tag = 'platform';
        this.solid = true;
        
        // Platform properties
        this.length = startPos.distanceTo(endPos);
        this.angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
        
        // Visual effects
        this.glowIntensity = 1.0;
        this.createdTime = performance.now();
        this.fadeInDuration = 300; // ms
        
        // Adjust bounding box for line collision
        this.adjustBoundingBox();
    }

    adjustBoundingBox() {
        // Expand bounding box to account for line thickness
        const halfThickness = this.thickness / 2;
        this.position.x -= halfThickness;
        this.position.y -= halfThickness;
        this.width += this.thickness;
        this.height += this.thickness;
        
        // Ensure minimum size for collision detection
        if (this.width < this.thickness) this.width = this.thickness;
        if (this.height < this.thickness) this.height = this.thickness;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Fade in effect
        const elapsed = performance.now() - this.createdTime;
        if (elapsed < this.fadeInDuration) {
            this.glowIntensity = elapsed / this.fadeInDuration;
        }
    }

    render(ctx) {
        const alpha = Math.min(1.0, this.glowIntensity);
        
        // Draw glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8 * alpha;
        
        // Draw the platform line
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.startPos.x, this.startPos.y);
        ctx.lineTo(this.endPos.x, this.endPos.y);
        ctx.stroke();
        
        // Reset effects
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
        
        // Draw collision box in debug mode
        if (window.debugMode) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    // Enhanced collision detection for line segments
    collidesWith(other) {
        if (!this.active || !other.active) return false;
        
        // First check bounding box collision
        if (!super.collidesWith(other)) return false;
        
        // Then check precise line collision
        return this.lineIntersectsRect(other.getBounds());
    }

    lineIntersectsRect(rect) {
        // Check if line segment intersects with rectangle
        const x1 = this.startPos.x;
        const y1 = this.startPos.y;
        const x2 = this.endPos.x;
        const y2 = this.endPos.y;
        
        // Check if either endpoint is inside the rectangle
        if (this.pointInRect(x1, y1, rect) || this.pointInRect(x2, y2, rect)) {
            return true;
        }
        
        // Check if line intersects any edge of the rectangle
        return (
            this.lineIntersectsLine(x1, y1, x2, y2, rect.left, rect.top, rect.right, rect.top) ||     // top edge
            this.lineIntersectsLine(x1, y1, x2, y2, rect.right, rect.top, rect.right, rect.bottom) ||  // right edge
            this.lineIntersectsLine(x1, y1, x2, y2, rect.right, rect.bottom, rect.left, rect.bottom) || // bottom edge
            this.lineIntersectsLine(x1, y1, x2, y2, rect.left, rect.bottom, rect.left, rect.top)       // left edge
        );
    }

    pointInRect(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) return false; // Parallel lines
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    // Get the closest point on the platform to another point
    getClosestPoint(point) {
        const A = this.startPos;
        const B = this.endPos;
        const P = point;
        
        // Handle very small platforms (dots) - just return the center
        const platformLength = A.distanceTo(B);
        if (platformLength < 2) { // If platform is very small
            return new Vector2((A.x + B.x) / 2, (A.y + B.y) / 2);
        }
        
        const AP = new Vector2(P.x - A.x, P.y - A.y);
        const AB = new Vector2(B.x - A.x, B.y - A.y);
        
        const ab2 = AB.x * AB.x + AB.y * AB.y;
        
        // Avoid division by zero
        if (ab2 === 0) {
            return A.copy(); // Return start point if no length
        }
        
        const ap_ab = AP.x * AB.x + AP.y * AB.y;
        
        let t = ap_ab / ab2;
        t = Math.max(0, Math.min(1, t)); // Clamp to line segment
        
        return new Vector2(A.x + AB.x * t, A.y + AB.y * t);
    }

    // Check if platform can support the player (for jumping/landing)
    canSupport(player) {
        const playerBottom = player.position.y + player.height;
        const platformTop = Math.min(this.startPos.y, this.endPos.y);
        
        // Player must be above or at the same level as platform
        return playerBottom <= platformTop + this.thickness;
    }

    // Get platform normal for physics calculations
    getNormal() {
        const direction = new Vector2(
            this.endPos.x - this.startPos.x,
            this.endPos.y - this.startPos.y
        ).normalize();
        
        // Return perpendicular normal (rotated 90 degrees)
        return new Vector2(-direction.y, direction.x);
    }

    // Platform info for debugging
    getInfo() {
        return {
            start: this.startPos,
            end: this.endPos,
            length: this.length,
            angle: this.angle * 180 / Math.PI, // Convert to degrees
            thickness: this.thickness
        };
    }

    // Static method to create platform from two points
    static create(x1, y1, x2, y2) {
        return new DrawnPlatform(new Vector2(x1, y1), new Vector2(x2, y2));
    }
}