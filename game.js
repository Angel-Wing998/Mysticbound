const cardDatabase = [
    { name: "Fireball", cost: 3, power: 5, type: "attack" },
    { name: "Ice Shard", cost: 2, power: 3, type: "attack" },
    { name: "Lightning", cost: 4, power: 6, type: "attack" },
    { name: "Heal Spell", cost: 2, power: 0, type: "heal" },
    { name: "Shield", cost: 1, power: 2, type: "defend" },
    { name: "Dark Curse", cost: 3, power: 4, type: "attack" },
    { name: "Arcane Missile", cost: 1, power: 2, type: "attack" },
    { name: "Greater Heal", cost: 4, power: 0, type: "heal" }
];

let gameState = {
    playerHealth: 20,
    playerMana: 5,
    playerMaxMana: 5,
    enemyHealth: 20,
    enemyMana: 5,
    enemyMaxMana: 5,
    playerHand: [],
    enemyHand: [],
    playerField: [],
    enemyField: [],
    turn: 0, // 0 = player, 1 = enemy
    gameOver: false
};

function getRandomCard() {
    return JSON.parse(JSON.stringify(cardDatabase[Math.floor(Math.random() * cardDatabase.length)]));
}

function drawCard(isPlayer) {
    const card = getRandomCard();
    if (isPlayer) {
        gameState.playerHand.push(card);
    } else {
        gameState.enemyHand.push(card);
    }
    updateUI();
}

function playCard(cardIndex) {
    if (gameState.turn !== 0) {
        showMessage("Not your turn!");
        return;
    }

    const card = gameState.playerHand[cardIndex];

    if (card.cost > gameState.playerMana) {
        showMessage("Not enough mana!");
        return;
    }

    gameState.playerMana -= card.cost;
    gameState.playerField.push(card);
    gameState.playerHand.splice(cardIndex, 1);

    if (card.type === "attack") {
        gameState.enemyHealth -= card.power;
        showMessage(`Enemy took ${card.power} damage!`);
    } else if (card.type === "heal") {
        gameState.playerHealth = Math.min(gameState.playerHealth + card.power + 3, 20);
        showMessage(`You healed for ${card.power + 3}!`);
    }

    if (gameState.enemyHealth <= 0) {
        endGame(true);
        return;
    }

    updateUI();
}

function endTurn() {
    if (gameState.turn !== 0) return;

    gameState.turn = 1;
    gameState.playerField = [];
    gameState.playerMana = gameState.playerMaxMana;

    showMessage("Enemy's turn...");
    setTimeout(enemyTurn, 1500);
}

function enemyTurn() {
    gameState.playerField = [];

    // Enemy plays a random card
    if (gameState.enemyHand.length > 0 && Math.random() > 0.3) {
        const cardIndex = Math.floor(Math.random() * gameState.enemyHand.length);
        const card = gameState.enemyHand[cardIndex];

        if (card.cost <= gameState.enemyMana) {
            gameState.enemyMana -= card.cost;
            gameState.enemyField.push(card);
            gameState.enemyHand.splice(cardIndex, 1);

            if (card.type === "attack") {
                gameState.playerHealth -= card.power;
                showMessage(`You took ${card.power} damage!`);
            }
        }
    }

    if (gameState.playerHealth <= 0) {
        endGame(false);
        return;
    }

    gameState.turn = 0;
    gameState.enemyField = [];
    gameState.enemyMana = gameState.enemyMaxMana;
    gameState.playerMana = gameState.playerMaxMana;

    showMessage("Your turn!");
    updateUI();
}

function endGame(playerWon) {
    gameState.gameOver = true;
    showMessage(playerWon ? "🎉 You Win! 🎉" : "💀 You Lose! 💀");
}

function resetGame() {
    gameState = {
        playerHealth: 20,
        playerMana: 5,
        playerMaxMana: 5,
        enemyHealth: 20,
        enemyMana: 5,
        enemyMaxMana: 5,
        playerHand: [],
        enemyHand: [],
        playerField: [],
        enemyField: [],
        turn: 0,
        gameOver: false
    };

    for (let i = 0; i < 3; i++) {
        drawCard(true);
        drawCard(false);
    }

    showMessage("New game started!");
    updateUI();
}

function showMessage(msg) {
    document.getElementById("message").textContent = msg;
}

