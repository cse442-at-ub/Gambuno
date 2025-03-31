"use client"

// UNO Card Component
export function UnoCard({ color, number, className, onClick, disabled }) {
  // Map colors to their respective star images
  const colorStarMap = {
    red: "/images/unoLogoRed.png",
    blue: "/images/unoLogoblue.png",
    yellow: "/images/unoLogoYellow.png",
    green: "/images/unoLogogreen.png",
  }

  // Map colors to exact hex color values from the reference
  const colorHexMap = {
    red: "#F42C04",
    blue: "#1789FC",
    yellow: "#FFB30F",
    green: "#3E8914",
  }

  // Create an array of positions for the stars in a circle
  const starPositions = [
    { top: "10%", left: "50%", transform: "translate(-50%, 0) rotate(0deg)" },
    { top: "15%", left: "75%", transform: "translate(-50%, 0) rotate(45deg)" },
    { top: "30%", left: "90%", transform: "translate(-50%, 0) rotate(90deg)" },
    { top: "50%", left: "95%", transform: "translate(-50%, -50%) rotate(135deg)" },
    { top: "70%", left: "90%", transform: "translate(-50%, -100%) rotate(180deg)" },
    { top: "85%", left: "75%", transform: "translate(-50%, -100%) rotate(225deg)" },
    { top: "90%", left: "50%", transform: "translate(-50%, -100%) rotate(270deg)" },
    { top: "85%", left: "25%", transform: "translate(-50%, -100%) rotate(315deg)" },
    { top: "70%", left: "10%", transform: "translate(-50%, -100%) rotate(0deg)" },
    { top: "50%", left: "5%", transform: "translate(-50%, -50%) rotate(45deg)" },
    { top: "30%", left: "10%", transform: "translate(-50%, 0) rotate(90deg)" },
    { top: "15%", left: "25%", transform: "translate(-50%, 0) rotate(135deg)" },
  ]

  return (
      <button
          className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={onClick}
          disabled={disabled}
          type="button"
      >
        {/* Card background with thicker border */}
        <div className="absolute inset-0 bg-black rounded-lg">
          <div className="absolute inset-[4px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center">
            {/* Number in top left - improved visibility */}
            <div className="absolute top-1 left-1 z-10">
            <span
                style={{
                  color: colorHexMap[color],
                  fontSize: "clamp(0.8rem, 2vw, 1.5rem)",
                  textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                  fontWeight: "900",
                }}
                className="font-bold"
            >
              {number}
            </span>
            </div>

            {/* Number in bottom right - improved visibility */}
            <div className="absolute bottom-1 right-1 z-10">
            <span
                style={{
                  color: colorHexMap[color],
                  fontSize: "clamp(0.8rem, 2vw, 1.5rem)",
                  textShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
                  fontWeight: "900",
                }}
                className="font-bold"
            >
              {number}
            </span>
            </div>

            {/* Ring of stars around the number */}
            <div
                className="absolute"
                style={{
                  width: "92%",
                  height: "86.25%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
            >
              {/* Stars around the number */}
              {starPositions.map((position, index) => (
                  <div
                      key={index}
                      className="absolute w-2 h-2 sm:w-3 sm:h-3"
                      style={{
                        top: position.top,
                        left: position.left,
                        transform: position.transform,
                      }}
                  >
                    console.log(color)
                    console.log(colorStarMap[color])
                    <img
                        src={colorStarMap[color]}
                        alt={`${color} star`}
                        className="w-full h-full object-contain"
                    />
                  </div>
              ))}

              {/* Center number - improved visibility */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <span
                  style={{
                    color: colorHexMap[color],
                    fontSize: "clamp(1.5rem, 4vw, 3rem)",
                    textShadow: "0 0 3px rgba(255, 255, 255, 0.9)",
                    fontWeight: "900",
                  }}
                  className="font-bold"
              >
                {number}
              </span>
              </div>
            </div>
          </div>
        </div>
      </button>
  )
}

// Wild Card Component
export function WildCard({ className, onClick, disabled }) {
  return (
      <button
          className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onClick={onClick}
          disabled={disabled}
          type="button"
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-black rounded-lg">
          <div className="absolute inset-[4px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center">
            {/* Star in top left */}
            <div className="absolute top-1 left-1 w-4 h-4 sm:w-5 sm:h-5">
              <img
                  src="/images/unoLogoWild.png"
                  alt="Wild star"
                  className="w-full h-full object-contain"
                  style={{ transform: "rotate(0deg)" }}
              />
            </div>

            {/* Star in bottom right */}
            <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5">
              <img
                  src="/images/unoLogoWild.png"
                  alt="Wild star"
                  className="w-full h-full object-contain"
                  style={{ transform: "rotate(0deg)" }}
              />
            </div>

            {/* Center oval with wild star */}
            <div
                className="border-[3px] sm:border-[4px] border-black rounded-[50%] flex items-center justify-center"
                style={{
                  width: "92%",
                  height: "86.25%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
            >
              <div className="w-3/4 h-3/4 flex items-center justify-center">
                <img src="/images/unoLogoWild.png" alt="Wild star" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </button>
  )
}

// Card Back Component
export function CardBack({ className, isDark = false, onClick }) {
  const bgColor = isDark ? "bg-black" : "bg-[#fffffb]"
  const starImage = isDark ? "/images/unoLogoback.png" : "/images/unoLogoWild.png"

  // Add white border class only for dark mode cards
  const borderClass = isDark ? "border-[2px] border-white" : ""

  return (
      <button
          className={`relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""}`}
          onClick={onClick}
          type="button"
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-black rounded-lg">
          <div className={`absolute inset-[4px] ${bgColor} ${borderClass} rounded-md flex items-center justify-center`}>
            {/* Normal card back with single star - much bigger */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12">
              <img src={starImage || "/placeholder.svg"} alt="UNO star" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </button>
  )
}

// Color Picker Component
export function ColorPicker({ onSelectColor, onClose }) {
  const colors = [
    { name: "red", hex: "#F42C04" },
    { name: "blue", hex: "#1789FC" },
    { name: "green", hex: "#3E8914" },
    { name: "yellow", hex: "#FFB30F" },
  ]

  const handleColorSelection = (colorName) => {
    onSelectColor(colorName)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-center">Choose a color</h2>
            <button onClick={handleClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {colors.map((color) => (
                <button
                    key={color.name}
                    className="w-24 h-24 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorSelection(color.name)}
                    aria-label={`Select ${color.name}`}
                />
            ))}
          </div>
        </div>
      </div>
  )
}