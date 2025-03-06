"use client"

import { useState } from "react"
import { X, User, UserPlus, Search, ArrowLeft } from "lucide-react"

export default function FriendsPopup({ isOpen, onClose }) {
  const [currentScreen, setCurrentScreen] = useState("main")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample friends data
  const [friends] = useState([
    { id: "1", username: "Player189", online: true },
    { id: "2", username: "Player123", online: true },
    { id: "3", username: "Player345", online: false },
    { id: "4", username: "Player178", online: true },
  ])

  // Sample search results
  const searchResults = [
    { id: "6", username: "NewPlayer456" },
    { id: "7", username: "GameMaster789" },
    { id: "8", username: "UnoChamp2023" },
  ].filter((player) => searchQuery && player.username.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!isOpen) return null

  const handleInvite = (friendId) => {
    console.log(`Invited friend with ID: ${friendId}`)
  }

  const handleJoin = (friendId) => {
    console.log(`Joined friend with ID: ${friendId}`)
  }

  const handleAddFriend = (playerId) => {
    console.log(`Added player with ID: ${playerId} as friend`)
  }

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

        {currentScreen === "main" ? (
          <div className="w-full flex-grow flex flex-col items-center pt-10 pb-20 overflow-y-auto">
            <h2 className="text-5xl font-bold text-white italic drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] mb-12">
              Friends
            </h2>

            <div className="w-full space-y-6">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full border-2 border-black p-1">
                      <User className="h-8 w-8 text-black" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">{friend.username}</span>
                      {friend.online && (
                        <span className="text-sm bg-green-500 text-white px-2 py-0.5 rounded-full w-fit">Online</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleInvite(friend.id)}
                      className="bg-[#222] text-white font-bold py-1 px-4 rounded-full w-24"
                    >
                      Invite
                    </button>
                    <button
                      onClick={() => handleJoin(friend.id)}
                      className={`bg-[#222] text-white font-bold py-1 px-4 rounded-full w-24 ${!friend.online && "opacity-50 cursor-not-allowed"}`}
                      disabled={!friend.online}
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex-grow flex flex-col items-center pt-10 pb-20 overflow-y-auto">
            <div className="flex items-center w-full mb-8">
              <button
                onClick={() => setCurrentScreen("main")}
                className="rounded-full border-2 border-black bg-transparent p-1.5 mr-4"
                aria-label="Back to friends"
              >
                <ArrowLeft className="h-6 w-6 text-black" />
              </button>
              <h2 className="text-4xl font-bold text-white italic drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                Add Friends
              </h2>
            </div>

            <div className="w-full relative mb-8">
              <input
                type="text"
                placeholder="Search for players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-12 rounded-full text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            <div className="w-full space-y-6">
              {searchResults.length > 0 ? (
                searchResults.map((player) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full border-2 border-black p-1">
                        <User className="h-8 w-8 text-black" />
                      </div>
                      <span className="text-2xl font-bold text-white">{player.username}</span>
                    </div>
                    <button
                      onClick={() => handleAddFriend(player.id)}
                      className="bg-[#222] text-white font-bold py-1 px-4 rounded-full flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" /> Add
                    </button>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center text-white text-xl">No players found matching "{searchQuery}"</div>
              ) : (
                <div className="text-center text-white text-xl">Search for players to add as friends</div>
              )}
            </div>
          </div>
        )}

        {currentScreen === "main" && (
          <button
            onClick={() => setCurrentScreen("add")}
            className="absolute left-6 top-6 rounded-full border-2 border-black bg-transparent p-2"
            aria-label="Add friend"
          >
            <UserPlus className="h-8 w-8 text-black" />
          </button>
        )}
      </div>
    </div>
  )
}

