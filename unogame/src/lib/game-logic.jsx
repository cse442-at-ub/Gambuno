/**
 * game-logic.js - Core game logic for UNO using the GameAPI
 */

import { GameAPI } from './game-api';

/**
 * Creates a standard UNO deck
 * @returns {Array} The generated deck
 */
export function createDeck() {
    // This is a local implementation for offline play
    // For online play, we'll use the server deck

    const colors = ["red", "blue", "green", "yellow"];
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const specialTypes = ["Wild", "Wild4"];

    let deck = [];
    let id = 0;

    // Add colored number cards
    colors.forEach(color => {
        values.forEach(value => {
            // Add two of each card except 0's (UNO rules)
            deck.push({
                id: `${color}-${value}-${id++}`,
                color,
                value,
                type: "number"
            });

            if (value !== "0") {
                deck.push({
                    id: `${color}-${value}-${id++}`,
                    color,
                    value,
                    type: "number"
                });
            }
        });
    });

    // Add special cards (wild and +4)
    specialTypes.forEach(value => {
        for (let i = 0; i < 4; i++) {
            deck.push({
                id: `special-${value}-${id++}`,
                color: "wild",
                value,
                type: "special"
            });
        }
    });

    // Shuffle the deck
    return shuffleDeck(deck);
}

/**
 * Shuffles a deck of cards
 * @param {Array} deck The deck to shuffle
 * @returns {Array} The shuffled deck
 */
function shuffleDeck(deck) {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
}

/**
 * Deals cards to players
 * @param {Array} deck The deck to deal from
 * @param {Number} numPlayers Number of players
 * @returns {Object} Object containing hands, remaining deck, and discard pile
 */
export function dealCards(deck, numPlayers) {
    const hands = Array(numPlayers).fill().map(() => []);
    const newDeck = [...deck];

    // Deal 7 cards to each player
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < numPlayers; j++) {
            if (newDeck.length > 0) {
                hands[j].push(newDeck.pop());
            }
        }
    }

    // First card for discard pile
    // If it's a wild card, we need a non-wild card for the initial discard
    let discardPile = [];
    let initialCard;

    do {
        initialCard = newDeck.pop();
        if (initialCard.type !== "special") {
            discardPile.push(initialCard);
            break;
        } else {
            // Put the wild card back and shuffle
            newDeck.push(initialCard);
            shuffleDeck(newDeck);
        }
    } while (true);

    return { hands, deck: newDeck, discardPile };
}

/**
 * Checks if a card can be played on top of another
 * @param {Object} card The card to play
 * @param {Object} topCard The card on top of the discard pile
 * @param {String} currentColor The current active color
 * @returns {Boolean} Whether the card can be played
 */
export function canPlayCard(card, topCard, currentColor) {
    // Wild cards can always be played
    if (card.type === "special") {
        return true;
    }

    // Match color or value
    return (
        card.color === currentColor ||
        (topCard && card.value === topCard.value)
    );
}

/**
 * Applies the effect of a played card to the game state
 * @param {Object} gameState Current game state
 * @param {Object} card The card being played
 * @returns {Object} Updated game info (nextPlayer, direction, drawCount)
 */
export function applyCardEffect(gameState, card) {
    const { currentPlayer, direction, players } = gameState;
    const totalPlayers = players.length;

    // Default values
    let nextPlayer = (currentPlayer + direction) % totalPlayers;
    if (nextPlayer < 0) nextPlayer += totalPlayers; // Handle negative values for reverse
    let newDirection = direction;
    let drawCount = 0;

    // Handle special cards
    if (card.type === "special") {
        // Wild+4: Next player draws 4 cards and loses their turn
        if (card.value === "Wild4") {
            drawCount = 4;
            nextPlayer = (nextPlayer + direction) % totalPlayers;
            if (nextPlayer < 0) nextPlayer += totalPlayers;
        }
    }

    return {
        nextPlayer,
        direction: newDirection,
        drawCount
    };
}

/**
 * For online play, we would use these functions to call the server API
 */
export async function fetchGameState(gameID, playerID) {
    try {
        return await GameAPI.getGameState(gameID, playerID);
    } catch (error) {
        console.error("Failed to fetch game state:", error);
        return null;
    }
}

export async function playCardOnline(gameID, playerID, card) {
    try {
        return await GameAPI.placeCard(gameID, playerID, card);
    } catch (error) {
        console.error("Failed to play card:", error);
        return null;
    }
}

export async function drawCardOnline(gameID, playerID) {
    try {
        return await GameAPI.drawCard(gameID, playerID);
    } catch (error) {
        console.error("Failed to draw card:", error);
        return null;
    }
}