function updateUI() {
    // Update stats
    document.getElementById("playerHealth").textContent = Math.max(gameState.playerHealth, 0);
    document.getElementById("playerMana").textContent = gameState.playerMana;
    document.getElementById("enemyHealth").textContent = Math.max(gameState.enemyHealth, 0);
    document.getElementById("enemyMana").textContent = gameState.enemyMana;

    // Update hand
    const handDiv = document.getElementById("hand");
    handDiv.innerHTML = "";
    gameState.playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, index, true);
        handDiv.appendChild(cardEl);
    });

    // Update fields
    const playerFieldDiv = document.getElementById("playerField");
    playerFieldDiv.innerHTML = "";
    gameState.playerField.forEach(card => {
        const cardEl = createCardElement(card, -1, false);
        cardEl.classList.add("field-card");
        playerFieldDiv.appendChild(cardEl);
    });

    const enemyFieldDiv = document.getElementById("enemyField");
    enemyFieldDiv.innerHTML = "";
    gameState.enemyField.forEach(card => {
        const cardEl = createCardElement(card, -1, false);
        cardEl.classList.add("field-card");
        enemyFieldDiv.appendChild(cardEl);
    })const cardDatabase = [
    { name: "Fireball", cost: 3, power: 5, type: "attack", rarity: "common" },
    { name: "Ice Shard", cost: 2, power: 3, type: "attack", rarity: "common" },
    { name: "Lightning", cost: 4, power: 6, type: "attack", rarity: "rare" },
    { name: "Heal Spell", cost: 2, power: 0, type: "heal", rarity: "common" },
    { name: "Shield", cost: 1, power: 2, type: "defend", rarity: "common" },
    { name: "Dark Curse", cost: 3, power: 4, type: "attack", rarity: "rare" },
    { name: "Arcane Missile", cost: 1, power: 2, type: "attack", rarity: "common" },
    { name: "Greater Heal", cost: 4, power: 0, type: "heal", rarity: "rare" },
    { name: "Meteor Storm", cost: 5, power: 8, type: "attack", rarity: "epic" },
    { name: "Holy Light", cost: 5, power: 0, type: "heal", rarity: "epic" },
    { name: "Inferno", cost: 6, power: 10, type: "attack", rarity: "legendary" },
    { name: "Time Freeze", cost: 4, power: 3, type: "defend", rarity: "epic" },
    { name: "Spark", cost: 1, power: 1, type: "attack", rarity: "common" },
    { name: "Iron Skin", cost: 2, power: 3, type: "defend", rarity: "common" },
    { name: "Poison Cloud", cost: 3, power: 4, type: "attack", rarity: "rare" },
    { name: "Divine Shield", cost: 3, power: 5, type: "defend", rarity: "rare" },
    { name: "Soul Drain", cost: 4, power: 5, type: "attack", rarity: "epic" },
    { name: "Resurrection", cost: 5, power: 0, type: "heal", rarity: "epic" }
];

let playerData = {
    level: 1,
    xp: 0,
    gold: 0,
    collection: {},
    deck: []
};

let gameState = {
    playerHealth: 20,
    playerMana: 5,
    playerMaxMana: 5,
    enemyHealth: 20,
    enemyMana: 5,
    enemyMaxMana: 5,
    playerHand: [],
    enemyHand: [],
    playerField: [],
    enemyField: [],
    turn: 0,
    gameOver: false
};

// Initialize collection
function initializeCollection() {
    const saved = localStorage.getItem("mysticbound_player");
    if (saved) {
        playerData = JSON.parse(saved);
    } else {
        cardDatabase.forEach(card => {
            playerData.collection[card.name] = 3;
        });
        playerData.deck = generateStarterDeck();
        savePlayerData();
    }
}

function generateStarterDeck() {
    const deck = [];
    const starterCards = ["Fireball", "Ice Shard", "Heal Spell", "Shield", "Arcane Missile"];
    for (let i = 0; i < 30; i++) {
        const card = starterCards[i % starterCards.length];
        deck.push(card);
    }
    return deck;
}

function savePlayerData() {
    localStorage.setItem("mysticbound_player", JSON.stringify(playerData));
}

function getRandomCard() {
    if (playerData.deck.length === 0) {
        playerData.deck = generateStarterDeck();
    }
    const cardName = playerData.deck[Math.floor(Math.random() * playerData.deck.length)];
    const template = cardDatabase.find(c => c.name === cardName);
    return JSON.parse(JSON.stringify(template));
}

function drawCard(isPlayer) {
    const card = getRandomCard();
    if (isPlayer) {
        gameState.playerHand.push(card);
    } else {
        gameState.enemyHand.push(card);
    }
    updateUI();
}

