"use client"

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
                                <img
                                    src={colorStarMap[color] || "/placeholder.svg"}
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

// Updated ColorPicker component to include onClose prop
export function ColorPicker({ onSelectColor, onClose }) {
    const colors = ["red", "blue", "green", "yellow"]

    // Handle color selection and close
    const handleColorSelect = (color) => {
        onSelectColor(color)
        if (onClose) onClose()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-black bg-opacity-90 rounded-xl p-6 shadow-2xl border-2 border-white max-w-xs w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-xl font-bold">Choose a color</h3>
                    {onClose && (
                        <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close color picker">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className="w-full h-20 rounded-xl shadow-lg transform transition-transform hover:scale-105 border-4 border-white flex items-center justify-center"
                            style={{
                                backgroundColor:
                                    color === "red"
                                        ? "#F42C04"
                                        : color === "blue"
                                            ? "#1789FC"
                                            : color === "yellow"
                                                ? "#FFB30F"
                                                : "#3E8914",
                            }}
                            aria-label={`Select ${color}`}
                        >
              <span className={`font-bold text-lg ${color === "yellow" ? "text-black" : "text-white"}`}>
                {color.toUpperCase()}
              </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

