# Draw & Escape

A creative drawing platformer where you draw your own path to freedom! Use limited ink to create platforms and reach the exit door at the top.

## Game Concept

You control a character starting at the bottom of the level with a simple goal: **reach the door at the top**. The twist? You have limited ink to draw platforms that help you navigate upward. Plan your route carefully!

# Draw & Escape - Platform Drawing Game

A creative drawing platformer where you draw your own platforms to navigate through challenging levels! Create your path with limited ink and escape to freedom.

🎮 **[Play the Game](https://your-username.github.io/Draw)** (GitHub Pages)

## Game Concept

You control a character with a simple goal: **reach the glowing door**. The twist? You have limited ink to draw platforms that help you navigate the level. Plan your route carefully and use your creativity to solve each challenge!

## Features

- **🖱️ Drawing Mechanics**: Click and drag to draw platforms with limited ink
- **📱 Mobile Support**: Touch controls for mobile devices  
- **🎮 Platformer Physics**: Jump, move, and interact with your drawn platforms
- **⚡ Ink Management**: Strategic resource management - every line costs ink
- **🚪 Progressive Levels**: 5 challenging levels with increasing difficulty
- **🔄 Death/Restart System**: Fall off the bottom to restart the level
- **✨ Visual Effects**: Particle systems and smooth animations

## How to Play

### Objective
Navigate through each level and reach the **glowing door** to advance.

### Controls

**Desktop:**
- **Mouse**: Click and drag to draw platforms (costs ink!)
- **WASD/Arrow Keys**: Move your character
- **Space/W/Up**: Jump
- **P**: Pause/unpause game
- **C**: Clear all drawn platforms
- **R**: Restart current level

**Mobile:**
- **Touch**: Drag on canvas to draw platforms
- **Virtual Buttons**: On-screen controls for movement and actions

### Strategy Tips
1. **Plan Your Route**: Look at the level layout before drawing
2. **Conserve Ink**: Draw efficiently - shorter platforms use less ink
3. **Use Physics**: Draw angled platforms to slide and save ink
4. **Death is Learning**: Fall off to restart and try a new approach

## Deployment to GitHub Pages

This project is perfect for GitHub Pages! Here's how to deploy:

### 1. Create GitHub Repository
```bash
# Initialize and add files
git add .
git commit -m "Initial commit: Draw & Escape game"

# Create repository on GitHub and connect
git remote add origin https://github.com/YOUR-USERNAME/Draw.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**

### 3. Access Your Game
Your game will be live at:
```
https://YOUR-USERNAME.github.io/Draw
```

**That's it!** No build process needed - it's pure HTML/CSS/JavaScript.

## Technical Features

### Architecture
- **Modular Design**: Clean separation of concerns
- **Entity System**: GameObject-based architecture
- **Physics Engine**: Custom 2D physics with collision detection
- **Mobile-First**: Responsive design with touch support
- **No Dependencies**: Pure vanilla JavaScript

### File Structure
```
├── index.html              # Main game file
├── package.json           # Development dependencies
├── src/
│   ├── core/              # Game engine
│   │   ├── Vector2.js     # 2D vector math
│   │   ├── GameObject.js  # Base entity class
│   │   ├── GameEngine.js  # Main game loop
│   │   ├── Input.js       # Input handling
│   │   ├── DrawingSystem.js # Platform drawing
│   │   └── LevelManager.js  # Level progression
│   ├── entities/          # Game objects
│   │   ├── Player.js      # Player character
│   │   ├── DrawnPlatform.js # User-drawn platforms
│   │   ├── Door.js        # Level exit
│   │   ├── Wall.js        # Obstacles
│   │   ├── Spike.js       # Deadly obstacles
│   │   └── MovingPlatform.js # Moving obstacles
│   ├── Game.js           # Game state management
│   └── main.js           # Game initialization
```

## Local Development

### Prerequisites
- Node.js (for development server)
- Modern web browser

### Setup
```bash
# Install development dependencies
npm install

# Start development server
npm start
# or
npx live-server --port=8080
```

Game runs at: `http://localhost:8080`

## Browser Compatibility

Works in all modern browsers with:
- HTML5 Canvas support
- ES6+ JavaScript features
- Touch events (mobile)
- Mouse events (desktop)

## Customization

Easy to extend:
- **New Levels**: Edit `src/core/LevelManager.js`
- **New Obstacles**: Create entities in `src/entities/`
- **Game Rules**: Modify `src/Game.js`
- **Physics**: Adjust values in `src/entities/Player.js`

## License

MIT License - feel free to modify and distribute!

---

**Ready to deploy?** Just commit your changes and push to GitHub Pages! 🚀

## How to Play

### Objective
Start at the bottom and reach the **glowing door at the top** of the level.

### Controls
- **🖱️ Mouse**: Click and drag to draw platforms (costs ink!)
- **WASD/Arrow Keys**: Move your character
- **Space/W/Up**: Jump
- **P**: Pause/unpause game
- **C**: Clear all drawn platforms (refunds some ink)
- **R**: Restart (when won or failed)

### Strategy Tips
1. **Plan Your Route**: Look at the door position before drawing
2. **Conserve Ink**: Draw efficiently - shorter platforms use less ink
3. **Use Gravity**: Draw diagonal platforms to slide and save ink
4. **Clear & Rebuild**: Use C to clear platforms and try a new approach
5. **Emergency Platforms**: Keep some ink for crucial jump assists

### Ink System
- **Green Bar**: Shows remaining ink
- **Drawing Cost**: Longer lines = more ink used
- **Ink Refund**: Clear platforms with C key to get some ink back
- **Color Changes**: Bar changes from green → orange → red as ink runs low

## Getting Started

### Prerequisites

- Node.js (for development server)
- A modern web browser with mouse/trackpad

### Installation

The project is ready to run! Dependencies are already installed.

### Running the Game

**The game is already running!** Open your browser and go to:
```
http://localhost:3000
```

Or start manually with:
```bash
npm start
```

## Game Architecture

The project uses a modular architecture perfect for extension:

```
├── index.html              # Game UI and canvas
├── package.json            # Project configuration  
├── src/
│   ├── core/               # Game engine
│   │   ├── Vector2.js      # 2D vector math
│   │   ├── GameObject.js   # Base game object class
│   │   ├── Input.js        # Keyboard input handling
│   │   ├── DrawingSystem.js # Mouse drawing mechanics
│   │   └── GameEngine.js   # Main game loop & rendering
│   ├── entities/           # Game objects
│   │   ├── Player.js       # Player with platformer physics
│   │   ├── DrawnPlatform.js # User-drawn platforms
│   │   └── Door.js         # Exit door with effects
│   ├── Game.js             # Game state management
│   └── main.js             # Initialization
```

## Technical Features

### Drawing System
- **Real-time Drawing**: Smooth line drawing with mouse/touch
- **Ink Consumption**: Calculated based on line length  
- **Path Simplification**: Optimizes drawn lines for better collision
- **Platform Generation**: Converts drawings into physics objects

### Physics System
- **Gravity**: Realistic falling and jumping
- **Platform Collision**: Precise line-to-rectangle collision detection
- **Ground Detection**: Smart ground checking for jumping
- **Bounce Physics**: Character interactions with angled platforms

### Visual Effects
- **Glowing Platforms**: Drawn lines have animated glow effects
- **Particle Systems**: Jump and landing particles
- **UI Feedback**: Visual ink bar with color coding
- **Door Animation**: Animated exit with floating particles

## Debug Commands

Open browser console and use:

```javascript
// Get game statistics
window.debugDraw.stats()

// Add ink
window.debugDraw.giveInk(50)

// Teleport near door
window.debugDraw.teleportToTop()

// Show help
window.debugDraw.help()

// Restart game
window.debugDraw.restart()

// Clear all platforms
window.debugDraw.clearPlatforms()
```

## Customization Ideas

The modular design makes it easy to add:

- **New Levels**: Different door positions and obstacles
- **Ink Powerups**: Items that restore ink
- **Platform Types**: Bouncy, moving, or disappearing platforms
- **Enemies**: Moving obstacles to avoid
- **Time Limits**: Racing against the clock
- **Multiplayer**: Race to reach the door first

## Browser Compatibility

Works in all modern browsers with:
- HTML5 Canvas support
- Mouse/touch events
- ES6+ JavaScript features

## Performance

- **60 FPS**: Smooth rendering with requestAnimationFrame
- **Efficient Collision**: Optimized line-rectangle collision detection
- **Memory Management**: Automatic cleanup of destroyed objects
- **Mobile Friendly**: Touch events supported for mobile devices

Enjoy creating your path to freedom! 🎮✨

## Game Mechanics

### Scoring System
- Health items: +20 health, 0 points
- Score items: +10 points
- Bonus items: +50 points
- Power items: +100 points

### Difficulty Progression
- Every 100 points = new level
- More enemies spawn as level increases
- Faster spawn rates at higher levels
- Bonus items appear when leveling up

### Enemy Behaviors
- **Wanderers**: Move randomly, change direction periodically
- **Chasers**: Detect and pursue the player within range
- **Patrols**: Follow set patterns and bounce off walls

## Customization

You can easily modify the game by editing the source files:

- **Player speed**: Modify `speed` property in `Player.js`
- **Enemy behaviors**: Add new AI patterns in `Enemy.js`
- **New collectible types**: Extend the `Collectible.js` class
- **Game balance**: Adjust spawn rates and values in `Game.js`

## Browser Compatibility

This game works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- RequestAnimationFrame

## License

MIT License - feel free to modify and distribute!

## Tips for Success

1. **Stay moving**: Stationary targets are easy prey
2. **Prioritize health**: Don't let your health get too low
3. **Watch enemy patterns**: Learn their behaviors to avoid them
4. **Collect strategically**: Sometimes it's better to skip risky items
5. **Use the walls**: Enemies bounce off walls, use this to your advantage

Enjoy the game!