class Input {
    constructor() {
        this.keys = {};
        this.keysDown = {};
        this.keysUp = {};
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            const key = event.code;
            if (!this.keys[key]) {
                this.keysDown[key] = true;
            }
            this.keys[key] = true;
            
            // Only prevent default for game keys, allow browser shortcuts
            const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyP', 'KeyR', 'KeyC', 'KeyN'];
            if (gameKeys.includes(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
            }
        });

        document.addEventListener('keyup', (event) => {
            const key = event.code;
            this.keys[key] = false;
            this.keysUp[key] = true;
            
            // Only prevent default for game keys
            const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyP', 'KeyR', 'KeyC', 'KeyN'];
            if (gameKeys.includes(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
            }
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    // Check if key is currently held down
    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    // Check if key was just pressed this frame
    isKeyDown(key) {
        return this.keysDown[key] || false;
    }

    // Check if key was just released this frame
    isKeyUp(key) {
        return this.keysUp[key] || false;
    }

    // Clear frame-specific input states
    update() {
        this.keysDown = {};
        this.keysUp = {};
    }

    // Movement helper methods
    getHorizontalAxis() {
        let horizontal = 0;
        if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) {
            horizontal -= 1;
        }
        if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) {
            horizontal += 1;
        }
        return horizontal;
    }

    getVerticalAxis() {
        let vertical = 0;
        if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) {
            vertical -= 1;
        }
        if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) {
            vertical += 1;
        }
        return vertical;
    }

    // Get movement vector
    getMovementVector() {
        return new Vector2(this.getHorizontalAxis(), this.getVerticalAxis());
    }

    // Check for action keys
    isActionPressed() {
        return this.isKeyPressed('Space') || this.isKeyPressed('Enter');
    }

    isActionDown() {
        return this.isKeyDown('Space') || this.isKeyDown('Enter');
    }

    // Check for escape key
    isEscapePressed() {
        return this.isKeyPressed('Escape');
    }

    isEscapeDown() {
        return this.isKeyDown('Escape');
    }
}