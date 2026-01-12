# Sound Files

This directory should contain the game's sound effects and music files.

## Required Sound Files

Place the following audio files (MP3, OGG, or WAV format) in this directory:

### Painting Sounds
- `paint_correct.mp3` - When you paint a block correctly
- `paint_wrong.mp3` - When you paint with the wrong color
- `paint_multifill.mp3` - When multi-fill brush is used

### UI Sounds
- `button_click.mp3` - General button clicks
- `purchase.mp3` - When buying items in the shop
- `unlock.mp3` - When unlocking brushes or packs

### Reward Sounds
- `completion.mp3` - When completing a model
- `coin_reward.mp3` - When receiving coins
- `diamond_reward.mp3` - When receiving diamonds
- `jackpot.mp3` - When hitting the jackpot reward
- `level_up.mp3` - When leveling up

### Background Music (Optional)
- `menu_music.mp3` - Plays on main menu and other screens
- `game_music.mp3` - Plays during painting

## Where to Get Minecraft-Style Sounds

### Free Resources:

1. **Freesound.org** (https://freesound.org)
   - Search for: "minecraft", "block", "click", "success", "error"
   - License: CC0 or CC-BY (free to use)
   - Download as MP3 or OGG

2. **Pixabay** (https://pixabay.com/sound-effects/)
   - Search for: "game", "success", "error", "coin", "level up"
   - All sounds are free to use

3. **OpenGameArt.org** (https://opengameart.org)
   - Great for retro/8-bit game sounds
   - Filter by "Sound Effects"

4. **Zapsplat** (https://www.zapsplat.com)
   - Free game sound effects
   - Requires free account

### Minecraft Resource Packs:
If you own Minecraft, you can extract sounds from the game's resource pack:
- Look in `.minecraft/assets/objects/` folder
- Use a Minecraft asset extractor tool
- **Note**: Only for personal use, not for distribution

### Creating Your Own:
- **Audacity** (free) - Record and edit your own sounds
- **LMMS** (free) - Create chiptune/retro music
- **Bfxr** (free online) - Generate retro sound effects

## File Format Recommendations

- **MP3**: Best browser compatibility (recommended)
- **OGG**: Better quality, smaller size, good browser support
- **WAV**: Highest quality but larger files

## Testing

Once you add sound files:
1. Reload the game
2. Check browser console for loading errors
3. Paint blocks to test sound effects
4. Complete a model to test reward sounds
5. Adjust volume in Settings menu

## Volume Guidelines

When adding/creating sounds:
- Keep sound effects short (0.1 - 1.0 seconds)
- Normalize audio levels so all sounds are similar volume
- Background music should be quieter than sound effects
- Test with headphones and speakers

## Placeholder Sounds (Quick Start)

If you want to test the system quickly:
1. Find any short MP3 files on your computer
2. Rename them to match the required names above
3. The game will work with any audio file, even if it's not themed correctly
