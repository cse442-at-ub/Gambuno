"use client"

export function WildCard({ className, onClick, disabled }) {
  return (
    <button
      className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${className || ""} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-black rounded-lg">
        <div className="absolute inset-[2px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center">
          {/* Center star */}
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/images/unoLogoWild.png" alt="Wild star" className="w-full h-full object-contain" />
          </div>

          {/* Small stars in corners */}
          <div className="absolute top-1 left-1 w-3 h-3">
            <img src="/images/unoLogoWild.png" alt="Wild star" className="w-full h-full object-contain" />
          </div>
          <div className="absolute bottom-1 right-1 w-3 h-3">
            <img src="/images/unoLogoWild.png" alt="Wild star" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </button>
  )
}