function playCard(cardIndex) {
    if (gameState.turn !== 0) {
        showMessage("Not your turn!");
        return;
    }

    const card = gameState.playerHand[cardIndex];

    if (card.cost > gameState.playerMana) {
        showMessage("Not enough mana!");
        return;
    }

    gameState.playerMana -= card.cost;
    gameState.playerField.push(card);
    gameState.playerHand.splice(cardIndex, 1);

    if (card.type === "attack") {
        gameState.enemyHealth -= card.power;
        showMessage(`🔥 Enemy took ${card.power} damage!`);
    } else if (card.type === "heal") {
        gameState.playerHealth = Math.min(gameState.playerHealth + card.power + 3, 20);
        showMessage(`💚 You healed for ${card.power + 3}!`);
    }

    if (gameState.enemyHealth <= 0) {
        endGame(true);
        return;
    }

    updateUI();
}

function endTurn() {
    if (gameState.turn !== 0 || gameState.gameOver) return;

    gameState.turn = 1;
    gameState.playerField = [];
    gameState.playerMana = gameState.playerMaxMana;

    showMessage("⏳ Enemy's turn...");
    setTimeout(enemyTurn, 1500);
}

function enemyTurn() {
    gameState.playerField = [];

    if (gameState.enemyHand.length > 0 && Math.random() > 0.3) {
        const cardIndex = Math.floor(Math.random() * gameState.enemyHand.length);
        const card = gameState.enemyHand[cardIndex];

        if (card.cost <= gameState.enemyMana) {
            gameState.enemyMana -= card.cost;
            gameState.enemyField.push(card);
            gameState.enemyHand.splice(cardIndex, 1);

            if (card.type === "attack") {
                gameState.playerHealth -= card.power;
                showMessage(`⚔️ You took ${card.power} damage!`);
            }
        }
    }

    if (gameState.playerHealth <= 0) {
        endGame(false);
        return;
    }

    gameState.turn = 0;
    gameState.enemyField = [];
    gameState.enemyMana = gameState.enemyMaxMana;
    gameState.playerMana = gameState.playerMaxMana;

    showMessage("Your turn!");
    updateUI();
}

function endGame(playerWon) {
    gameState.gameOver = true;
    
    if (playerWon) {
        playerData.xp += 50;
        playerData.gold += 25;
        showMessage("🎉 Victory! +50 XP +25 Gold");
        
        if (playerData.xp >= 100) {
            playerData.level++;
            playerData.xp -= 100;
            showMessage("🎉 Level Up! You are now Level " + playerData.level);
        }
    } else {
        playerData.xp += 10;
        playerData.gold += 5;
        showMessage("💀 Defeat... +10 XP +5 Gold");
    }
    
    savePlayerData();
    updateStats();
}

function resetGame() {
    gameState = {
        playerHealth: 20,
        playerMana: 5,
        playerMaxMana: 5,
        enemyHealth: 20,
        enemyMana: 5,
        enemyMaxMana: 5,
        playerHand: [],
        enemyHand: [],
        playerField: [],
        enemyField: [],
        turn: 0,
        gameOver: false
    };

    for (let i = 0; i < 3; i++) {
        drawCard(true);
        drawCard(false);
    }

    showMessage("New battle started!");
    updateUI();
}

function showMessage(msg) {
    document.getElementById("message").textContent = msg;
}

function updateStats() {
    document.getElementById("playerLevel").textContent = playerData.level;
    document.getElementById("playerXP").textContent = playerData.xp;
    document.getElementById("playerGold").textContent = playerData.gold;
}

function updateUI() {
    updateStats();

    document.getElementById("playerHealth").textContent = Math.max(gameState.playerHealth, 0);
    document.getElementById("playerMana").textContent = gameState.playerMana;
    document.getElementById("enemyHealth").textContent = Math.max(gameState.enemyHealth, 0);
    document.getElementById("enemyMana").textContent = gameState.enemyMana;

    const handDiv = document.getElementById("hand");
    handDiv.innerHTML = "";
    gameState.playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, index, true);
        handDiv.appendChild(cardEl);
    });

    const playerFieldDiv = document.getElementById("playerField");
    playerFieldDiv.innerHTML = "";
    gameState.playerField.forEach(card => {
        const cardEl = createCardElement(card, -1, false);
        cardEl.classList.add("field-card");
        playerFieldDiv.appendChild(cardEl);
    });

    const enemyFieldDiv = document.getElementById("enemyField");
    enemyFieldDiv.innerHTML = "";
    gameState.enemyField.forEach(card => {
        const cardEl = createCardElement(card, -1, false);
        cardEl.classList.add("field-card");
        enemyFieldDiv.appendChild(cardEl);
    });
}

