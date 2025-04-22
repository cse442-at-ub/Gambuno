"use client"
import redS from "./images/unoLogoRed.png"
import blueS from "./images/unoLogoblue.png"
import yellowS from "./images/unoLogoYellow.png"
import greenS from "./images/unoLogogreen.png"
import back from "./images/unoLogoback.png"
import wild from "./images/unoLogoWild.png"

const colorStarMap = {
  red: redS,
  blue: blueS,
  yellow: yellowS,
  green: greenS,
}

// Map colors to exact hex color values from the reference
const colorHexMap = {
  red: "#F42C04",
  blue: "#1789FC",
  yellow: "#FFB30F",
  green: "#3E8914",
}

// Base card component to reduce code duplication
function BaseCard({ className, onClick, disabled, children }) {
  return (
    <button
      className={`relative rounded-lg overflow-hidden shadow-lg ${
        disabled ? "opacity-70 cursor-not-allowed" : "active:scale-95 cursor-pointer"
      } touch-manipulation ${className || ""}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type="button"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="absolute inset-0 bg-black rounded-lg">
        <div className="absolute inset-[3px] bg-[#fffffb] rounded-md flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </button>
  )
}

export function UnoCard({ color, number, className, onClick, disabled }) {
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
    <BaseCard className={className} onClick={onClick} disabled={disabled}>
      {/* Number in top left - improved visibility */}
      <div className="absolute top-0 left-1 z-10">
        <span
          style={{
            color: colorHexMap[color],
            fontSize: "min(max(0.7rem, 4vw), 1.2rem)",
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
            fontSize: "min(max(0.7rem, 4vw), 1.2rem)",
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
        {/* Stars around the number - reduced for mobile */}
        {starPositions.slice(0, window?.innerWidth < 375 ? 8 : 12).map((position, index) => (
          <div
            key={index}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3"
            style={{
              top: position.top,
              left: position.left,
              transform: position.transform,
            }}
          >
            <img
              src={colorStarMap[color] || "/placeholder.svg"}
              alt=""
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
        ))}

        {/* Center number - improved visibility */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <span
            style={{
              color: colorHexMap[color],
              fontSize: "min(max(1.2rem, 8vw), 2.5rem)",
              textShadow: "0 0 3px rgba(255, 255, 255, 0.9)",
              fontWeight: "900",
            }}
            className="font-bold"
          >
            {number}
          </span>
        </div>
      </div>
    </BaseCard>
  )
}

export function WildCard({ className, onClick, disabled }) {
  return (
    <BaseCard className={className} onClick={onClick} disabled={disabled}>
      {/* Star in top left */}
      <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4">
        <img
          src={wild || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-contain"
          style={{ transform: "rotate(0deg)" }}
          aria-hidden="true"
        />
      </div>

      {/* Star in bottom right */}
      <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4">
        <img
          src={wild || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-contain"
          style={{ transform: "rotate(0deg)" }}
          aria-hidden="true"
        />
      </div>

      {/* Center oval with wild star */}
      <div
        className="border-[2px] sm:border-[3px] md:border-[4px] border-black rounded-[50%] flex items-center justify-center"
        style={{
          width: "92%",
          height: "86.25%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-label="Wild Card"
      >
        <div className="w-3/4 h-3/4 flex items-center justify-center">
          <img src={wild || "/placeholder.svg"} alt="Wild" className="w-full h-full object-contain" />
        </div>
      </div>
    </BaseCard>
  )
}

export function ColoredWildCard({ color, className, onClick, disabled }) {
  return (
    <BaseCard className={className} onClick={onClick} disabled={disabled}>
      {/* Star in top left */}
      <div className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4">
        <img
          src={colorStarMap[color] || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-contain"
          style={{ transform: "rotate(0deg)" }}
          aria-hidden="true"
        />
      </div>

      {/* Star in bottom right */}
      <div className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4">
        <img
          src={colorStarMap[color] || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-contain"
          style={{ transform: "rotate(0deg)" }}
          aria-hidden="true"
        />
      </div>

      {/* Center oval with colored star */}
      <div
        className="border-[2px] sm:border-[3px] md:border-[4px] border-black rounded-[50%] flex items-center justify-center"
        style={{
          width: "92%",
          height: "86.25%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-label={`Wild Card - ${color}`}
      >
        <div className="w-3/4 h-3/4 flex items-center justify-center">
          <img
            src={colorStarMap[color] || "/placeholder.svg"}
            alt={`${color}`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </BaseCard>
  )
}

export function ReverseCard({ color, className, onClick, disabled }) {
  return (
    <BaseCard className={className} onClick={onClick} disabled={disabled}>
      {/* Reverse symbol in top left - improved visibility */}
      <div className="absolute top-1 left-1 z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 14L4 9L9 4"
            stroke={colorHexMap[color]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9H15C18.3137 9 21 11.6863 21 15C21 18.3137 18.3137 21 15 21H12"
            stroke={colorHexMap[color]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Reverse symbol in bottom right - improved visibility */}
      <div className="absolute bottom-1 right-1 z-10 rotate-180">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 14L4 9L9 4"
            stroke={colorHexMap[color]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9H15C18.3137 9 21 11.6863 21 15C21 18.3137 18.3137 21 15 21H12"
            stroke={colorHexMap[color]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Center reverse symbol - improved visibility */}
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
        aria-label={`Reverse Card - ${color}`}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            >
              <path
                d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
                stroke={colorHexMap[color]}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}

export function PlusFiveCard({ className, onClick, disabled }) {
  return (
    <BaseCard className={`${className}`} onClick={onClick} disabled={disabled}>
      <div className="absolute inset-[3px] bg-black rounded-md border border-white flex flex-col items-center justify-center">
        {/* +5 in top left - moved closer to corner */}
        <div className="absolute top-0.5 left-0.5 z-10">
          <span
            style={{
              color: "white",
              fontSize: "min(max(0.6rem, 4vw), 1.1rem)",
              fontWeight: "700",
            }}
            className="font-bold"
          >
            +5
          </span>
        </div>

        {/* +5 in bottom right - moved closer to corner */}
        <div className="absolute bottom-0.5 right-0.5 z-10">
          <span
            style={{
              color: "white",
              fontSize: "min(max(0.6rem, 4vw), 1.1rem)",
              fontWeight: "700",
            }}
            className="font-bold"
          >
            +5
          </span>
        </div>

        {/* Center oval with wild star */}
        <div
          className="border-[2px] sm:border-[3px] md:border-[4px] border-white rounded-[50%] flex items-center justify-center"
          style={{
            width: "80%",
            height: "75%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          aria-label="Plus Five Card"
        >
          <div className="w-3/4 h-3/4 flex items-center justify-center">
            <img src={back || "/placeholder.svg"} alt="+5" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </BaseCard>
  )
}

export function CardBack({ className, isDark = false, onClick }) {
  const bgColor = isDark ? "bg-black" : "bg-[#fffffb]"
  const starImage = isDark ? back : wild

  // Add white border class only for dark mode cards
  const borderClass = isDark ? "border-[1px] sm:border-[2px] border-white" : ""

  return (
    <button
      className={`relative rounded-lg overflow-hidden shadow-lg active:scale-95 touch-manipulation ${className || ""}`}
      onClick={onClick}
      type="button"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-black rounded-lg">
        <div className={`absolute inset-[3px] ${bgColor} ${borderClass} rounded-md flex items-center justify-center`}>
          {/* Normal card back with single star - much bigger */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10">
            <img src={back || "/placeholder.svg"} alt="UNO card back" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </button>
  )
}

export function SkipCard({ color, className, onClick, disabled }) {
  // Custom SVG for the skip icon with thicker lines and perfect circle
  const SkipIcon = ({ size = 16, strokeWidth = 3 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={colorHexMap[color]} strokeWidth={strokeWidth} />
      <path d="M6.5 17.5L17.5 6.5" stroke={colorHexMap[color]} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )

  // Filled version for center icon
  const FilledSkipIcon = ({ size = 40 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
    >
      <circle cx="12" cy="12" r="11" fill={colorHexMap[color]} />
      <circle cx="12" cy="12" r="8" fill="white" />
      <path d="M6.5 17.5L17.5 6.5" stroke={colorHexMap[color]} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )

  return (
    <BaseCard className={className} onClick={onClick} disabled={disabled}>
      {/* Skip symbol in top left */}
      <div className="absolute top-0.5 left-0.5 z-10">
        <SkipIcon size={13} strokeWidth={3} />
      </div>

      {/* Skip symbol in bottom right */}
      <div className="absolute bottom-0.5 right-0.5 z-10">
        <SkipIcon size={16} strokeWidth={3} />
      </div>

      {/* Center oval with skip symbol */}
      <div
        className="border-[2px] sm:border-[3px] md:border-[4px] border-black rounded-[50%] flex items-center justify-center"
        style={{
          width: "85%",
          height: "86.25%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-label={`Skip Card - ${color}`}
      >
        <div className="w-3/4 h-3/4 flex items-center justify-center">
          <FilledSkipIcon />
        </div>
      </div>
    </BaseCard>
  )
}

export function ColoredPlusFiveCard({ color, className, onClick, disabled }) {
  return (
    <BaseCard className={`${className}`} onClick={onClick} disabled={disabled}>
      <div className="absolute inset-[3px] bg-black rounded-md border border-white flex flex-col items-center justify-center">
        {/* +5 in top left - moved closer to corner */}
        <div className="absolute top-0.5 left-0.5 z-10">
          <span
            style={{
              color: colorHexMap[color],
              fontSize: "min(max(0.6rem, 4vw), 1.1rem)",
              fontWeight: "700",
            }}
            className="font-bold"
          >
            +5
          </span>
        </div>

        {/* +5 in bottom right - moved closer to corner */}
        <div className="absolute bottom-0.5 right-0.5 z-10">
          <span
            style={{
              color: colorHexMap[color],
              fontSize: "min(max(0.6rem, 4vw), 1.1rem)",
              fontWeight: "700",
            }}
            className="font-bold"
          >
            +5
          </span>
        </div>

        {/* Center oval with colored star */}
        <div
          className={`border-[2px] sm:border-[3px] md:border-[4px] border-white rounded-[50%] flex items-center justify-center`}
          style={{
            width: "80%",
            height: "75%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          aria-label={`Plus Five Card - ${color}`}
        >
          <div className="w-3/4 h-3/4 flex items-center justify-center">
            <img
              src={colorStarMap[color] || "/placeholder.svg"}
              alt={`${color} +5`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </BaseCard>
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 touch-none">
      <div className="bg-black bg-opacity-90 rounded-xl p-4 sm:p-6 shadow-2xl border-2 border-white max-w-xs w-[90%]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-lg font-bold">Choose a color</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2 -mr-2"
              aria-label="Close color picker"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
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

        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-full h-16 sm:h-20 rounded-xl shadow-lg active:scale-95 border-2 sm:border-4 border-white flex items-center justify-center touch-manipulation"
              style={{
                backgroundColor: colorHexMap[color],
                WebkitTapHighlightColor: "transparent",
              }}
              aria-label={`Select ${color}`}
            >
              <span className={`font-bold text-base sm:text-lg ${color === "yellow" ? "text-black" : "text-white"}`}>
                {color.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}