const startBtn = document.getElementById("start-game");
const statusText = document.getElementById("status");
const playersChoiceEl = document.querySelectorAll(".players-choice");

const rowOneEl = document.querySelectorAll(".players-choice-one");
const rowTwoeEl = document.querySelectorAll(".players-choice-two");
const rowThreeEl = document.querySelectorAll(".players-choice-three");
const rowFourEl = document.querySelectorAll(".players-choice-four");
const rowFiveEl = document.querySelectorAll(".players-choice-five");
const rowSixEl = document.querySelectorAll(".players-choice-six");

const playersChoice = [c1, c2, c3, c4, c5, c6, c7];
const rowOne = [r11, r12, r13, r14, r15, r16, r17];
const rowTwo = [r21, r22, r23, r24, r25, r26, r27];
const rowThree = [r31, r32, r33, r34, r35, r36, r37];
const rowFour = [r41, r42, r43, r44, r45, r46, r47];
const rowFive = [r51, r52, r53, r54, r55, r56, r57];
const rowSix = [r61, r62, r63, r64, r65, r66, r67];





let currentPlayer = 1;
let gameActive = false;
// 6 rows x 7 columns board state (0 = empty, 1 = Red, 2 = Yellow)
let board = Array.from({ length: 6 }, () => Array(7).fill(0));

startBtn.addEventListener("click", resetGame);

// Add click events to top drop zones (c1 to c7)
for (let col = 1; col <= 7; col++) {
    const colTrigger = document.getElementById(`c${col}`);
    colTrigger.addEventListener("click", () => handleMove(col - 1));
}

function resetGame() {
    board = Array.from({ length: 6 }, () => Array(7).fill(0));
    currentPlayer = 1;
    gameActive = true;
    statusText.textContent = "Player 1's Turn (Red)";

    // Clear all board classes
    for (let r = 1; r <= 6; r++) {
        for (let c = 1; c <= 7; c++) {
            const cell = document.getElementById(`r${r}${c}`);
            cell.classList.remove("player1", "player2");
        }
    }
}

function handleMove(colIndex) {
    if (!gameActive) return;

    // Find the lowest empty row in the clicked column (from row 5 up to 0)
    for (let rowIndex = 5; rowIndex >= 0; rowIndex--) {
        if (board[rowIndex][colIndex] === 0) {
            board[rowIndex][colIndex] = currentPlayer;
            
            // Update HTML element (adjusting 0-based index to 1-based ID)
            const cell = document.getElementById(`r${rowIndex + 1}${colIndex + 1}`);
            cell.classList.add(currentPlayer === 1 ? "player1" : "player2");

            if (checkWin(rowIndex, colIndex)) {
                statusText.textContent = `Player ${currentPlayer} Wins!`;
                gameActive = false;
                return;
            }

            if (board.flat().every(cell => cell !== 0)) {
                statusText.textContent = "It's a Draw!";
                gameActive = false;
                return;
            }

            // Switch turns
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            statusText.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? "Red" : "Yellow"})`;
            return;
        }
    }
}

function checkWin(r, c) {
    const directions = [,  // Horizontal,  // Vertical,  // Diagonal down-right
        [1, -1]  // Diagonal down-left
    ];

    for (let [dr, dc] of directions) {
        let count = 1;

        // Check positive direction
        for (let step = 1; step < 4; step++) {
            const nr = r + dr * step;
            const nc = c + dc * step;
            if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && board[nr][nc] === currentPlayer) {
                count++;
            } else break;
        }

        // Check negative direction
        for (let step = 1; step < 4; step++) {
            const nr = r - dr * step;
            const nc = c - dc * step;
            if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && board[nr][nc] === currentPlayer) {
                count++;
            } else break;
        }

        if (count >= 4) return true;
    }
    return false;
}
