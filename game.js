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
