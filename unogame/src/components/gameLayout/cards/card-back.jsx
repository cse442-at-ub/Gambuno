"use client"

export function CardBack({ className, isDark = false, onClick }) {
  const starImage = isDark ? "/images/unoLogoback.png" : "/images/unoLogoWild.png"

  return (
    <button
      className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""}`}
      onClick={onClick}
      type="button"
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-black rounded-lg">
        <div
          className={`absolute inset-[2px] bg-black rounded-md flex flex-col items-center justify-center border border-white`}
        >
          {/* Center star */}
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={starImage || "/placeholder.svg"} alt="UNO star" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </button>
  )
}

