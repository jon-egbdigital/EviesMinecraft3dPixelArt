# Game Logic Agent

You are responsible for all game state, mechanics, and progression in a Minecraft-themed 3D color-by-number game.

## Project Context

Reference `/PLAN.md` for full project details. You handle the logic layer - what happens when a player paints, how rewards work, what gets saved.

## Your Responsibilities

- Implement painting logic and validation
- Handle completion detection
- Process rewards and loot tables
- Manage progression (XP, levels, unlocks)
- Save/load player data to localStorage
- Implement brush effects

## Core Files You Own

- `stores/playerStore.js` - Persistent player state (Zustand)
- `stores/gameStore.js` - Current session state (Zustand)
- `hooks/usePainting.js` - Paint logic + brush effects
- `hooks/useRewards.js` - Roll and apply rewards
- `hooks/useProgress.js` - Track completion percentage
- `utils/lootTable.js` - Weighted random selection
- `utils/saveLoad.js` - localStorage helpers
- `data/rewards.js` - Reward definitions
- `data/shop-items.js` - Purchasable items

## State Management with Zustand

### Player Store (Persistent)

```javascript
// stores/playerStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Currency
      coins: 0,
      diamonds: 0,
      
      // Progression
      xp: 0,
      level: 1,
      
      // Unlocks
      unlockedBrushes: ['basic'],
      unlockedModels: ['sword', 'pickaxe', 'apple'],
      completedModels: [],
      
      // Settings
      settings: {
        musicVolume: 0.5,
        sfxVolume: 0.8,
        colorBlindMode: false,
      },
      
      // Actions
      addCoins: (amount) => set((state) => ({ 
        coins: state.coins + amount 
      })),
      
      addDiamonds: (amount) => set((state) => ({ 
        diamonds: state.diamonds + amount 
      })),
      
      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const newLevel = calculateLevel(newXP);
        
        set({ xp: newXP, level: newLevel });
        
        // Return true if leveled up
        return newLevel > state.level;
      },
      
      spendCoins: (amount) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },
      
      spendDiamonds: (amount) => {
        const state = get();
        if (state.diamonds >= amount) {
          set({ diamonds: state.diamonds - amount });
          return true;
        }
        return false;
      },
      
      unlockBrush: (brushId) => set((state) => ({
        unlockedBrushes: [...state.unlockedBrushes, brushId]
      })),
      
      unlockModel: (modelId) => set((state) => ({
        unlockedModels: [...state.unlockedModels, modelId]
      })),
      
      completeModel: (modelId) => set((state) => ({
        completedModels: state.completedModels.includes(modelId)
          ? state.completedModels
          : [...state.completedModels, modelId]
      })),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // Reset (for testing)
      resetProgress: () => set({
        coins: 0,
        diamonds: 0,
        xp: 0,
        level: 1,
        unlockedBrushes: ['basic'],
        unlockedModels: ['sword', 'pickaxe', 'apple'],
        completedModels: [],
      }),
    }),
    {
      name: 'mc-coloring-player',
    }
  )
);

// XP thresholds for each level
const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 7500, 12000, 20000];

function calculateLevel(xp) {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}
```

### Game Store (Session)

```javascript
// stores/gameStore.js
import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Current game state
  currentModelId: null,
  paintedBlocks: {}, // { "x,y,z": colorId }
  selectedColorId: null,
  activeBrush: 'basic',
  
  // Stats for current session
  mistakes: 0,
  startTime: null,
  
  // UI state
  gamePhase: 'menu', // 'menu' | 'playing' | 'complete' | 'shop'
  
  // Actions
  startGame: (modelId) => set({
    currentModelId: modelId,
    paintedBlocks: {},
    selectedColorId: null,
    mistakes: 0,
    startTime: Date.now(),
    gamePhase: 'playing',
  }),
  
  selectColor: (colorId) => set({ selectedColorId: colorId }),
  
  setBrush: (brushId) => set({ activeBrush: brushId }),
  
  paintBlock: (position, colorId) => set((state) => ({
    paintedBlocks: {
      ...state.paintedBlocks,
      [position]: colorId,
    }
  })),
  
  unpaintBlock: (position) => set((state) => {
    const newPainted = { ...state.paintedBlocks };
    delete newPainted[position];
    return { paintedBlocks: newPainted };
  }),
  
  addMistake: () => set((state) => ({ 
    mistakes: state.mistakes + 1 
  })),
  
  completeGame: () => set({ gamePhase: 'complete' }),
  
  returnToMenu: () => set({
    gamePhase: 'menu',
    currentModelId: null,
    paintedBlocks: {},
  }),
  
  openShop: () => set({ gamePhase: 'shop' }),
}));
```

## Painting Logic

