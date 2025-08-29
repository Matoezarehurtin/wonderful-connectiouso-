const columns = 7;
const rows = 6;
let currentPlayer = 'red'; // 'red' starts
let gameBoard = Array(rows).fill().map(() => Array(columns).fill(null));
let isGameOver = false;
let player1Wins = 0;
let player2Wins = 0;
const maxWins = 10; // First to 10 wins the overall game

const gameBoardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const player1WinsElement = document.getElementById('player1Wins');
const player2WinsElement = document.getElementById('player2Wins');
const overallWinnerElement = document.getElementById('overallWinner');

function createBoard() {
    gameBoardElement.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (isGameOver) return;

    const col = event.target.dataset.col;
    for (let row = rows - 1; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = currentPlayer;
            updateBoard();
            if (checkWin(row, col)) {
                setTimeout(() => {
                    alert(`${currentPlayer} wins this round!`);
                    updateWinCount();
                    resetBoard();
                }, 100);
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                statusElement.textContent = `${currentPlayer === 'red' ? "Player 1" : "Player 2"}'s turn`;
            }
            return;
        }
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const player = gameBoard[row][col];
        cell.classList.remove('red', 'yellow');
        if (player) {
            cell.classList.add(player);
        }
    });
}

function checkWin(row, col) {
    const directions = [
        { r: 0, c: 1 }, // Horizontal
        { r: 1, c: 0 }, // Vertical
        { r: 1, c: 1 }, // Diagonal /
        { r: 1, c: -1 }, // Diagonal \
    ];

    for (let { r, c } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const newRow = row + i * r;
            const newCol = col + i * c;
            if (isValidPosition(newRow, newCol) && gameBoard[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            const newRow = row - i * r;
            const newCol = col - i * c;
            if (isValidPosition(newRow, newCol) && gameBoard[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) return true;
    }
    return false;
}

function isValidPosition(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < columns;
}

function updateWinCount() {
    if (currentPlayer === 'red') {
        player1Wins++;
        player1WinsElement.textContent = player1Wins;
    } else {
        player2Wins++;
        player2WinsElement.textContent = player2Wins;
    }

    if (player1Wins >= maxWins) {
        overallWinnerElement.textContent = "Player 1 wins the game!";
        isGameOver = true;
    } else if (player2Wins >= maxWins) {
        overallWinnerElement.textContent = "Player 2 wins the game!";
        isGameOver = true;
    }
}

function resetBoard() {
    if (isGameOver) {
        setTimeout(() => {
            const reset = confirm("Game Over! Would you like to play again?");
            if (reset) {
                player1Wins = 0;
                player2Wins = 0;
                player1WinsElement.textContent = player1Wins;
                player2WinsElement.textContent = player2Wins;
                overallWinnerElement.textContent = '';
                isGameOver = false;
                gameBoard = Array(rows).fill().map(() => Array(columns).fill(null));
                createBoard();
                statusElement.textContent = "Player 1's turn";
            }
        }, 200);
    } else {
        gameBoard = Array(rows).fill().map(() => Array(columns).fill(null));
        createBoard();
        statusElement.textContent = currentPlayer === 'red' ? "Player 1's turn" : "Player 2's turn";
    }
}

createBoard();
