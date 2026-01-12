# Minecraft 3D Pixel Art

A 3D voxel-based color-by-number game with Minecraft theming. Players paint numbered blocks on 3D models to match colors, earn rewards on completion, and spend currency on brushes and unlocks.

## 🎮 About

This is a father-daughter project where a 10-year-old is the game designer. The game combines the satisfaction of color-by-number puzzles with 3D Minecraft-style voxel art.

## ✨ Features (Planned)

- **3D Color-by-Number:** Paint numbered voxel blocks in 3D space
- **Multiple Models:** Minecraft-themed objects like swords, pickaxes, characters
- **Progression System:** Earn coins, diamonds, XP, and level up
- **Brush Shop:** Unlock special brushes with unique painting abilities
- **Reward System:** Loot table with coins, diamonds, and jackpot rewards
- **Model Packs:** Unlock themed collections as you progress

## 🛠️ Tech Stack

- **Framework:** React 18+ with Vite
- **3D Engine:** Three.js via @react-three/fiber and @react-three/drei
- **State Management:** Zustand with localStorage persistence
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

## 📋 Current Status

**Planning Phase** - No implementation yet. See [PLAN.md](PLAN.md) for full design specification.

## 🚀 Getting Started (Once Implemented)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
├── PLAN.md              # Full game design specification
├── CLAUDE.md            # Development guidelines for Claude Code
├── agents/              # Specialized agent documentation
├── colors.js            # Minecraft-inspired color palette
├── sword.json           # Example model data
└── src/                 # Source code (to be created)
    ├── components/      # React components
    ├── stores/          # Zustand state management
    ├── data/            # Game data and models
    ├── hooks/           # Custom React hooks
    └── utils/           # Utility functions
```

## 🎨 Color Palette

The game uses a 16-color Minecraft-inspired palette with colors like:
- Oak Wood, Stone Gray, Grass Green
- Diamond Blue, Gold, Emerald Green
- Redstone Red, Lapis Blue
- And more!

See `colors.js` for the complete palette.

## 📖 Documentation

- **[PLAN.md](PLAN.md)** - Complete game design and implementation plan
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines and architecture
- **[agents/](agents/)** - Specialized documentation for Three.js, UI, and game logic

## 🎯 Development Phases

1. **Phase 1 - MVP:** Core 3D rendering and painting mechanics
2. **Phase 2 - Progression:** Rewards, currency, XP system
3. **Phase 3 - Shop:** Brush purchasing and effects
4. **Phase 4 - Content:** Multiple models and polish
5. **Phase 5 - Optional:** Model editor and advanced features

## 👨‍👧 Credits

- **Game Designer:** A creative 10-year-old Minecraft enthusiast
- **Developer:** Built with guidance from Claude Code

## 📄 License

This project is currently unlicensed. All rights reserved.
