import { MINECRAFT_COLORS } from '../../data/colors'

function ColorPalette({ selectedColorId, onColorSelect, modelColors }) {
  // Filter to show only colors used in the current model
  const availableColors = MINECRAFT_COLORS.filter(color =>
    modelColors.includes(color.id)
  )

  return (
    <div className="absolute top-16 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-3 border-2 border-gray-600">
      <div className="text-white text-sm font-bold mb-2 text-center">COLORS</div>
      <div className="flex flex-col gap-2">
        {availableColors.map(color => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            className={`w-16 h-16 rounded border-4 transition-all relative ${
              selectedColorId === color.id
                ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 scale-105'
                : 'border-gray-500 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color.hex }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {color.number}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ColorPalette
