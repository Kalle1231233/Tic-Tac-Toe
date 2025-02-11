document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-button");
    const gameStateKey = "tik-tak-toe-state";

    const builDir = "docs";
    const srcDir = "src";

    const statusDisplay = document.createElement("div");
    statusDisplay.id = "status-display";
    statusDisplay.style.fontSize = "32px";
    statusDisplay.style.fontWeight = "bold";
    statusDisplay.style.color = "#ff6f61";
    statusDisplay.style.marginBottom = "20px";
    statusDisplay.textContent = "Current Player: X"
    document.body.insertBefore(statusDisplay, document.querySelector(".game-container"));

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

    let board = Array(9).fill(null);
    let currentPlayer = "X";

    function updateStatusMessage() {
        statusDisplay.textContent = `Current Player: ${currentPlayer}`;
    }

    function showModal(message) {
        const modalMessage = document.getElementById("modal-message");
        modalMessage.textContent = message;
        modal.style.display = "flex";
    }

    function hideModal() {
        modal.style.display = "none";
    }

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
            resetGame();
        }
        updateStatusMessage();
        updateHoverEffect();
    }

    function saveGameState() {
        localStorage.setItem(gameStateKey, JSON.stringify({ board, currentPlayer }));
    }

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

    function handleMove(cell, index) {
        if (board[index] || checkWinner()) return;

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.style.color = "black";
        cell.classList.add(currentPlayer.toLowerCase());

        saveGameState();

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

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleMove(cell, index));
    });

    resetButton.addEventListener("click", resetGame);

    document.getElementById("restart-button").addEventListener("click", resetGame);

    initializeGame();
});
