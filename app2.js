const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = "red";
let gameActive = false;
let isAiTurn = false;

const startBtn = document.getElementById("start-game");
const modeSelect = document.getElementById("game-mode");
const statusDisplay = document.getElementById("status");
const choiceRow = document.querySelector(".players-choice");

function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = "red";
    gameActive = true;
    isAiTurn = false;
    startBtn.textContent = "RESTART GAME";
    updateStatus();

    for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
        const cell = document.getElementById(`r${r}${c}`);
        cell.classList.remove("red-piece", "yellow-piece", "drop-animation");
        cell.style.removeProperty("--drop-distance");
        }
    }
}

function updateStatus() {
    const isAiMode = !modeSelect || modeSelect.value === "ai";
    if (isAiMode && currentPlayer === "yellow") {
        statusDisplay.textContent = "AI is thinking...";
        choiceRow.className = "players-choice";
    } else {
        const playerName = currentPlayer === "red" ? "Red" : "Yellow";
        statusDisplay.textContent = `${playerName}'s Turn`;
        choiceRow.className = `players-choice ${currentPlayer}-turn`;
    }
}

function dropPiece(colIndex, isAutomated = false) {
    if (!gameActive) return;
    if (isAiTurn && !isAutomated) return;

    const targetRow = getAvailableRow(colIndex);
    if (targetRow === -1) return;

    board[targetRow][colIndex] = currentPlayer;

    const cell = document.getElementById(`r${targetRow + 1}${colIndex + 1}`);
    const dropPixels = -((targetRow + 1) * 60);
    cell.style.setProperty("--drop-distance", `${dropPixels}px`);
    cell.classList.add(`${currentPlayer}-piece`, "drop-animation");

    if (checkWin(targetRow, colIndex, currentPlayer)) {
        const isAi = (!modeSelect || modeSelect.value === "ai") && currentPlayer === "yellow";
        const winner = isAi ? "AI (Yellow)" : (currentPlayer === "red" ? "Red" : "Yellow");
        statusDisplay.textContent = `${winner} Wins!`;
        choiceRow.className = "players-choice";
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusDisplay.textContent = "It's a Draw!";
        choiceRow.className = "players-choice";
        gameActive = false;
        return;
    }

    // Switch turns
    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
    updateStatus();

    // Trigger AI move
    const isAiMode = !modeSelect || modeSelect.value === "ai";
    if (isAiMode && currentPlayer === "yellow" && gameActive) {
        isAiTurn = true;
        setTimeout(() => {
        const aiCol = chooseAiMove();
        isAiTurn = false;
        if (aiCol !== undefined) {
            dropPiece(aiCol, true);
        }
        }, 550);
    }
}

function getAvailableRow(colIndex) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][colIndex] === null) return r;
    }
    return -1;
}

function chooseAiMove() {
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
        if (getAvailableRow(c) !== -1) validCols.push(c);
    }

    if (validCols.length === 0) return undefined;

    // 1. Check if AI can win right now
    for (let c of validCols) {
        const r = getAvailableRow(c);
        board[r][c] = "yellow";
        const wins = checkWin(r, c, "yellow");
        board[r][c] = null;
        if (wins) return c;
    }

  // 2. Check if Red is about to win and block them
    for (let c of validCols) {
        const r = getAvailableRow(c);
        board[r][c] = "red";
        const blocks = checkWin(r, c, "red");
        board[r][c] = null;
        if (blocks) return c;
    }

    // 3. Prefer the center column
    if (validCols.includes(3) && Math.random() < 0.7) {
        return 3;
    }

  // 4. Pick a random valid column
  return validCols[Math.floor(Math.random() * validCols.length)];
}

function checkWin(row, col, player) {
    const directions = [
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal down-right
        { dr: 1, dc: -1 }  // Diagonal down-left
    ];

    for (let dir of directions) {
        let count = 1;
        count += countDirection(row, col, dir.dr, dir.dc, player);
        count += countDirection(row, col, -dir.dr, -dir.dc, player);
        if (count >= 4) return true;
    }
    return false;
}

function countDirection(row, col, dr, dc, player) {
    let r = row + dr;
    let c = col + dc;
    let count = 0;

    while (
        r >= 0 && r < ROWS &&
        c >= 0 && c < COLS &&
        board[r][c] === player
    ) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

for (let c = 1; c <= COLS; c++) {
    document.getElementById(`c${c}`).addEventListener("click", () => {
        dropPiece(c - 1);
    });
}

startBtn.addEventListener("click", startGame);
if (modeSelect) {
    modeSelect.addEventListener("change", () => {
        if (gameActive) startGame();
    });
}
