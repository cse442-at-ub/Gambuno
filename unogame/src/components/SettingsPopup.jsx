"use client"

import { useState } from "react"
import { X, User, Check } from "lucide-react"

export default function SettingsPopup({ isOpen, onClose, isLoggedIn = false, username = "" }) {
  const [currentScreen, setCurrentScreen] = useState("main")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(50)
  const [musicVolume, setMusicVolume] = useState(50)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#1789fc] p-6 shadow-lg flex flex-col items-center"
        style={{ height: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full border-2 border-black bg-transparent p-1.5"
          aria-label="Close popup"
        >
          <X className="h-7 w-7 text-black" />
        </button>

        {currentScreen === "main" && (
          <div className="w-full flex-grow flex flex-col items-center pt-20 gap-8">
            <div className="flex items-center gap-4">
              <div className="rounded-full border-2 border-black p-2">
                <User className="h-12 w-12 text-black" />
              </div>

              {isLoggedIn ? (
                <span className="text-2xl font-bold text-black italic">{username}</span>
              ) : (
                <button className="bg-[#0a1929] text-white font-bold text-2xl py-3 px-8 rounded-full italic">
                  Log In
                </button>
              )}
            </div>

            <div className="mt-20 flex flex-col gap-8 w-full max-w-xs">
              <button
                onClick={() => setCurrentScreen("account")}
                className="w-full rounded-full border-4 border-gray-500 bg-gray-100 py-4 px-8 text-center shadow-md"
              >
                <span className="text-2xl font-bold text-black italic drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
                  Account
                </span>
              </button>

              <button
                onClick={() => setCurrentScreen("sound")}
                className="w-full rounded-full border-4 border-gray-500 bg-gray-100 py-4 px-8 text-center shadow-md"
              >
                <span className="text-2xl font-bold text-black italic drop-shadow-[1px_1px_0px_rgba(0,0,0,0.3)]">
                  Sound
                </span>
              </button>
            </div>
          </div>
        )}

        {currentScreen === "sound" && (
          <div className="w-full flex-grow flex flex-col items-center pt-20 gap-12">
            <h2 className="text-4xl font-bold text-white italic drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Sound</h2>

            <div className="w-full max-w-xs space-y-16">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black italic drop-shadow-[1px_1px_0px_rgba(255,255,255,0.3)]">
                  Sound
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${soundEnabled ? "bg-purple-700" : "bg-gray-400"}`}
                  >
                    {soundEnabled && <Check className="h-5 w-5 text-white" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number.parseInt(e.target.value))}
                    disabled={!soundEnabled}
                    className="flex-grow h-4 rounded-full appearance-none bg-gray-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black italic drop-shadow-[1px_1px_0px_rgba(255,255,255,0.3)]">
                  Music
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${musicEnabled ? "bg-purple-700" : "bg-gray-400"}`}
                  >
                    {musicEnabled && <Check className="h-5 w-5 text-white" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(Number.parseInt(e.target.value))}
                    disabled={!musicEnabled}
                    className="flex-grow h-4 rounded-full appearance-none bg-gray-200 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen("main")}
              className="mt-auto mb-6 px-6 py-2 rounded-full border-2 border-black bg-transparent"
            >
              <span className="text-lg font-medium text-black">Back</span>
            </button>
          </div>
        )}

        {currentScreen === "account" && (
          <div className="w-full flex-grow flex flex-col items-center pt-20 gap-8">
            <h2 className="text-4xl font-bold text-white italic drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">Account</h2>

            <div className="w-full max-w-xs space-y-6 text-center">
              {isLoggedIn ? (
                <>
                  <p className="text-xl text-black">Logged in as:</p>
                  <p className="text-2xl font-bold text-black">{username}</p>
                  <button className="mt-4 bg-red-600 text-white font-bold py-2 px-6 rounded-full">Log Out</button>
                </>
              ) : (
                <>
                  <p className="text-xl text-black">You are not logged in</p>
                  <button className="mt-4 bg-[#0a1929] text-white font-bold py-2 px-6 rounded-full">Log In</button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentScreen("main")}
              className="mt-auto mb-6 px-6 py-2 rounded-full border-2 border-black bg-transparent"
            >
              <span className="text-lg font-medium text-black">Back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

