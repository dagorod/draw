// Initialize the drawing game when page loads
let game;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Draw & Escape Game...');
    
    // Check if Game class is available
    if (typeof Game === 'undefined') {
        console.error('Game class not found! Check if Game.js is loaded properly.');
        return;
    }
    
    // Check if canvas exists
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    console.log('Canvas found:', canvas);
    console.log('Game class found:', Game);
    
    // Create and start the game
    try {
        game = new Game();
        console.log('Game instance created:', game);
        game.start();
        console.log('Game started successfully');
    } catch (error) {
        console.error('Error creating or starting game:', error);
        return;
    }
    
    console.log('🎮 Draw & Escape started!');
    game.showHelp();
    
    // Debug commands for development
    if (typeof window !== 'undefined') {
        window.debugDraw = {
            stats: () => game.getStats(),
            giveInk: (amount) => game.giveInk(amount),
            teleportToTop: () => game.teleportToTop(),
            help: () => game.showHelp(),
            restart: () => game.restartGame(),
            clearPlatforms: () => game.clearDrawnPlatforms(),
            jumpToLevel: (level) => game.jumpToLevel(level),
            nextLevel: () => game.nextLevel()
        };
        console.log('Debug commands available in window.debugDraw');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Canvas resize logic could be added here if needed
});

// Handle page visibility change to pause game when tab is hidden
document.addEventListener('visibilitychange', function() {
    if (!game) return;
    
    if (document.hidden && game.gameState === 'playing') {
        game.togglePause();
        console.log('Game auto-paused (tab hidden)');
    }
});

// Prevent default behavior for game keys to avoid page scrolling
document.addEventListener('keydown', function(event) {
    // Allow browser shortcuts like F12 (dev tools), Ctrl+Shift+I, etc.
    const browserShortcuts = ['F12', 'F11', 'F5'];
    if (browserShortcuts.includes(event.code)) {
        return; // Don't prevent browser shortcuts
    }
    
    // Allow Ctrl/Cmd combinations (for dev tools, refresh, etc.)
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return; // Don't prevent modified key combinations
    }
    
    // Only prevent game keys when canvas has focus or when actively playing
    const gameKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    const canvas = document.getElementById('gameCanvas');
    
    if (gameKeys.includes(event.code) && (document.activeElement === canvas || document.activeElement === document.body)) {
        event.preventDefault();
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('Game Error:', event.error);
});

console.log('Draw & Escape initialization script loaded.');