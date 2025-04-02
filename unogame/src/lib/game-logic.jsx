// Card types
export const CARD_COLORS = ["red", "blue", "green", "yellow"]
export const CARD_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
export const CARD_SPECIAL = ["Wild", "Wild4"]

// Create a new deck of cards
export function createDeck() {
    const deck = []

    // Add number cards (0-9)
    CARD_COLORS.forEach((color) => {
        // Add one '0' card for each color
        deck.push({ id: `${color}-0`, color, value: "0", type: "number" })

        // Add two of each 1-9 for each color
        CARD_NUMBERS.slice(1).forEach((value) => {
            deck.push({ id: `${color}-${value}-1`, color, value, type: "number" })
            deck.push({ id: `${color}-${value}-2`, color, value, type: "number" })
        })
    })

    // Add special cards (Wild, Wild4)
    CARD_SPECIAL.forEach((value) => {
        for (let i = 0; i < 4; i++) {
            deck.push({ id: `special-${value}-${i}`, color: "wild", value, type: "special" })
        }
    })

    return shuffleDeck(deck)
}

// Shuffle the deck
export function shuffleDeck(deck) {
    const newDeck = [...deck]

    // Fisher-Yates shuffle algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    // Second pass for better randomization
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    return newDeck
}

// Deal initial cards to players
export function dealCards(deck, numPlayers, cardsPerPlayer = 7) {
    const hands = Array(numPlayers)
        .fill()
        .map(() => [])
    const newDeck = [...deck]

    // Deal cards to each player
    for (let i = 0; i < cardsPerPlayer; i++) {
        for (let j = 0; j < numPlayers; j++) {
            if (newDeck.length > 0) {
                hands[j].push(newDeck.pop())
            }
        }
    }

    // Get the first card for the discard pile
    const discardPile = []
    let firstCard

    // Keep drawing until we get a number card (not a special card)
    do {
        firstCard = newDeck.pop()
        if (firstCard.type === "special") {
            // Put it back in the deck and shuffle
            newDeck.push(firstCard)
            shuffleDeck(newDeck)
        } else {
            discardPile.push(firstCard)
        }
    } while (firstCard.type === "special")

    return { hands, deck: newDeck, discardPile }
}

// Check if a card can be played on top of the current card
export function canPlayCard(card, currentCard, currentColor) {
    // Wild cards can always be played
    if (card.type === "special") {
        return true
    }

    // Match color or value
    return card.color === currentColor || card.value === currentCard.value
}

// Apply card effects
export function applyCardEffect(gameState, card) {
    const { currentPlayer, direction, players } = gameState
    let nextPlayer = getNextPlayer(currentPlayer, direction, players.length)
    let drawCount = 0

    // Only Wild4 has a draw effect now
    if (card.value === "Wild4") {
        // Next player draws 4 cards and loses their turn
        drawCount = 4
        nextPlayer = getNextPlayer(nextPlayer, direction, players.length)
    }

    return { nextPlayer, direction, drawCount }
}

// Get the next player based on direction
export function getNextPlayer(currentPlayer, direction, numPlayers) {
    return (currentPlayer + direction + numPlayers) % numPlayers
}

// Check if a player has won
export function checkWinner(playerHand) {
    return playerHand.length === 0
}

// Check if a player needs to say "UNO"
export function shouldSayUno(playerHand) {
    return playerHand.length === 1
}

