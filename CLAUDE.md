# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 3D voxel-based color-by-number game with Minecraft theming. Players paint numbered blocks on 3D models to match colors, earn rewards on completion, and spend currency on brushes and unlocks. This is a father-daughter project where a 10-year-old is the game designer.

**Current Status:** Phase 3 complete (Shop system with brushes and utilities). See PLAN.md for full design specification.

## Tech Stack

- **Framework:** React 18+ with Vite
- **3D Engine:** Three.js via @react-three/fiber and @react-three/drei
- **State Management:** Zustand with localStorage persistence
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite

## Tailwind CSS v4 Configuration

This project uses Tailwind CSS v4, which requires specific setup different from v3:

**Required Configuration Files:**

1. `tailwind.config.js` - Defines content sources for class scanning:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. `src/index.css` - Must include `@source` directive:
```css
@import "tailwindcss";

@source "../src";

/* DO NOT add global resets like * { padding: 0; margin: 0; } */
/* They will override Tailwind utilities */
```

3. `postcss.config.js` - PostCSS configuration:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**Critical Issue - CSS Resets:**

Global CSS resets like `* { padding: 0; margin: 0; box-sizing: border-box; }` will override Tailwind utility classes, causing padding and margin utilities to not work. Tailwind's base layer provides its own normalization - don't add additional resets.

**Verification:**

To verify Tailwind is working correctly:
1. Open browser DevTools and inspect an element
2. Check computed styles - utilities like `px-4` should show actual pixel values (e.g., `padding-left: 16px`)
3. If computed styles show `padding: 0px` despite having `px-4` class, check for CSS reset conflicts

## Development Commands

```bash
# Initial setup (when starting implementation)
npm create vite@latest . -- --template react
npm install three @react-three/fiber @react-three/drei zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development
npm run dev

# Build
npm run build
```

## Production Deployment

**Live URL:** https://evies-minecraft-3d-pixel-9s20m6vld-jonegbdigital-projects.vercel.app

This project is deployed to Vercel with automatic deployments enabled via GitHub integration.

### Deployment Workflow

All deployments happen automatically through GitHub:

1. Make changes to the codebase locally
2. Commit changes: `git commit -m "Your commit message"`
3. Push to GitHub: `git push origin main`
4. Vercel automatically detects the push and deploys

**IMPORTANT:** Do NOT deploy from localhost. All production deployments must go through GitHub to maintain proper version control and deployment history.

### Vercel Project Configuration

- **Project Name:** evies-minecraft-3d-pixel-art
- **Framework:** Vite (auto-detected)
- **Production Branch:** main
- **GitHub Repository:** jon-egbdigital/EviesMinecraft3dPixelArt
- **Automatic Deployments:** Enabled for all pushes to main branch

### Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests (with unique URLs for testing)
- Non-main branches (when pushed to GitHub)

These preview deployments are perfect for testing changes before merging to production.

## Available MCP Servers

This project has access to the following MCP (Model Context Protocol) servers:

### Chrome DevTools MCP
**IMPORTANT:** Use the Chrome MCP to test functionality after each deployment.

After changes are deployed to Vercel:
1. Navigate to the production or preview URL in Chrome using the Chrome MCP
2. Take snapshots to verify UI layout and component rendering
3. Test interactive features (clicking blocks, selecting colors, painting)
4. Verify 3D model rendering and OrbitControls functionality
5. Test complete user flows (select model → paint → complete → rewards)
6. Check console for errors using `list_console_messages`
7. Monitor network requests if integrating external resources

For local testing, run `npm run dev` and test at http://localhost:5173

The Chrome MCP provides tools for:
- Page navigation and interaction (click, fill, hover)
- Taking screenshots and snapshots
- Evaluating JavaScript in the page context
- Inspecting console messages and network requests
- Testing responsive layouts

### GitHub MCP
Use for version control and collaboration:
- Create commits after completing each phase
- Push changes to trigger automatic Vercel deployments
- Create pull requests for major features (creates preview deployments)
- Manage issues for bug tracking and feature requests

