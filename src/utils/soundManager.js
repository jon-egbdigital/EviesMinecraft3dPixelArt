/**
 * Sound Manager
 * Handles all audio playback for the game
 */

class SoundManager {
  constructor() {
    this.sounds = {}
    this.musicVolume = 0.25  // Reduced from 0.5 to 0.25 (50% quieter)
    this.sfxVolume = 0.8
    this.currentMusic = null
    this.enabled = true
  }

  /**
   * Load a sound effect
   * @param {string} name - Sound identifier
   * @param {string} url - Path to audio file
   */
  loadSound(name, url) {
    try {
      const audio = new Audio(url)
      audio.preload = 'auto'

      this.sounds[name] = {
        url,
        loaded: false,
        audio,
        isMusic: name.includes('music')
      }

      // Mark as loaded when ready
      audio.addEventListener('canplaythrough', () => {
        this.sounds[name].loaded = true
      })

      // Handle loading errors gracefully
      audio.addEventListener('error', (e) => {
        console.warn(`[Sound] Failed to load: ${name} from ${url}`)
      })
    } catch (error) {
      console.warn(`[Sound] Error loading ${name}:`, error)
    }
  }

  /**
   * Play a sound effect
   * @param {string} name - Sound identifier
   * @param {number} volume - Volume override (0-1)
   */
  playSound(name, volume = null) {
    if (!this.enabled) return

    const sound = this.sounds[name]
    if (!sound || !sound.audio) {
      console.warn(`[Sound] Sound not found: ${name}`)
      return
    }

    try {
      const finalVolume = volume !== null ? volume : this.sfxVolume
      sound.audio.volume = finalVolume
      sound.audio.currentTime = 0

      // Play returns a promise
      const playPromise = sound.audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`[Sound] Playback failed for ${name}:`, error)
        })
      }
    } catch (error) {
      console.warn(`[Sound] Error playing ${name}:`, error)
    }
  }

  /**
   * Play background music
   * @param {string} name - Music identifier
   */
  playMusic(name) {
    if (!this.enabled) return

    // Stop current music first
    if (this.currentMusic && this.currentMusic !== name) {
      this.stopMusic()
    }

    const sound = this.sounds[name]
    if (!sound || !sound.audio) {
      console.warn(`[Sound] Music not found: ${name}`)
      return
    }

    try {
      sound.audio.volume = this.musicVolume
      sound.audio.loop = true
      sound.audio.currentTime = 0

      const playPromise = sound.audio.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.currentMusic = name
        }).catch(error => {
          console.warn(`[Sound] Music playback failed for ${name}:`, error)
        })
      }
    } catch (error) {
      console.warn(`[Sound] Error playing music ${name}:`, error)
    }
  }

  /**
   * Stop current music
   */
  stopMusic() {
    if (this.currentMusic) {
      const sound = this.sounds[this.currentMusic]
      if (sound && sound.audio) {
        sound.audio.pause()
        sound.audio.currentTime = 0
      }
      this.currentMusic = null
    }
  }

  /**
   * Update volume settings
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))

    // Apply to current music if playing
    if (this.currentMusic) {
      const sound = this.sounds[this.currentMusic]
      if (sound && sound.audio) {
        sound.audio.volume = this.musicVolume
      }
    }
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled) {
    this.enabled = enabled
    if (!enabled) {
      this.stopMusic()
    }
  }

  /**
   * Preload all game sounds
   */
  preloadSounds() {
    // Define all sounds to load
    const soundList = {
      // Painting sounds
      paint_correct: '/sounds/paint_correct.mp3',
      paint_wrong: '/sounds/paint_wrong.mp3',
      paint_multifill: '/sounds/paint_multifill.mp3',

      // UI sounds
      button_click: '/sounds/button_click.mp3',
      purchase: '/sounds/purchase.mp3',
      unlock: '/sounds/unlock.mp3',

      // Reward sounds
      completion: '/sounds/completion.mp3',
      coin_reward: '/sounds/coin_reward.mp3',
      diamond_reward: '/sounds/diamond_reward.mp3',
      jackpot: '/sounds/jackpot.mp3',
      level_up: '/sounds/level_up.mp3',

      // Achievement sounds (Phase 5) - Optional
      achievement_unlock: '/sounds/achievement_unlock.mp3',
      perfect_streak: '/sounds/perfect_streak.mp3',
      legendary_achievement: '/sounds/legendary_achievement.mp3',

      // Ambient
      menu_music: '/sounds/menu_music.mp3',
      game_music: '/sounds/game_music.mp3',
    }

    Object.entries(soundList).forEach(([name, url]) => {
      this.loadSound(name, url)
    })
  }
}

// Singleton instance
const soundManager = new SoundManager()

// Export convenience functions
export function playSound(name, volume) {
  soundManager.playSound(name, volume)
}

export function playMusic(name) {
  soundManager.playMusic(name)
}

export function stopMusic() {
  soundManager.stopMusic()
}

export function setMusicVolume(volume) {
  soundManager.setMusicVolume(volume)
}

export function setSfxVolume(volume) {
  soundManager.setSfxVolume(volume)
}

export function preloadSounds() {
  soundManager.preloadSounds()
}

export default soundManager