function createCardElement(card, index, isClickable) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">Cost: ${card.cost}</div>
        <div class="card-power">${card.type === "heal" ? "Heal: " + (card.power + 3) : "Power: " + card.power}</div>
    `;

    if (isClickable) {
        div.style.cursor = "pointer";
        div.onclick = () => playCard(index);
    }

    return div;
}

// COLLECTION UI
function renderCollection(filter = "all") {
    const collectionDiv = document.getElementById("collection");
    collectionDiv.innerHTML = "";

    Object.entries(playerData.collection).forEach(([cardName, count]) => {
        const card = cardDatabase.find(c => c.name === cardName);
        if (!card || (filter !== "all" && card.type !== filter)) return;

        const div = document.createElement("div");
        div.className = `collection-card rarity-${card.rarity}`;
        div.innerHTML = `
            <div class="card-name">${cardName}</div>
            <div class="card-cost">Cost: ${card.cost}</div>
            <div class="card-power">Power: ${card.power}</div>
            <div class="card-count">${count}</div>
        `;
        collectionDiv.appendChild(div);
    });
}

// DECK BUILDER
function renderDeckBuilder() {
    const availableDiv = document.getElementById("availableCards");
    availableDiv.innerHTML = "";

    cardDatabase.forEach(card => {
        const deckCount = playerData.deck.filter(c => c === card.name).length;
        const have = playerData.collection[card.name] || 0;

        const div = document.createElement("div");
        div.className = "deck-card";
        div.innerHTML = `
            <span>${card.name} (Have: ${have})</span>
            <div class="deck-card-count">${deckCount}</div>
        `;

        if (deckCount < have) {
            div.onclick = () => addCardToDeck(card.name);
        } else {
            div.style.opacity = "0.5";
            div.style.cursor = "default";
        }

        availableDiv.appendChild(div);
    });

    renderCurrentDeck();
}

function addCardToDeck(cardName) {
    if (playerData.deck.length < 30) {
        playerData.deck.push(cardName);
        renderDeckBuilder();
    }
}

function removeCardFromDeck(cardName) {
    const index = playerData.deck.indexOf(cardName);
    if (index > -1) {
        playerData.deck.splice(index, 1);
        renderDeckBuilder();
    }
}

function renderCurrentDeck() {
    const currentDiv = document.getElementById("currentDeck");
    currentDiv.innerHTML = "";

    const deckCounts = {};
    playerData.deck.forEach(card => {
        deckCounts[card] = (deckCounts[card] || 0) + 1;
    });

    Object.entries(deckCounts).forEach(([cardName, count]) => {
        const div = document.createElement("div");
        div.className = "deck-card";
        div.innerHTML = `
            <span>${cardName}</span>
            <div class="deck-card-count">${count}</div>
        `;
        div.onclick = () => removeCardFromDeck(cardName);
        currentDiv.appendChild(div);
    });

    const deckCount = document.createElement("div");
    deckCount.className = "deck-count";
    deckCount.textContent = `Deck: ${playerData.deck.length}/30`;
    currentDiv.appendChild(deckCount);
}

// TAB SWITCHING
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        document.getElementById(tab + "-tab").classList.add("active");

        if (tab === "collection") renderCollection();
        if (tab === "deck") renderDeckBuilder();
    });
});

// COLLECTION FILTERS
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderCollection(btn.getAttribute("data-filter"));
    });
});

// EVENT LISTENERS
document.getElementById("endTurnBtn").addEventListener("click", endTurn);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("saveDeckBtn").addEventListener("click", () => {
    savePlayerData();
    alert("Deck saved!");
});

// Initialize
initializeCollection();
resetGame();
renderCollection();

}

function createCardElement(card, index, isClickable) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">Cost: ${card.cost}</div>
        <div class="card-power">${card.type === "heal" ? "Heal: " + (card.power + 3) : "Power: " + card.power}</div>
    `;

    if (isClickable) {
        div.style.cursor = "pointer";
        div.onclick = () => playCard(index);
    }

    return div;
}

// Event listeners
document.getElementById("drawBtn").addEventListener("click", () => {
    if (!gameState.gameOver && gameState.turn === 0) {
        drawCard(true);
    }
});

document.getElementById("endTurnBtn").addEventListener("click", endTurn);
document.getElementById("resetBtn").addEventListener("click", resetGame);

// Start the game
resetGame();