Version control is especially important for a father-daughter project to track progress and celebrate milestones.

### Vercel MCP
Use for monitoring and managing deployments:
- View deployment status and build logs
- Check deployment URLs (production and previews)
- Monitor deployment errors
- Configure environment variables
- Set up custom domains

The project is configured for automatic deployments via GitHub - no manual deployment actions needed.

## Architecture

### Data Layer

**Model Definition Format** (JSON in root or future `src/data/models/`):
```json
{
  "id": "sword",
  "name": "Diamond Sword",
  "difficulty": "easy|medium|hard",
  "size": { "x": 3, "y": 15, "z": 1 },
  "unlockCost": null,
  "parTime": 60,
  "blocks": [
    { "x": 1, "y": 0, "z": 0, "colorId": 1 }
  ],
  "colorKey": { "1": "Oak Wood (Handle)" }
}
```

**Color Palette** (`colors.js` in root):
- 16 Minecraft-inspired colors with IDs, names, hex values, and display numbers
- Access via `getColorById(id)` or `getHexById(id)` helper functions
- Constants for unpainted blocks and error feedback colors

### State Management

**Two Zustand Stores:**

1. **playerStore** (persistent via localStorage):
   - Currency (coins, diamonds)
   - Progression (XP, level)
   - Unlocks (brushes, models, completed models)
   - Settings (volume, accessibility)

2. **gameStore** (session only):
   - Current model and painted blocks
   - Selected color and active brush
   - Session stats (mistakes, start time)
   - UI phase (menu, playing, complete, shop)

### Component Structure

When implementing, organize as:

```
src/
├── components/
│   ├── game/          # 3D rendering (Canvas, VoxelModel, PaintableBlock)
│   ├── ui/            # 2D overlays (HUD, Shop, ColorPalette, Modals)
│   └── effects/       # Visual effects (Particles, BrushTrail)
├── data/
│   ├── models/        # Model JSON files + registry
│   ├── colors.js      # Already exists in root
│   ├── shop-items.js  # Purchasable items
│   └── rewards.js     # Loot tables
├── stores/
│   ├── gameStore.js   # Session state
│   └── playerStore.js # Persistent player data
├── hooks/
│   ├── usePainting.js # Paint logic + brush effects
│   ├── useRewards.js  # Reward calculation
│   └── useProgress.js # Completion tracking
└── utils/
    ├── modelLoader.js # Parse JSON to voxel data
    ├── saveLoad.js    # localStorage helpers
    └── lootTable.js   # Weighted random selection
```

## Core Game Mechanics

### Painting System
1. Player selects numbered color from palette
2. Player clicks 3D block
3. If correct color → block fills, number disappears
4. If wrong → red flash, mistake counter increments
5. Different brushes modify behavior (multi-fill, area fill, etc.)

### Completion Detection
Track painted blocks as `{ "x,y,z": colorId }` map. Complete when all block positions match their required `colorId` from model definition.

### Reward System
On completion, roll from weighted loot table:
- 60% base coins (5-15)
- 20% bonus coins (20-30)
- 15% single diamond
- 4% triple diamonds
- 1% jackpot (5 diamonds + 50 coins)

**Multipliers:**
- Perfect (no mistakes): 1.5x coins
- Hard difficulty: 2x rewards
- XP: 50/100/200 for easy/medium/hard, +50% if perfect

## Three.js Implementation Patterns

### Use R3F Declarative Style
```jsx
// Correct approach
<mesh position={[x, y, z]} onClick={handleClick}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color={color} />
</mesh>
```

### Click Detection
Use R3F's built-in event system, not manual raycasting:
```jsx
<mesh onClick={(e) => {
  e.stopPropagation();
  onBlockClick(position);
}}>
```

### Block Number Display
Recommended: `@react-three/drei` Text component for 3D numbers on block faces.
Alternative: Canvas textures with drawn numbers.

