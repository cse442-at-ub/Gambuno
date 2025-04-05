"use client"

export function ColorPicker({ onSelectColor }) {
  const colors = [
    { name: "red", hex: "#F42C04" },
    { name: "blue", hex: "#1789FC" },
    { name: "green", hex: "#3E8914" },
    { name: "yellow", hex: "#FFB30F" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Choose a color</h2>
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <button
              key={color.name}
              className="w-24 h-24 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: color.hex }}
              onClick={() => onSelectColor(color.name)}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