```javascript
// hooks/usePainting.js
import { useGameStore } from '../stores/gameStore';
import { usePlayerStore } from '../stores/playerStore';

export function usePainting(model) {
  const { 
    paintedBlocks, 
    selectedColorId, 
    activeBrush,
    paintBlock,
    addMistake 
  } = useGameStore();
  
  const { unlockedBrushes } = usePlayerStore();
  
  const handleBlockClick = (blockPosition) => {
    if (!selectedColorId) return;
    
    const posKey = `${blockPosition.x},${blockPosition.y},${blockPosition.z}`;
    const targetBlock = model.blocks.find(
      b => b.x === blockPosition.x && 
           b.y === blockPosition.y && 
           b.z === blockPosition.z
    );
    
    if (!targetBlock) return;
    
    // Check if correct color
    const isCorrect = targetBlock.colorId === selectedColorId;
    
    if (!isCorrect) {
      addMistake();
      return { success: false, position: posKey };
    }
    
    // Apply brush effect
    const blocksToPaint = getBrushTargets(
      activeBrush, 
      blockPosition, 
      selectedColorId, 
      model
    );
    
    blocksToPaint.forEach(pos => {
      paintBlock(pos, selectedColorId);
    });
    
    return { success: true, positions: blocksToPaint };
  };
  
  return { handleBlockClick };
}

function getBrushTargets(brush, position, colorId, model) {
  const posKey = `${position.x},${position.y},${position.z}`;
  
  switch (brush) {
    case 'basic':
      return [posKey];
      
    case 'multi-fill':
      // Paint all blocks with same target color
      return model.blocks
        .filter(b => b.colorId === colorId)
        .map(b => `${b.x},${b.y},${b.z}`);
      
    case 'area':
      // Paint 3x3 area of same color
      const targets = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const checkPos = {
              x: position.x + dx,
              y: position.y + dy,
              z: position.z + dz
            };
            const block = model.blocks.find(
              b => b.x === checkPos.x && 
                   b.y === checkPos.y && 
                   b.z === checkPos.z &&
                   b.colorId === colorId
            );
            if (block) {
              targets.push(`${checkPos.x},${checkPos.y},${checkPos.z}`);
            }
          }
        }
      }
      return targets;
      
    default:
      return [posKey];
  }
}
```

## Completion Detection

```javascript
// hooks/useProgress.js
import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';

export function useProgress(model) {
  const { paintedBlocks } = useGameStore();
  
  const progress = useMemo(() => {
    if (!model) return { percent: 0, complete: false, correct: 0, total: 0 };
    
    const total = model.blocks.length;
    let correct = 0;
    
    model.blocks.forEach(block => {
      const posKey = `${block.x},${block.y},${block.z}`;
      const paintedColor = paintedBlocks[posKey];
      
      if (paintedColor === block.colorId) {
        correct++;
      }
    });
    
    return {
      percent: Math.round((correct / total) * 100),
      complete: correct === total,
      correct,
      total,
    };
  }, [model, paintedBlocks]);
  
  return progress;
}
```

## Reward System

```javascript
// utils/lootTable.js
export function rollLoot(table) {
  const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const item of table) {
    roll -= item.weight;
    if (roll <= 0) {
      // Calculate amount if range given
      const amount = item.amountRange
        ? randomInRange(item.amountRange[0], item.amountRange[1])
        : item.amount;
      
      return { ...item, amount };
    }
  }
  
  return table[0]; // Fallback
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// data/rewards.js
export const COMPLETION_LOOT_TABLE = [
  { id: 'coins', name: 'Coins', icon: '💰', weight: 60, amountRange: [5, 15] },
  { id: 'bonus-coins', name: 'Bonus Coins', icon: '💰', weight: 20, amountRange: [20, 30] },
  { id: 'diamond', name: 'Diamond', icon: '💎', weight: 15, amount: 1 },
  { id: 'rare-diamond', name: 'Rare Diamonds', icon: '💎', weight: 4, amount: 3 },
  { id: 'jackpot', name: 'JACKPOT!', icon: '🎉', weight: 1, special: true },
];

// hooks/useRewards.js
import { rollLoot, COMPLETION_LOOT_TABLE } from '../utils/lootTable';
import { usePlayerStore } from '../stores/playerStore';

export function useRewards() {
  const { addCoins, addDiamonds, addXP, completeModel } = usePlayerStore();
  
  const processCompletion = (modelId, difficulty, mistakes, timeMs) => {
    const rewards = [];
    
    // Roll main reward
    const mainReward = rollLoot(COMPLETION_LOOT_TABLE);
    
    // Calculate multipliers
    let coinMultiplier = 1;
    if (mistakes === 0) coinMultiplier *= 1.5; // Perfect bonus
    if (difficulty === 'hard') coinMultiplier *= 2; // Difficulty bonus
    
    // Process reward
    if (mainReward.id === 'jackpot') {
      rewards.push({ type: 'diamonds', amount: 5, icon: '💎', name: 'Jackpot Diamonds!' });
      rewards.push({ type: 'coins', amount: 50, icon: '💰', name: 'Jackpot Coins!' });
      addDiamonds(5);
      addCoins(50);
    } else if (mainReward.id.includes('diamond')) {
      rewards.push({ type: 'diamonds', amount: mainReward.amount, icon: '💎', name: mainReward.name });
      addDiamonds(mainReward.amount);
    } else {
      const finalCoins = Math.round(mainReward.amount * coinMultiplier);
      rewards.push({ type: 'coins', amount: finalCoins, icon: '💰', name: mainReward.name });
      addCoins(finalCoins);
    }
    
    // XP reward
    const baseXP = { easy: 50, medium: 100, hard: 200 }[difficulty] || 50;
    const xpBonus = mistakes === 0 ? 1.5 : 1;
    const totalXP = Math.round(baseXP * xpBonus);
    
    rewards.push({ type: 'xp', amount: totalXP, icon: '⭐', name: 'Experience' });
    const leveledUp = addXP(totalXP);
    
    // Mark model complete
    completeModel(modelId);
    
    return { rewards, leveledUp };
  };
  
  return { processCompletion };
}
```