### Camera and Lighting
```jsx
<Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
  <ambientLight intensity={0.6} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
  <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
```

## UI/UX Guidelines

### Minecraft Aesthetic
- Blocky shapes with sharp corners
- Pixel-art inspired fonts (Minecraftia or similar)
- Earth tones + gem accents (browns, grays, diamond/gold/emerald)
- Flat colors, minimal gradients

### Layout
```
┌─────────────────────────────────────────────┐
│ [≡]     💰 125    💎 3    ⭐ Lvl 4     [?] │  <- HUD
├───────────────────────────────────┬─────────┤
│                                   │ COLORS  │
│       3D MODEL VIEWPORT           │ [1] ██  │
│       (rotatable)                 │ [2] ██  │
│                                   │   ...   │
├───────────────────────────────────┴─────────┤
│  🖌️ Multi-Fill    Progress: ████░░ 67%     │
└─────────────────────────────────────────────┘
```

### Color Palette
- Vertical strip on right (desktop) or bottom (mobile)
- Show number prominently on each swatch
- Glowing border for selected color
- Badge showing remaining blocks per color

## Development Phases

Reference PLAN.md for detailed task lists. High-level phases:

1. **Phase 1 - MVP:** Render one model, click-to-paint, detect completion
2. **Phase 2 - Progression:** Rewards, currency, XP/levels, persistence
3. **Phase 3 - Shop:** Purchase and use multiple brush types
4. **Phase 4 - Content:** Multiple models, packs, polish, effects
5. **Phase 5 - Optional:** Model editor, sharing, daily challenges

## Specialized Agent Files

The `agents/` directory contains detailed specifications for three specialized domains:

- **threejs-agent.md:** All 3D rendering, raycasting, visual effects
- **ui-agent.md:** 2D overlays, menus, modals, Minecraft styling
- **game-logic-agent.md:** State management, painting logic, rewards, progression

Reference these when working in their respective areas.

## Key Implementation Notes

### Brush Effects
- **Basic:** Paint one block
- **Multi-Fill:** Paint all unpainted blocks matching the target colorId
- **Area:** Paint 3x3x3 cube of matching color blocks
- **X-Ray:** Render mode showing inner blocks (cosmetic)
- **Golden/Rainbow:** Particle trails (cosmetic)

### Performance Optimization
- Use `Instances` from drei for unpainted blocks (same appearance)
- Switch to individual meshes only when painted (color changes)
- Keep models under ~500 blocks for smooth performance
- Three.js frustum culling is automatic

### Loot Table System
Weighted random selection in `utils/lootTable.js`:
```javascript
rollLoot(table) // Returns one item based on weights
```

### XP and Leveling
Thresholds: `[0, 100, 250, 500, 1000, 2000, 4000, 7500, 12000, 20000]`
Level-up rewards unlock new packs and brushes.

## Working with the Designer

The 10-year-old co-designer should be consulted on:
- Model selection and ideas
- Color palette preferences
- Mistake feedback (harsh vs gentle)
- Reward balance (exciting vs frustrating)
- Sound/visual effect choices
- Model pack themes and contents

Keep magic numbers configurable so she can adjust game balance.

## Common Pitfalls

### Three.js
- Forgetting `e.stopPropagation()` causes click-through on stacked blocks
- Text/numbers may face wrong direction - use billboards or per-face text
- Manual raycasting not needed - R3F handles it via onClick

### State Management
- Don't store functions in Zustand (not serializable)
- Always use `set()`, never mutate state directly
- localStorage has ~5MB limit - keep saves lean

### Painting Logic
- Position key format must be consistent: `"x,y,z"`
- Check both "is block in model?" and "is color correct?"
- Different brushes need different target selection logic

## Testing Priorities

Before showing to designer:
- Model renders correctly in 3D space
- Clicking paints correct blocks
- Wrong color gives clear feedback
- Progress bar updates accurately
- Completion triggers reward modal
- Currency persists after refresh
- Shop purchases work and deduct correctly
