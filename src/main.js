// main.js

document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-button");
    const gameStateKey = "tik-tak-toe-state";

    const builDir = "docs";
    const srcDir = "src";

    // Dynamisch "Current Player" erstellen
    const statusDisplay = document.createElement("div");
    statusDisplay.id = "status-display";
    statusDisplay.style.fontSize = "32px";
    statusDisplay.style.fontWeight = "bold";
    statusDisplay.style.color = "#ff6f61";
    statusDisplay.style.marginBottom = "20px";
    statusDisplay.textContent = "Current Player: X"; // Startstatus
    document.body.insertBefore(statusDisplay, document.querySelector(".game-container"));

    // Modal für Gewinner oder Unentschieden
    const modal = document.createElement("div");
    modal.id = "game-modal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.innerHTML = `
        <div class="modal-content" style="background-color: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3); width: 400px;">
            <p id="modal-message" style="font-size: 24px; margin-bottom: 20px; color: #333333;"></p>
            <button id="restart-button" style="padding: 15px 30px; font-size: 18px; cursor: pointer; border: none; border-radius: 8px; background-color: #007bff; color: white; transition: background-color 0.3s ease, transform 0.2s ease;">Restart Game</button>
        </div>
    `;
    document.body.appendChild(modal);

    let board = Array(9).fill(null); // Represents the game board
    let currentPlayer = "X"; // X always starts

    // Update the status message
    function updateStatusMessage() {
        statusDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    // Show modal with a message
    function showModal(message) {
        const modalMessage = document.getElementById("modal-message");
        modalMessage.textContent = message;
        modal.style.display = "flex";
    }

    // Hide modal
    function hideModal() {
        modal.style.display = "none";
    }

    // Initialize the game state
    function initializeGame() {
        const savedState = JSON.parse(localStorage.getItem(gameStateKey));
        if (savedState) {
            board = savedState.board;
            currentPlayer = savedState.currentPlayer;
            board.forEach((mark, index) => {
                if (mark) {
                    cells[index].textContent = mark;
                    cells[index].style.color = "black";
                    cells[index].classList.add(mark.toLowerCase());
                }
            });
        } else {
            resetGame(); // Reset if no saved state exists
        }
        updateStatusMessage();
        updateHoverEffect();
    }

    // Save the game state to localStorage
    function saveGameState() {
        localStorage.setItem(gameStateKey, JSON.stringify({ board, currentPlayer }));
    }

    // Check for a winner
    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.every(cell => cell) ? "Draw" : null;
    }

    // Handle a player's move
    function handleMove(cell, index) {
        if (board[index] || checkWinner()) return; // Ignore if cell is marked or game is over

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.style.color = "black"; // Make the clicked mark black
        cell.classList.add(currentPlayer.toLowerCase());

        saveGameState(); // Save the game state after every move

        const winner = checkWinner();
        if (winner) {
            if (winner === "Draw") {
                showModal("It's a draw! No more moves possible.");
            } else {
                showModal(`Player ${winner} wins!`);
            }
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatusMessage();
            updateHoverEffect();
        }
    }

    // Add hover effect directly on buttons based on current player
    function updateHoverEffect() {
        cells.forEach((cell, index) => {
            cell.classList.remove("x-hover", "o-hover");
            if (!board[index]) {
                cell.addEventListener("mouseenter", () => {
                    if (!cell.textContent) {
                        cell.textContent = currentPlayer;
                        cell.style.color = "lightgray";
                    }
                });
                cell.addEventListener("mouseleave", () => {
                    if (board[index] === null) {
                        cell.textContent = "";
                    }
                });
            }
        });
    }

    // Reset the game
    function resetGame() {
        board = Array(9).fill(null);
        currentPlayer = "X";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "cell";
            cell.style.color = "black";
        });
        updateHoverEffect();
        updateStatusMessage();
        localStorage.removeItem(gameStateKey);
        hideModal();
    }

    // Add event listeners to cells
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleMove(cell, index));
    });

    // Add event listener to reset button
    resetButton.addEventListener("click", resetGame);

    // Add event listener to modal restart button
    document.getElementById("restart-button").addEventListener("click", resetGame);

    // Initialize the game state on load
    initializeGame();
});