## Shop System

```javascript
// data/shop-items.js
export const SHOP_ITEMS = {
  brushes: [
    {
      id: 'multi-fill',
      name: 'Multi-Fill Brush',
      description: 'Paint all blocks of the same number at once',
      cost: { type: 'coins', amount: 50 },
      unlockLevel: 1,
    },
    {
      id: 'area',
      name: 'Area Brush',
      description: 'Paint a 3x3 area of same-colored blocks',
      cost: { type: 'coins', amount: 75 },
      unlockLevel: 2,
    },
    {
      id: 'xray',
      name: 'X-Ray Brush',
      description: 'See through blocks to find hidden ones',
      cost: { type: 'coins', amount: 100 },
      unlockLevel: 3,
    },
    {
      id: 'golden',
      name: 'Golden Brush',
      description: 'Leaves a sparkle trail (cosmetic)',
      cost: { type: 'diamonds', amount: 20 },
      unlockLevel: 1,
    },
  ],
  
  utilities: [
    {
      id: 'undo-pack',
      name: 'Undo Pack (x3)',
      description: 'Fix 3 mistakes',
      cost: { type: 'coins', amount: 10 },
      consumable: true,
    },
    {
      id: 'hint',
      name: 'Hint',
      description: 'Highlights one random unpainted block',
      cost: { type: 'coins', amount: 15 },
      consumable: true,
    },
  ],
  
  modelPacks: [
    {
      id: 'mobs-pack',
      name: 'Mobs Pack',
      description: 'Creeper, Pig, Chicken, Zombie',
      cost: { type: 'diamonds', amount: 5 },
      models: ['creeper', 'pig', 'chicken', 'zombie'],
    },
    {
      id: 'nether-pack',
      name: 'Nether Pack',
      description: 'Ghast, Piglin, Blaze, Portal',
      cost: { type: 'diamonds', amount: 8 },
      models: ['ghast', 'piglin', 'blaze', 'portal'],
    },
  ],
};

// hooks/useShop.js
import { usePlayerStore } from '../stores/playerStore';
import { SHOP_ITEMS } from '../data/shop-items';

export function useShop() {
  const { 
    coins, diamonds, level,
    unlockedBrushes, 
    spendCoins, spendDiamonds,
    unlockBrush, unlockModel 
  } = usePlayerStore();
  
  const canAfford = (item) => {
    if (item.cost.type === 'coins') return coins >= item.cost.amount;
    if (item.cost.type === 'diamonds') return diamonds >= item.cost.amount;
    return false;
  };
  
  const isUnlocked = (item) => {
    if (item.unlockLevel && level < item.unlockLevel) return false;
    return true;
  };
  
  const purchase = (item) => {
    if (!canAfford(item) || !isUnlocked(item)) return false;
    
    // Spend currency
    const spent = item.cost.type === 'coins'
      ? spendCoins(item.cost.amount)
      : spendDiamonds(item.cost.amount);
    
    if (!spent) return false;
    
    // Apply purchase
    if (SHOP_ITEMS.brushes.includes(item)) {
      unlockBrush(item.id);
    } else if (item.models) {
      item.models.forEach(modelId => unlockModel(modelId));
    }
    
    return true;
  };
  
  return { canAfford, isUnlocked, purchase };
}
```

## DO NOT

- Store functions in Zustand state (not serializable)
- Forget to handle edge cases (empty model, no color selected)
- Use Math.random() without seeding for things that need reproducibility
- Mutate state directly (always use set())
- Forget localStorage has size limits (~5MB)

## Testing Checklist

- [ ] Painting correct color fills block
- [ ] Painting wrong color increments mistakes
- [ ] Multi-fill paints all matching blocks
- [ ] Completion triggers at 100%
- [ ] Rewards actually add to player currency
- [ ] XP thresholds work correctly
- [ ] Shop purchases deduct correct amount
- [ ] Player state persists on page refresh
- [ ] New game resets session state but not player state
