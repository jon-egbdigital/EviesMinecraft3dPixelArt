# Phase 2 Testing Guide

## Phase 2 Implementation Complete ✅

Phase 2 adds rewards, currency, XP/leveling, and persistence to the game.

## What's New in Phase 2

### 1. **Player Progression System**
   - **Coins** (💰) and **Diamonds** (💎) currency
   - **XP** and **Level** system with progress bar
   - **localStorage persistence** - progress saves automatically

### 2. **Reward System**
   - Random loot on completion from weighted loot table:
     - 60% chance: 5-15 coins
     - 20% chance: 20-30 bonus coins
     - 15% chance: 1 diamond
     - 4% chance: 3 diamonds
     - 1% chance: JACKPOT (50 coins + 5 diamonds)

### 3. **Multipliers**
   - **Perfect (no mistakes)**: 1.5x coin multiplier
   - **Hard difficulty**: 2x rewards multiplier
   - **XP Bonus**: 50% extra XP for perfect runs

### 4. **New UI Components**
   - **HUD** (top-right): Shows coins, diamonds, level, and XP progress
   - **Enhanced Completion Modal**: Shows rewards, XP gained, and level-ups

## How to Test

### Quick Test (Press 'T')
1. Navigate to http://localhost:5175/
2. Press the **'T' key** to auto-complete the sword
3. Watch the completion modal show:
   - Time and mistakes
   - Random reward (coins/diamonds/jackpot)
   - XP gained
   - Level up (if enough XP)
   - Multipliers (if perfect/hard mode)
4. Click "Play Again" and notice:
   - HUD shows updated currency and XP
   - Progress persists if you refresh the page

### Manual Test
1. Select colors from the palette
2. Click blocks to paint them
3. Complete the model manually
4. Observe the same reward flow

### Dev Console Commands

Open browser console (F12) and try these commands:

```javascript
// View all available commands
__dev.help()

// Add currency for testing
__dev.addCoins(100)
__dev.addDiamonds(10)

// Test leveling
__dev.addXP(500)  // Should level up multiple times

// View current player state
__dev.showPlayerState()

// Reset progress
__dev.resetPlayer()

// Clear all storage
__dev.clearStorage()  // Then refresh page
```

## Testing Checklist

- [ ] HUD displays coins (starts at 0)
- [ ] HUD displays diamonds (starts at 0)
- [ ] HUD displays level (starts at 1)
- [ ] HUD shows XP progress bar
- [ ] Completing a game grants random rewards
- [ ] Rewards are displayed in completion modal
- [ ] XP is granted on completion
- [ ] Level up message shows when reaching new level
- [ ] Perfect runs (0 mistakes) show 1.5x multiplier
- [ ] Currency persists after page refresh
- [ ] XP and level persist after page refresh
- [ ] Completed models are tracked in playerStore
- [ ] Multiple completions grant different random rewards

## Testing Different Scenarios

### Test Perfect Run
1. Press 'T' to auto-complete (0 mistakes)
2. Check for "⭐ PERFECT! No mistakes! ⭐" message
3. Verify 1.5x multiplier is shown
4. XP should be 50 * 1.5 = 75 XP (easy difficulty)

### Test With Mistakes
1. Click wrong colors a few times
2. Then complete the model
3. Should NOT show perfect bonus
4. Should NOT show multiplier
5. XP should be base 50 XP (easy difficulty)

### Test Leveling
1. Complete sword 3-4 times (auto with 'T')
2. Should level up from 1 → 2 (requires 100 XP)
3. Level 2 → 3 requires 250 XP total
4. Watch the XP bar fill up and reset on level up

### Test Persistence
1. Play and earn some currency
2. Refresh the page (F5)
3. Currency, XP, and level should remain the same
4. Check browser DevTools → Application → LocalStorage
5. Look for key: `minecraft-pixel-art-player`

### Test Different Rewards
1. Complete the sword 10+ times (use 'T' key)
2. You should see variety:
   - Some completions give small coins
   - Some give larger coin amounts
   - Occasionally get diamonds
   - Rarely get jackpot

### Test localStorage
```javascript
// View stored data
JSON.parse(localStorage.getItem('minecraft-pixel-art-player'))

// Clear and reset
__dev.clearStorage()
// Then refresh page - should start fresh at Level 1 with 0 currency
```

## Known Features

- **Auto-completion shortcut**: Press 'T' key to instantly paint all blocks correctly
- **Dev helpers**: Available in development mode via `__dev` global object
- **Console logging**: Completion rewards are logged to console

## Phase 2 Complete

All Phase 2 requirements implemented:
- ✅ Zustand playerStore with localStorage persistence
- ✅ Loot table system with weighted random rewards
- ✅ Currency system (coins and diamonds)
- ✅ XP and leveling system (10 levels)
- ✅ HUD showing currency, level, and XP progress
- ✅ Enhanced completion modal with reward display
- ✅ Multipliers for perfect runs and hard difficulty
- ✅ Level-up celebrations

## Next Steps (Phase 3)

Phase 3 will add:
- Shop UI to spend currency
- Multiple brush types (Multi-Fill, Area, X-Ray)
- Brush selection and purchasing
- Undo and Hint systems

---

**Test Commands Summary:**
- `T` - Auto-complete model
- `__dev.help()` - Show all dev commands
- `__dev.showPlayerState()` - View current progress
- `__dev.addXP(amount)` - Test leveling
- `F5` - Refresh to test persistence
