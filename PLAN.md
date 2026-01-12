# Minecraft 3D Color-by-Number Game

## Project Overview

A 3D voxel-based color-by-number game with Minecraft theming. Players paint numbered blocks on 3D models, earn random rewards on completion, and spend currency on brushes and unlocks.

**Designer:** [Daughter's name] (Age 10)
**Core Loop:** Select model → Paint blocks → Complete → Earn rewards → Buy upgrades → Repeat

---

## Technical Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | React 18+ | Component-based, good for game state |
| 3D Engine | Three.js + @react-three/fiber | Best React integration for Three.js |
| 3D Helpers | @react-three/drei | OrbitControls, text, utilities |
| State | Zustand | Simple, persistent state without boilerplate |
| Persistence | localStorage | Save progress between sessions |
| Styling | Tailwind CSS | Fast iteration, utility classes |
| Build | Vite | Fast dev server, good defaults |

---

## Game Architecture

```
src/
├── components/
│   ├── game/
│   │   ├── GameCanvas.jsx      # Three.js canvas wrapper
│   │   ├── VoxelModel.jsx      # 3D model made of paintable cubes
│   │   ├── PaintableBlock.jsx  # Individual block with number + click handler
│   │   └── ColorPalette.jsx    # Numbered color swatches
│   ├── ui/
│   │   ├── HUD.jsx             # Coins, diamonds, current brush display
│   │   ├── Shop.jsx            # Purchase upgrades
│   │   ├── ModelSelect.jsx     # Choose which model to paint
│   │   ├── RewardModal.jsx     # Completion celebration + prize reveal
│   │   └── MainMenu.jsx        # Start screen
│   └── effects/
│       ├── Particles.jsx       # Celebration particles
│       └── BrushTrail.jsx      # Visual feedback when painting
├── data/
│   ├── models/                 # JSON model definitions
│   │   ├── sword.json
│   │   ├── pickaxe.json
│   │   ├── creeper.json
│   │   └── index.js            # Model registry
│   ├── colors.js               # Minecraft color palette
│   ├── shop-items.js           # Brush/upgrade definitions
│   └── rewards.js              # Loot tables
├── stores/
│   ├── gameStore.js            # Current game session state
│   └── playerStore.js          # Persistent player data (currency, unlocks)
├── hooks/
│   ├── usePainting.js          # Painting logic + brush effects
│   ├── useRewards.js           # Roll rewards on completion
│   └── useProgress.js          # Track completion percentage
├── utils/
│   ├── modelLoader.js          # Parse model JSON into voxel data
│   ├── saveLoad.js             # localStorage helpers
│   └── lootTable.js            # Weighted random reward selection
├── App.jsx
└── main.jsx
```

---

## Data Structures

### Model Definition (JSON)

```json
{
  "id": "sword",
  "name": "Diamond Sword",
  "difficulty": "easy",
  "size": { "x": 3, "y": 16, "z": 1 },
  "unlockCost": null,
  "blocks": [
    { "x": 1, "y": 0, "z": 0, "colorId": 4 },
    { "x": 1, "y": 1, "z": 0, "colorId": 4 },
    { "x": 1, "y": 2, "z": 0, "colorId": 3 },
    { "x": 0, "y": 3, "z": 0, "colorId": 1 }
  ]
}
```

### Color Palette

```javascript
export const MINECRAFT_COLORS = [
  { id: 1, name: "Oak Wood", hex: "#BA8C51", number: 1 },
  { id: 2, name: "Stone", hex: "#7F7F7F", number: 2 },
  { id: 3, name: "Diamond", hex: "#4AEDD9", number: 3 },
  { id: 4, name: "Iron", hex: "#D8D8D8", number: 4 },
  { id: 5, name: "Gold", hex: "#FCDB5B", number: 5 },
  { id: 6, name: "Emerald", hex: "#17DD62", number: 6 },
  { id: 7, name: "Redstone", hex: "#FF0000", number: 7 },
  { id: 8, name: "Lapis", hex: "#345EC3", number: 8 },
  { id: 9, name: "Obsidian", hex: "#1B1B2F", number: 9 },
  { id: 10, name: "Grass", hex: "#5D9B47", number: 10 },
  { id: 11, name: "Dirt", hex: "#8B5A2B", number: 11 },
  { id: 12, name: "Netherrack", hex: "#723232", number: 12 }
];
```

### Player State (Persisted)

```javascript
{
  coins: 0,
  diamonds: 0,
  xp: 0,
  level: 1,
  unlockedBrushes: ["basic"],
  unlockedModels: ["sword", "pickaxe"],
  completedModels: ["sword"],
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.8
  }
}
```

### Game Session State (Not Persisted)

```javascript
{
  currentModelId: "creeper",
  paintedBlocks: { "1,2,0": 3, "1,3,0": 3 }, // position: paintedColorId
  selectedColorId: 3,
  activeBrush: "basic",
  completionPercent: 45,
  mistakes: 2,
  startTime: 1699900000000
}
```

---

## Core Mechanics

### Painting System

1. Player selects a color from the numbered palette
2. Player clicks a block on the 3D model
3. If correct color → Block fills in, number disappears
4. If wrong color → Block flashes red, mistake counter increments
5. Brush effects modify this behavior (multi-fill, area fill, etc.)

### Completion Detection

```javascript
const checkCompletion = () => {
  const totalBlocks = model.blocks.length;
  const correctBlocks = Object.entries(paintedBlocks).filter(
    ([pos, colorId]) => {
      const block = getBlockAtPosition(pos);
      return block.colorId === colorId;
    }
  ).length;
  
  return correctBlocks === totalBlocks;
};
```

### Reward System

**Loot Table (per completion):**

| Reward | Weight | Amount |
|--------|--------|--------|
| Coins | 60 | 5-15 |
| Bonus Coins | 20 | 20-30 |
| Diamond | 15 | 1 |
| Rare Diamond | 4 | 3 |
| Jackpot | 1 | 5 diamonds + 50 coins |

**Modifiers:**
- No mistakes: 1.5x coin multiplier
- Hard difficulty: 2x base rewards
- Speed bonus: Complete under par time for +25% coins

---

## Shop Items

### Brushes

| Item | Cost | Effect | Description |
|------|------|--------|-------------|
| Basic Brush | Free | Paint one block | "Your trusty starter brush" |
| Multi-Fill | 50 coins | Paint all blocks of same number | "Why click 20 times when once will do?" |
| Area Brush | 75 coins | Paint 3x3 area (same color only) | "For those big flat sections" |
| X-Ray Brush | 100 coins | See through outer blocks | "Find those sneaky hidden blocks" |
| Golden Brush | 20 diamonds | Leaves sparkle trail (cosmetic) | "Fancy!" |
| Rainbow Brush | 35 diamonds | Animated color trail (cosmetic) | "Ooh, pretty!" |

### Utilities

| Item | Cost | Effect |
|------|------|--------|
| Undo (x3) | 10 coins | Fix 3 mistakes |
| Hint | 15 coins | Highlights one random unpainted block |
| Auto-Rotate | 30 coins | Model slowly spins |
| Color Blind Mode | Free | Adds symbols to colors |

### Model Packs

| Pack | Cost | Models Included |
|------|------|-----------------|
| Starter | Free | Sword, Pickaxe, Apple |
| Mobs | 5 diamonds | Creeper, Pig, Chicken, Zombie |
| Tools | 3 diamonds | Axe, Shovel, Hoe, Bow |
| Nether | 8 diamonds | Ghast, Piglin, Blaze, Portal |
| The End | 10 diamonds | Enderman, Ender Dragon, Shulker |
| Buildings | 8 diamonds | House, Tower, Chest, Furnace |

---

## Progression System

### XP and Levels

- Earn XP on every completion
- Easy model: 50 XP
- Medium model: 100 XP
- Hard model: 200 XP
- Perfect (no mistakes): +50% XP

**Level Thresholds:**
```javascript
const XP_PER_LEVEL = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  7500,   // Level 8
  12000,  // Level 9
  20000   // Level 10
];
```

**Level Rewards:**
- Level 2: Unlock "Mobs" pack
- Level 3: Unlock Multi-Fill brush for purchase
- Level 5: Free diamond
- Level 7: Unlock "Nether" pack
- Level 10: Golden frame for completed models

---

## UI/UX Specifications

### Main Menu
- Title with Minecraft-style font (use "Minecraftia" or similar)
- Animated 3D model rotating in background
- Buttons: Play, Shop, Collection, Settings

### Game Screen Layout
```
┌─────────────────────────────────────────────┐
│ [≡]     💰 125    💎 3    ⭐ Lvl 4     [?] │  <- HUD
├───────────────────────────────────┬─────────┤
│                                   │ COLORS  │
│                                   │ [1] ██  │
│       3D MODEL VIEWPORT           │ [2] ██  │
│       (rotatable)                 │ [3] ██  │
│                                   │ [4] ██  │
│                                   │ [5] ██  │
│                                   │ [6] ██  │
├───────────────────────────────────┴─────────┤
│  🖌️ Multi-Fill    Progress: ████░░ 67%     │  <- Bottom bar
└─────────────────────────────────────────────┘
```

### Reward Modal
- Appears on completion
- "Chest opening" animation
- Reveals rewards one by one with satisfying sounds
- Shows: Time taken, mistakes, coins earned, bonus multipliers

### Color Palette
- Vertical strip on right side
- Each swatch shows number prominently
- Selected color has glowing border
- Count of remaining blocks per color shown

---

## Phase 1: Minimum Viable Game

**Goal:** Playable core loop with one model

### Tasks:
1. [ ] Set up Vite + React + Three.js project
2. [ ] Create basic 3D canvas with OrbitControls
3. [ ] Build `PaintableBlock` component (cube with number texture)
4. [ ] Create sword model data (JSON)
5. [ ] Render model from JSON data
6. [ ] Implement color palette UI
7. [ ] Add click-to-paint with raycasting
8. [ ] Track painted blocks in state
9. [ ] Detect completion
10. [ ] Show basic "You win!" modal

**Deliverable:** Can paint a sword and see completion message

---

## Phase 2: Rewards and Persistence

**Goal:** Progression that saves

### Tasks:
1. [ ] Add Zustand stores (game + player)
2. [ ] Implement localStorage save/load
3. [ ] Create loot table system
4. [ ] Build reward modal with animation
5. [ ] Add coin/diamond display to HUD
6. [ ] Track XP and level
7. [ ] Show level-up celebration

**Deliverable:** Completing models earns currency that persists

---

## Phase 3: Shop and Upgrades

**Goal:** Spend currency on meaningful upgrades

### Tasks:
1. [ ] Create shop UI
2. [ ] Implement Multi-Fill brush
3. [ ] Implement Area Brush
4. [ ] Implement X-Ray mode
5. [ ] Add Undo functionality
6. [ ] Add Hint system
7. [ ] Create purchase flow with confirmation
8. [ ] Disable items player can't afford

**Deliverable:** Can buy and use multiple brush types

---

## Phase 4: Content and Polish

**Goal:** Multiple models, full game feel

### Tasks:
1. [ ] Create 5+ additional models (creeper, pig, pickaxe, etc.)
2. [ ] Implement model select screen
3. [ ] Add model packs and unlocking
4. [ ] Add difficulty ratings
5. [ ] Implement mistake tracking and scoring
6. [ ] Add sound effects
7. [ ] Add particle effects on completion
8. [ ] Add cosmetic brush trails
9. [ ] Implement speed bonus
10. [ ] Add settings menu

**Deliverable:** Full game with progression and variety

---

## Phase 5: Extra Features (Optional)

- [ ] Model creator/editor mode
- [ ] Share custom models (export/import JSON)
- [ ] Daily challenge model
- [ ] Achievement system
- [ ] Accessibility options (color blind mode)
- [ ] Mobile touch controls
- [ ] Background music

---

## Three.js Implementation Notes

### Raycasting for Click Detection

```jsx
import { useThree } from '@react-three/fiber';

const handleClick = (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const clickedBlock = intersects[0].object;
    paintBlock(clickedBlock.userData.position);
  }
};
```

### Number Display on Blocks

Options (in order of recommendation):
1. **drei's `<Text>` component** - 3D text floating above/on block
2. **Canvas texture** - Draw number on canvas, use as block texture
3. **Sprite** - Billboard that always faces camera

### Performance Considerations

- Use `instancedMesh` for unpainted blocks (same geometry)
- Switch to individual meshes only when painted (color change)
- Frustum culling is automatic in Three.js
- Keep models under 500 blocks for smooth performance

---

## Model Creation Guide

For creating new models (either manually or with daughter):

### Simple Approach
1. Draw pixel art of the model (front view)
2. Convert each pixel to a block with X, Y coordinates
3. Add Z depth where needed
4. Assign color IDs from the palette

### Tools That Can Help
- MagicaVoxel (free) - Export to JSON
- Minecraft structure blocks - Reference dimensions
- Graph paper - Sketch first

### Model JSON Template

```json
{
  "id": "new_model",
  "name": "Display Name",
  "difficulty": "easy|medium|hard",
  "size": { "x": 5, "y": 5, "z": 5 },
  "unlockCost": { "type": "diamonds", "amount": 5 },
  "parTime": 120,
  "blocks": []
}
```

---

## Claude Code Agents

Create these specialized agents for the project:

### 1. `threejs-agent.md`

```markdown
# Three.js 3D Agent

You are a Three.js and @react-three/fiber specialist.

## Your Responsibilities
- Implement all 3D rendering code
- Handle raycasting and click detection
- Optimize performance for voxel rendering
- Create visual effects (particles, trails)

## Key Libraries
- three
- @react-three/fiber
- @react-three/drei

## Patterns to Follow
- Use declarative R3F components, not imperative Three.js
- Prefer drei helpers over raw Three.js where available
- Use useFrame for animations, not requestAnimationFrame
- Keep meshes in a group for easier manipulation

## DO NOT
- Use Three.js classes directly when R3F equivalent exists
- Create render loops manually
- Forget to dispose of geometries/materials
```

### 2. `ui-agent.md`

```markdown
# UI/UX Agent

You are a React UI specialist for game interfaces.

## Your Responsibilities
- Build all 2D UI components (menus, HUD, modals)
- Implement animations and transitions
- Ensure responsive layout
- Handle user input

## Style Guide
- Minecraft aesthetic: blocky, pixel-art inspired
- Use Tailwind for layout
- Custom CSS for Minecraft-specific effects
- Font: Minecraftia or similar pixel font

## Patterns
- Modals use portal to body
- Animations via CSS transitions or Framer Motion
- All interactive elements need hover/active states
```

### 3. `game-logic-agent.md`

```markdown
# Game Logic Agent

You are responsible for game state and mechanics.

## Your Responsibilities
- Implement painting logic
- Handle completion detection
- Process rewards and loot tables
- Manage progression (XP, levels)
- Save/load player data

## State Management
- Use Zustand for global state
- Separate stores: playerStore (persistent), gameStore (session)
- localStorage for persistence

## Key Functions to Implement
- checkCorrectColor(blockPos, colorId)
- calculateRewards(difficulty, mistakes, time)
- applyBrushEffect(brush, targetBlock)
- checkLevelUp(currentXP)
```

---

## Recommended MCP Servers

### Essential

1. **Filesystem MCP** (built into Claude Code)
   - Read/write project files
   - Create model JSON files

2. **GitHub MCP**
   - Version control
   - Commit after each phase
   - Good for teaching source control

### Optional/Helpful

3. **Browser Preview MCP** (if available)
   - Live preview during development
   - Visual debugging

4. **Image Generation MCP** (if using DALL-E or similar)
   - Generate Minecraft-style icons for UI
   - Create texture references

### For Future Features

5. **Supabase MCP** (if adding online features later)
   - Cloud save
   - Leaderboards
   - Share custom models

---

## Development Commands

```bash
# Initial setup
npm create vite@latest minecraft-color-by-number -- --template react
cd minecraft-color-by-number
npm install three @react-three/fiber @react-three/drei zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development
npm run dev

# Build
npm run build
```

---

## Notes for Developer

- **Daughter is co-designer** - Ask for her input on colors, model ideas, reward values
- **Start simple** - Phase 1 should be achievable in one session
- **Test frequently** - Show progress after each component works
- **She may want to customize** - Keep magic numbers in config files
- **Celebrate wins** - Each phase completion is a milestone

---

## Questions to Ask Her During Development

1. What should the first model be? (sword recommended for simplicity)
2. What colors should be in the palette?
3. What should happen when you make a mistake?
4. What sound should play when you complete a model?
5. What's the most exciting prize to win?
6. What models do you want in each pack?
7. Should there be a "hard mode" option?

---

*Plan created: [Date]*
*Designer: [Daughter's name]*
*Developer: Dad + Claude Code*
