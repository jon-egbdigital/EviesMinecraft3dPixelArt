import { MINECRAFT_COLORS } from '../../data/colors'

function ColorPalette({ selectedColorId, onColorSelect, modelColors }) {
  // Filter to show only colors used in the current model
  const availableColors = MINECRAFT_COLORS.filter(color =>
    modelColors.includes(color.id)
  )

  return (
    <div className="absolute top-16 sm:top-16 md:top-16 right-2 sm:right-4 bg-gray-800 bg-opacity-90 rounded-lg p-2 sm:p-3 border-2 border-gray-600 pointer-events-auto">
      <div className="text-white text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 text-center">COLORS</div>
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {availableColors.map(color => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded border-3 sm:border-4 transition-all relative active:scale-95 ${
              selectedColorId === color.id
                ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105'
                : 'border-gray-500 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {color.number}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ColorPalette
