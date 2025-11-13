# JavaScript Game Project

This is a 2D JavaScript game built with HTML5 Canvas featuring:

## Project Structure
- **Core Engine**: Modular game engine with Vector2 math, GameObject base class, Input handling, and main GameEngine
- **Entities**: Player character, AI-driven enemies with multiple behaviors, animated collectibles with effects
- **Game Features**: Progressive difficulty, collision detection, particle effects, scoring system

## Development
- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Development Server**: live-server for hot reloading
- **Architecture**: Object-oriented with inheritance and composition patterns

## Game Mechanics
- Player movement with WASD/Arrow keys
- Enemy AI with wandering, chasing, and patrol behaviors
- Collectible items with different values and effects
- Health system with visual feedback
- Level progression based on score

## Controls
- Movement: WASD or Arrow Keys
- Pause: P key
- Restart: R key (when game over)

The game is designed to be easily extensible - new enemy types, collectibles, and mechanics can be added by extending the existing classes.