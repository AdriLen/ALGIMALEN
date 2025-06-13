document.addEventListener("DOMContentLoaded", function () {
  const gameState = {
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    tableCards: [],
    round: 1,
    maxRounds: 3,
    selectedHandCard: null,
    selectedTableCards: [],
    gameOver: false,
    difficulty: 1,
    equalitiesRemaining: 20,
    totalEqualities: 20,
  };

  const validEqualitiesByLevel = {
    1: [
      { factored: "(x+1)(x+2)", expanded: "x²+3x+2" },
      { factored: "(x+3)(x+1)", expanded: "x²+4x+3" },
      { factored: "(x+2)(x+3)", expanded: "x²+5x+6" },
      { factored: "(x+4)(x+1)", expanded: "x²+5x+4" },
      { factored: "(x-1)(x-2)", expanded: "x²-3x+2" },
      { factored: "(x-3)(x-1)", expanded: "x²-4x+3" },
      { factored: "(x-2)(x-3)", expanded: "x²-5x+6" },
      { factored: "(x-4)(x-1)", expanded: "x²-5x+4" },
      { factored: "(x+1)(x-2)", expanded: "x²-x-2" },
      { factored: "(x+3)(x-1)", expanded: "x²+2x-3" },
      { factored: "(x+2)(x-3)", expanded: "x²-x-6" },
      { factored: "(x+4)(x-1)", expanded: "x²+3x-4" },
      { factored: "(x+5)(x+2)", expanded: "x²+7x+10" },
      { factored: "(x+6)(x+1)", expanded: "x²+7x+6" },
      { factored: "(x-5)(x-2)", expanded: "x²-7x+10" },
      { factored: "(x-6)(x-1)", expanded: "x²-7x+6" },
      { factored: "(x+5)(x-2)", expanded: "x²+3x-10" },
      { factored: "(x+6)(x-1)", expanded: "x²+5x-6" },
      { factored: "(x-5)(x+2)", expanded: "x²-3x-10" },
      { factored: "(x-6)(x+1)", expanded: "x²-5x-6" },
    ],
    2: [
      { factored: "2(x+1)(x+2)", expanded: "2x²+6x+4" },
      { factored: "3(x+3)(x+1)", expanded: "3x²+12x+9" },
      { factored: "2(x+2)(x+3)", expanded: "2x²+10x+12" },
      { factored: "3(x+4)(x+1)", expanded: "3x²+15x+12" },
      { factored: "2(x-1)(x-2)", expanded: "2x²-6x+4" },
      { factored: "3(x-3)(x-1)", expanded: "3x²-12x+9" },
      { factored: "2(x-2)(x-3)", expanded: "2x²-10x+12" },
      { factored: "3(x-4)(x-1)", expanded: "3x²-15x+12" },
      { factored: "2(x+1)(x-2)", expanded: "2x²-2x-4" },
      { factored: "3(x+3)(x-1)", expanded: "3x²+6x-9" },
      { factored: "2(x+2)(x-3)", expanded: "2x²-2x-12" },
      { factored: "3(x+4)(x-1)", expanded: "3x²+9x-12" },
      { factored: "4(x+1)(x+2)", expanded: "4x²+12x+8" },
      { factored: "5(x+3)(x+1)", expanded: "5x²+20x+15" },
      { factored: "4(x-1)(x-2)", expanded: "4x²-12x+8" },
      { factored: "5(x-3)(x-1)", expanded: "5x²-20x+15" },
      { factored: "4(x+1)(x-2)", expanded: "4x²-4x-8" },
      { factored: "5(x+3)(x-1)", expanded: "5x²+10x-15" },
      { factored: "4(x+2)(x-3)", expanded: "4x²-4x-24" },
      { factored: "5(x+4)(x-1)", expanded: "5x²+15x-20" },
    ],
    3: [
      { factored: "(x+y)(x-y)", expanded: "x²-y²" },
      { factored: "(2x+3)(2x-3)", expanded: "4x²-9" },
      { factored: "(3x+2)(3x-2)", expanded: "9x²-4" },
      { factored: "(4x+5)(4x-5)", expanded: "16x²-25" },
      { factored: "(x+y)²", expanded: "x²+2xy+y²" },
      { factored: "(x-y)²", expanded: "x²-2xy+y²" },
      { factored: "(2x+3)²", expanded: "4x²+12x+9" },
      { factored: "(2x-3)²", expanded: "4x²-12x+9" },
      { factored: "(3x+2)²", expanded: "9x²+12x+4" },
      { factored: "(3x-2)²", expanded: "9x²-12x+4" },
      { factored: "(x+y)(x²-xy+y²)", expanded: "x³+y³" },
      { factored: "(x-y)(x²+xy+y²)", expanded: "x³-y³" },
      { factored: "(2x+1)(4x²-2x+1)", expanded: "8x³+1" },
      { factored: "(2x-1)(4x²+2x+1)", expanded: "8x³-1" },
      { factored: "(x+1)³", expanded: "x³+3x²+3x+1" },
      { factored: "(x-1)³", expanded: "x³-3x²+3x-1" },
      { factored: "(x+2)³", expanded: "x³+6x²+12x+8" },
      { factored: "(x-2)³", expanded: "x³-6x²+12x-8" },
      { factored: "(2x+1)³", expanded: "8x³+12x²+6x+1" },
      { factored: "(2x-1)³", expanded: "8x³-12x²+6x-1" },
    ],
  };

  const cardsByDifficulty = {
    1: [
      "(x+1)(x+2)",
      "(x+3)(x+1)",
      "(x+2)(x+3)",
      "(x+4)(x+1)",
      "(x-1)(x-2)",
      "(x-3)(x-1)",
      "(x-2)(x-3)",
      "(x-4)(x-1)",
      "(x+1)(x-2)",
      "(x+3)(x-1)",
      "(x+2)(x-3)",
      "(x+4)(x-1)",
      "(x+5)(x+2)",
      "(x+6)(x+1)",
      "(x-5)(x-2)",
      "(x-6)(x-1)",
      "(x+5)(x-2)",
      "(x+6)(x-1)",
      "(x-5)(x+2)",
      "(x-6)(x+1)",
      "x²+3x+2",
      "x²+4x+3",
      "x²+5x+6",
      "x²+5x+4",
      "x²-3x+2",
      "x²-4x+3",
      "x²-5x+6",
      "x²-5x+4",
      "x²-x-2",
      "x²+2x-3",
      "x²-x-6",
      "x²+3x-4",
      "x²+7x+10",
      "x²+7x+6",
      "x²-7x+10",
      "x²-7x+6",
      "x²+3x-10",
      "x²+5x-6",
      "x²-3x-10",
      "x²-5x-6",
    ],
    2: [
      "2(x+1)(x+2)",
      "3(x+3)(x+1)",
      "2(x+2)(x+3)",
      "3(x+4)(x+1)",
      "2(x-1)(x-2)",
      "3(x-3)(x-1)",
      "2(x-2)(x-3)",
      "3(x-4)(x-1)",
      "2(x+1)(x-2)",
      "3(x+3)(x-1)",
      "2(x+2)(x-3)",
      "3(x+4)(x-1)",
      "4(x+1)(x+2)",
      "5(x+3)(x+1)",
      "4(x-1)(x-2)",
      "5(x-3)(x-1)",
      "4(x+1)(x-2)",
      "5(x+3)(x-1)",
      "4(x+2)(x-3)",
      "5(x+4)(x-1)",
      "2x²+6x+4",
      "3x²+12x+9",
      "2x²+10x+12",
      "3x²+15x+12",
      "2x²-6x+4",
      "3x²-12x+9",
      "2x²-10x+12",
      "3x²-15x+12",
      "2x²-2x-4",
      "3x²+6x-9",
      "2x²-2x-12",
      "3x²+9x-12",
      "4x²+12x+8",
      "5x²+20x+15",
      "4x²-12x+8",
      "5x²-20x+15",
      "4x²-4x-8",
      "5x²+10x-15",
      "4x²-4x-24",
      "5x²+15x-20",
    ],
    3: [
      "(x+y)(x-y)",
      "(2x+3)(2x-3)",
      "(3x+2)(3x-2)",
      "(4x+5)(4x-5)",
      "x²-y²",
      "4x²-9",
      "9x²-4",
      "16x²-25",
      "(x+y)²",
      "(x-y)²",
      "(2x+3)²",
      "(2x-3)²",
      "(3x+2)²",
      "(3x-2)²",
      "x²+2xy+y²",
      "x²-2xy+y²",
      "4x²+12x+9",
      "4x²-12x+9",
      "9x²+12x+4",
      "9x²-12x+4",
      "(x+y)(x²-xy+y²)",
      "(x-y)(x²+xy+y²)",
      "(2x+1)(4x²-2x+1)",
      "(2x-1)(4x²+2x+1)",
      "x³+y³",
      "x³-y³",
      "8x³+1",
      "8x³-1",
      "(x+1)³",
      "(x-1)³",
      "(x+2)³",
      "(x-2)³",
      "(2x+1)³",
      "(2x-1)³",
      "x³+3x²+3x+1",
      "x³-3x²+3x-1",
      "x³+6x²+12x+8",
      "x³-6x²+12x-8",
      "8x³+12x²+6x+1",
      "8x³-12x²+6x-1",
    ],
  };

  const levelDescriptions = {
    1: "Nivel 1: Trinomios de la forma x² + bx + c",
    2: "Nivel 2: Trinomios de la forma ax² + bx + c",
    3: "Nivel 3: Casos especiales",
  };

  function formatCardValue(value) {
    return value
      .replace(/\^2/g, "<sup>2</sup>")
      .replace(/\^3/g, "<sup>3</sup>")
      .replace(/²/g, "<sup>2</sup>")
      .replace(/³/g, "<sup>3</sup>")
      .replace(/\*/g, "&times;")
      .replace(/([a-zA-Z])(\d+)/g, "$1<sub>$2</sub>");
  }

  function createDeck(difficulty) {
    const cards = cardsByDifficulty[difficulty];
    const deck = [];
    cards.forEach((value) => {
      deck.push({ id: `${value}`, value: value });
    });
    return deck;
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function createCardElement(card, location) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.id = card.id;
    cardDiv.dataset.value = card.value;

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";

    if (card.value.length > 12) {
      cardFront.style.fontSize = "12px";
    }

    if (card.value === "=") {
      cardFront.style.fontSize = "24px";
      cardFront.style.fontWeight = "bold";
    }

    cardFront.innerHTML = formatCardValue(card.value);

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardDiv.appendChild(cardInner);

    if (location === "hand" && !gameState.gameOver) {
      cardDiv.addEventListener("click", () => {
        if (
          gameState.selectedHandCard &&
          gameState.selectedHandCard.id === card.id
        ) {
          gameState.selectedHandCard = null;
          cardDiv.querySelector(".card-front").classList.remove("selected");
        } else {
          const handCards = document.querySelectorAll(".player-hand .card");
          handCards.forEach((c) =>
            c.querySelector(".card-front").classList.remove("selected")
          );
          gameState.selectedHandCard = card;
          cardDiv.querySelector(".card-front").classList.add("selected");
        }
        updateEquationDisplay();
        updateButtonStates();
      });
    } else if (location === "table" && !gameState.gameOver) {
      cardDiv.addEventListener("click", () => {
        const isSelected = gameState.selectedTableCards.some(
          (c) => c.id === card.id
        );
        if (isSelected) {
          gameState.selectedTableCards = gameState.selectedTableCards.filter(
            (c) => c.id !== card.id
          );
          cardDiv.querySelector(".card-front").classList.remove("selected");
        } else {
          gameState.selectedTableCards.push(card);
          cardDiv.querySelector(".card-front").classList.add("selected");
        }
        updateEquationDisplay();
        updateButtonStates();
      });
    }
    return cardDiv;
  }

  function createPlayerAreaElement(player, isCurrentPlayer) {
    const playerDiv = document.createElement("div");
    playerDiv.className = `player-area ${
      isCurrentPlayer ? "bg-blue-200" : "bg-gray-100"
    } p-4 mb-4 relative`;

    const headerDiv = document.createElement("div");
    headerDiv.className = "flex justify-between items-center mb-3";

    const nameDiv = document.createElement("h3");
    nameDiv.className = `text-lg font-semibold ${
      isCurrentPlayer ? "text-blue-800" : "text-gray-700"
    }`;
    nameDiv.textContent = player.name;

    const scoreDiv = document.createElement("div");
    scoreDiv.className = "bg-blue-600 text-white px-3 py-1 rounded-lg";
    scoreDiv.textContent = `Puntos: ${player.score}`;

    headerDiv.appendChild(nameDiv);
    headerDiv.appendChild(scoreDiv);
    playerDiv.appendChild(headerDiv);

    const handDiv = document.createElement("div");
    handDiv.className = "player-hand flex gap-3 mb-3";

    if (isCurrentPlayer) {
      player.hand.forEach((card) => {
        const cardElement = createCardElement(card, "hand");
        handDiv.appendChild(cardElement);
      });
    } else {
      player.hand.forEach(() => {
        const cardBack = document.createElement("div");
        cardBack.className = "card";
        const cardInner = document.createElement("div");
        cardInner.className = "card-inner";
        cardInner.style.transform = "rotateY(180deg)";
        const cardFront = document.createElement("div");
        cardFront.className = "card-front";
        const cardBackFace = document.createElement("div");
        cardBackFace.className = "card-back";
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBackFace);
        cardBack.appendChild(cardInner);
        handDiv.appendChild(cardBack);
      });
    }
    playerDiv.appendChild(handDiv);

    if (player.pile.length > 0) {
      const pileHeader = document.createElement("h4");
      pileHeader.className = "text-sm font-medium text-gray-600 mb-2";
      pileHeader.textContent = "Pozo:";
      playerDiv.appendChild(pileHeader);

      const pileDiv = document.createElement("div");
      pileDiv.className = "player-pile flex flex-wrap gap-2";

      const pileGroups = [];
      let currentGroup = [];
      player.pile.forEach((card) => {
        if (card.newEquation) {
          if (currentGroup.length > 0) {
            pileGroups.push([...currentGroup]);
          }
          currentGroup = [card];
        } else {
          currentGroup.push(card);
        }
      });
      if (currentGroup.length > 0) {
        pileGroups.push(currentGroup);
      }
      pileGroups.forEach((group) => {
        const groupDiv = document.createElement("div");
        groupDiv.className =
          "pile-group bg-white p-2 rounded-lg flex gap-1 items-center";
        group.forEach((card) => {
          const miniCard = document.createElement("div");
          miniCard.className = "mini-card";
          miniCard.innerHTML = formatCardValue(card.value);
          groupDiv.appendChild(miniCard);
        });
        pileDiv.appendChild(groupDiv);
      });
      playerDiv.appendChild(pileDiv);
    }
    if (isCurrentPlayer) {
      const indicator = document.createElement("div");
      indicator.className =
        "absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full pulse";
      playerDiv.appendChild(indicator);
    }
    return playerDiv;
  }

  function updateEquationDisplay() {
    const equationDisplay = document.getElementById("equation-display");
    if (
      !gameState.selectedHandCard &&
      gameState.selectedTableCards.length === 0
    ) {
      equationDisplay.textContent =
        "Selecciona cartas para formar una igualdad";
      return;
    }
    let equation = "";
    if (gameState.selectedHandCard) {
      equation += gameState.selectedHandCard.value + " ";
    }
    if (gameState.selectedTableCards.length > 0) {
      equation += gameState.selectedTableCards
        .map((card) => card.value)
        .join(" ");
    }
    equationDisplay.innerHTML = formatCardValue(equation);
  }

  function updateButtonStates() {
    const verifyBtn = document.getElementById("verify-btn");
    const addToTableBtn = document.getElementById("add-to-table-btn");
    const endTurnBtn = document.getElementById("end-turn-btn");
    verifyBtn.disabled =
      !gameState.selectedHandCard || gameState.selectedTableCards.length === 0;
    verifyBtn.classList.toggle("opacity-50", verifyBtn.disabled);
    addToTableBtn.disabled =
      !gameState.selectedHandCard || gameState.selectedTableCards.length > 0;
    addToTableBtn.classList.toggle("opacity-50", addToTableBtn.disabled);
    endTurnBtn.disabled = false;
  }

  function addToGameLog(message) {
    const gameLog = document.getElementById("game-log");
    const logEntry = document.createElement("div");
    logEntry.className = "mb-1";
    logEntry.textContent = message;
    gameLog.appendChild(logEntry);
    gameLog.scrollTop = gameLog.scrollHeight;
  }

  function verifyEquality() {
    if (
      !gameState.selectedHandCard ||
      gameState.selectedTableCards.length === 0
    ) {
      return false;
    }
    const allCards = [
      gameState.selectedHandCard,
      ...gameState.selectedTableCards,
    ];
    const cardValues = allCards.map((card) => card.value);
    if (!cardValues.includes("=")) {
      return false;
    }
    const equalsIndex = cardValues.indexOf("=");
    const leftSide = cardValues.slice(0, equalsIndex);
    const rightSide = cardValues.slice(equalsIndex + 1);
    if (leftSide.length === 0 || rightSide.length === 0) {
      return false;
    }
    const validEqualities = validEqualitiesByLevel[gameState.difficulty];
    const leftExpr = leftSide.join("");
    const rightExpr = rightSide.join("");
    for (const equality of validEqualities) {
      if (
        (leftExpr === equality.factored && rightExpr === equality.expanded) ||
        (leftExpr === equality.expanded && rightExpr === equality.factored)
      ) {
        return true;
      }
    }
    return false;
  }

  function calculateScore(cards) {
    let score = 0;
    cards.forEach((card) => {
      const value = card.value;
      score += (value.match(/x/g) || []).length;
      score += (value.match(/y/g) || []).length;
      score += (value.match(/z/g) || []).length;
    });
    return score;
  }

  function endTurn() {
    gameState.selectedHandCard = null;
    gameState.selectedTableCards = [];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (gameState.deck.length > 0 && currentPlayer.hand.length < 3) {
      currentPlayer.hand.push(gameState.deck.pop());
    }
    gameState.currentPlayerIndex =
      (gameState.currentPlayerIndex + 1) % gameState.players.length;
    if (gameState.currentPlayerIndex === 0) {
      gameState.round++;
      if (
        gameState.round > gameState.maxRounds ||
        gameState.deck.length === 0 ||
        gameState.equalitiesRemaining <= 0
      ) {
        endGame();
        return;
      }
      addToGameLog(`Ronda ${gameState.round} iniciada`);
    }
    addToGameLog(
      `Turno del ${gameState.players[gameState.currentPlayerIndex].name}`
    );
    updateUI();
  }

  function endGame() {
    gameState.gameOver = true;
    gameState.players.forEach((player) => {
      player.score = calculateScore(player.pile);
    });
    let maxScore = -1;
    let winners = [];
    gameState.players.forEach((player) => {
      if (player.score > maxScore) {
        maxScore = player.score;
        winners = [player];
      } else if (player.score === maxScore) {
        winners.push(player);
      }
    });
    updateUI();
    const gameOverModal = document.getElementById("game-over-modal");
    const finalScores = document.getElementById("final-scores");
    const winnerAnnouncement = document.getElementById("winner-announcement");
    finalScores.innerHTML = "";
    gameState.players.forEach((player) => {
      const scoreDiv = document.createElement("div");
      scoreDiv.className = "flex justify-between items-center mb-2";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = player.name;
      const scoreSpan = document.createElement("span");
      scoreSpan.className = "font-bold";
      scoreSpan.textContent = player.score + " puntos";
      scoreDiv.appendChild(nameSpan);
      scoreDiv.appendChild(scoreSpan);
      finalScores.appendChild(scoreDiv);
    });
    if (winners.length === 1) {
      winnerAnnouncement.textContent = `¡${winners[0].name} ha ganado!`;
    } else {
      winnerAnnouncement.textContent =
        "¡Empate entre " + winners.map((w) => w.name).join(", ") + "!";
    }
    gameOverModal.classList.remove("hidden");
    let endReason = "";
    if (gameState.round > gameState.maxRounds) {
      endReason = "se alcanzó el máximo de rondas";
    } else if (gameState.deck.length === 0) {
      endReason = "se agotaron las cartas";
    } else if (gameState.equalitiesRemaining <= 0) {
      endReason = "se formaron todas las igualdades posibles";
    }
    addToGameLog(`¡Fin del juego! (${endReason})`);
  }

  function updateUI() {
    document.getElementById("round-counter").textContent = gameState.round;
    document.getElementById("current-player").textContent =
      gameState.currentPlayerIndex + 1;
    document.getElementById("deck-counter").textContent = gameState.deck.length;
    document.getElementById("equalities-counter").textContent =
      gameState.equalitiesRemaining;
    const tableCardsContainer = document.getElementById("table-cards");
    tableCardsContainer.innerHTML = "";
    gameState.tableCards.forEach((card) => {
      const cardElement = createCardElement(card, "table");
      tableCardsContainer.appendChild(cardElement);
    });
    const playersContainer = document.getElementById("players-container");
    playersContainer.innerHTML = "";
    gameState.players.forEach((player, index) => {
      const isCurrentPlayer = index === gameState.currentPlayerIndex;
      const playerArea = createPlayerAreaElement(player, isCurrentPlayer);
      playersContainer.appendChild(playerArea);
    });
    updateEquationDisplay();
    updateButtonStates();
    updateDifficultyButtons();
  }

  function updateDifficultyButtons() {
    document.querySelectorAll(".difficulty-btn").forEach((btn, index) => {
      const level = index + 1;
      btn.classList.toggle("active", level === gameState.difficulty);
    });
  }

  function initGame(numPlayers, difficulty) {
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.deck = createDeck(difficulty);
    gameState.tableCards = [];
    gameState.round = 1;
    gameState.selectedHandCard = null;
    gameState.selectedTableCards = [];
    gameState.gameOver = false;
    gameState.difficulty = difficulty;
    gameState.equalitiesRemaining = 20;
    gameState.totalEqualities = 20;
    document.getElementById("current-level-display").textContent =
      levelDescriptions[difficulty];
    document.getElementById("equalities-counter").textContent =
      gameState.equalitiesRemaining;
    shuffleDeck(gameState.deck);
    for (let i = 1; i <= numPlayers; i++) {
      gameState.players.push({
        id: i,
        name: `Jugador ${i}`,
        hand: [],
        pile: [],
        score: 0,
      });
    }
    gameState.players.forEach((player) => {
      for (let i = 0; i < 3; i++) {
        if (gameState.deck.length > 0) {
          player.hand.push(gameState.deck.pop());
        }
      }
    });
    gameState.tableCards.push({ id: "equals-1", value: "=" });
    for (let i = 0; i < 3; i++) {
      if (gameState.deck.length > 0) {
        gameState.tableCards.push(gameState.deck.pop());
      }
    }
    updateUI();
    addToGameLog(
      `¡Juego iniciado en ${levelDescriptions[difficulty]}! Turno del Jugador 1`
    );
    document.getElementById("welcome-screen").style.display = "none";
  }

  document.getElementById("verify-btn").addEventListener("click", () => {
    if (
      !gameState.selectedHandCard ||
      gameState.selectedTableCards.length === 0
    ) {
      return;
    }
    const isValid = verifyEquality();
    if (isValid) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      gameState.selectedHandCard.newEquation = true;
      currentPlayer.pile.push(gameState.selectedHandCard);
      gameState.selectedTableCards.forEach((card) => {
        if (card.value !== "=") {
          currentPlayer.pile.push(card);
        }
      });
      currentPlayer.hand = currentPlayer.hand.filter(
        (card) => card.id !== gameState.selectedHandCard.id
      );
      gameState.tableCards = gameState.tableCards.filter(
        (card) =>
          card.value === "=" ||
          !gameState.selectedTableCards.some(
            (selectedCard) => selectedCard.id === card.id
          )
      );
      const algebraicCards = gameState.tableCards.filter(
        (card) => card.value !== "="
      );
      if (algebraicCards.length < 3 && gameState.deck.length > 0) {
        const neededCards = 3 - algebraicCards.length;
        for (let i = 0; i < neededCards && gameState.deck.length > 0; i++) {
          gameState.tableCards.push(gameState.deck.pop());
        }
      }
      currentPlayer.score = calculateScore(currentPlayer.pile);
      gameState.equalitiesRemaining--;
      addToGameLog(
        `${currentPlayer.name} formó una igualdad válida. Quedan ${gameState.equalitiesRemaining} igualdades.`
      );
      if (gameState.equalitiesRemaining <= 0) {
        addToGameLog("¡Se han formado todas las igualdades posibles!");
        endGame();
        return;
      }
      gameState.selectedHandCard = null;
      gameState.selectedTableCards = [];
      endTurn();
    } else {
      addToGameLog(`Igualdad inválida. Intenta de nuevo.`);
      gameState.selectedHandCard = null;
      gameState.selectedTableCards = [];
      updateUI();
    }
  });

  document.getElementById("add-to-table-btn").addEventListener("click", () => {
    if (!gameState.selectedHandCard) {
      return;
    }
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    gameState.tableCards.push(gameState.selectedHandCard);
    currentPlayer.hand = currentPlayer.hand.filter(
      (card) => card.id !== gameState.selectedHandCard.id
    );
    addToGameLog(`${currentPlayer.name} añadió una carta a la mesa`);
    gameState.selectedHandCard = null;
    gameState.selectedTableCards = [];
    endTurn();
  });

  document.getElementById("end-turn-btn").addEventListener("click", () => {
    if (gameState.selectedHandCard) {
      document.getElementById("add-to-table-btn").click();
    } else {
      endTurn();
    }
  });

  // Modal de reglas
  const rulesModal = document.getElementById("rules-modal");
  const showRulesButton = document.getElementById("show-rules");
  const closeRulesButton = document.getElementById("close-rules");

  // Mostrar el modal al hacer clic en el botón "Reglas"
  showRulesButton.addEventListener("click", () => {
    console.log("Botón 'Reglas' clickeado");
    rulesModal.classList.remove("hidden");
});

