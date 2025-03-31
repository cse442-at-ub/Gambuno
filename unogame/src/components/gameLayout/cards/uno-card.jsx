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

  return (
    <button
      className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* Card background with white background and border */}
      <div className="absolute inset-0 bg-black rounded-lg">
        <div className="absolute inset-[2px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center">
          {/* Number in top left */}
          <div className="absolute top-1 left-1">
            <span
              style={{
                color: colorHexMap[color],
                fontSize: "1rem",
              }}
              className="font-bold"
            >
              {number}
            </span>
          </div>

          {/* Number in bottom right */}
          <div className="absolute bottom-1 right-1">
            <span
              style={{
                color: colorHexMap[color],
                fontSize: "1rem",
              }}
              className="font-bold"
            >
              {number}
            </span>
          </div>

          {/* Center number */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span
              style={{
                color: colorHexMap[color],
                fontSize: "2.5rem",
              }}
              className="font-bold"
            >
              {number}
            </span>
          </div>

          {/* Small stars around the number */}
          <div className="absolute inset-0 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <img
                key={i}
                src={colorStarMap[color] || "/placeholder.svg"}
                alt={`${color} star`}
                className="absolute w-2 h-2"
                style={{
                  top: `${10 + Math.sin((i * Math.PI) / 4) * 70}%`,
                  left: `${10 + Math.cos((i * Math.PI) / 4) * 70}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