closeRulesButton.addEventListener("click", () => {
    console.log("Botón 'Cerrar' clickeado");
    rulesModal.classList.add("hidden");
});

rulesModal.addEventListener("click", (event) => {
    if (event.target === rulesModal) {
        console.log("Clic fuera del contenido del modal");
        rulesModal.classList.add("hidden");
    }
});

  


  document.getElementById("new-game-btn").addEventListener("click", () => {
    document.getElementById("game-over-modal").classList.add("hidden");
    document.getElementById("welcome-screen").style.display = "flex";
  });

  document
    .getElementById("select-level-1")
    .addEventListener("click", function () {
      document
        .querySelectorAll(".level-card")
        .forEach((card) => card.classList.remove("selected"));
      this.classList.add("selected");
      gameState.difficulty = 1;
    });
  document
    .getElementById("select-level-2")
    .addEventListener("click", function () {
      document
        .querySelectorAll(".level-card")
        .forEach((card) => card.classList.remove("selected"));
      this.classList.add("selected");
      gameState.difficulty = 2;
    });
  document
    .getElementById("select-level-3")
    .addEventListener("click", function () {
      document
        .querySelectorAll(".level-card")
        .forEach((card) => card.classList.remove("selected"));
      this.classList.add("selected");
      gameState.difficulty = 3;
    });
  document
    .getElementById("start-game-btn")
    .addEventListener("click", function () {
      initGame(2, gameState.difficulty);
    });
  document.getElementById("level-1").addEventListener("click", function () {
    if (!gameState.gameOver) {
      if (confirm("¿Cambiar al Nivel 1? Se reiniciará el juego.")) {
        initGame(2, 1);
      }
    } else {
      document.getElementById("welcome-screen").style.display = "flex";
      gameState.difficulty = 1;
      document.querySelectorAll(".level-card").forEach((card, index) => {
        card.classList.toggle("selected", index === 0);
      });
    }
  });
  document.getElementById("level-2").addEventListener("click", function () {
    if (!gameState.gameOver) {
      if (confirm("¿Cambiar al Nivel 2? Se reiniciará el juego.")) {
        initGame(2, 2);
      }
    } else {
      document.getElementById("welcome-screen").style.display = "flex";
      gameState.difficulty = 2;
      document.querySelectorAll(".level-card").forEach((card, index) => {
        card.classList.toggle("selected", index === 1);
      });
    }
  });
  document.getElementById("level-3").addEventListener("click", function () {
    if (!gameState.gameOver) {
      if (confirm("¿Cambiar al Nivel 3? Se reiniciará el juego.")) {
        initGame(2, 3);
      }
    } else {
      document.getElementById("welcome-screen").style.display = "flex";
      gameState.difficulty = 3;
      document.querySelectorAll(".level-card").forEach((card, index) => {
        card.classList.toggle("selected", index === 2);
      });
    }
  });

  // Inicia el juego mostrando la pantalla de bienvenida
  document.getElementById("welcome-screen").style.display = "flex";
});
