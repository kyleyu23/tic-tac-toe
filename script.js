const gameInfo = document.querySelector('#game-info');
const restartButton = document.querySelector('#restart');
const cells = [...document.querySelectorAll("td")];

const playerFactory = (label) => {
    return { label };
}

const gameState = (() => {
    let gameBoard = Array(9).fill("");
    let playerOne = playerFactory("O");
    let playerTwo = playerFactory("X");
    let currentPlayer = playerOne;

    const state = {
        getGameBoard() {
            return gameBoard;
        },
        getCurrentPlayerLabel() {
            return currentPlayer.label;
        },
        setMark(cell) {
            gameBoard[cell] = currentPlayer.label;
        },
        updatePlayerTurn() {
            currentPlayer = currentPlayer === playerTwo ? playerOne : playerTwo
        },
        isMoveValid(cellId) {
            return gameBoard[cellId] === '';
        },
        getWinner() {
            // 0 1 2
            // 3 4 5
            // 6 7 8
            const lines = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];

            /** Given a line, returns playerOne if player one wins for that line, or playerTwo if player two wins for that line, otherwise undefined. */
            function checkLine(index1, index2, index3) {
                if (gameBoard[index1] === gameBoard[index2] && gameBoard[index2] === gameBoard[index3]) {
                    switch (gameBoard[index1]) {
                        case playerOne.label:
                            return playerOne;
                        case playerTwo.label:
                            return playerTwo;
                        default:
                            return;
                    }
                }
            }

            for (const [index1, index2, index3] of lines) {
                let winner = checkLine(index1, index2, index3);
                if (winner) {
                    return winner.label;
                }
            }

            if (this.isFull()) {
                return "Tie";
            }
        },
        isFull() {
            return !gameBoard.includes("");
        },
        reset() {
            gameBoard = Array(9).fill("");
            currentPlayer = playerOne;
        }
    };

    return state;
})();

function render(gameState, winnerOrTie) {
    // cells
    for (let index = 0; index < cells.length; index++) {
        cells[index].textContent = gameState.getGameBoard()[index];
    };

    //if winnerorTie then, display game result
    if (winnerOrTie) {
        if (winnerOrTie === "Tie") {
            gameInfo.textContent = "Tie"
        } else if (winnerOrTie === "O" || winnerOrTie === "X") {
            gameInfo.textContent = `Player ${winnerOrTie} Wins`
        }
        //else currentPlayer's Turn        
    } else {
        const currentPlayer = gameState.getCurrentPlayerLabel();
        gameInfo.textContent = `Player ${currentPlayer}'s Turn`
    }

}

function gameLoop(gameState, cellId) {

    // 0. If move is valid, then
    const winnerOrTie = gameState.getWinner();
    if (gameState.isMoveValid(cellId) && !winnerOrTie) {

        // 1. update gameState
        gameState.setMark(cellId);

        // 2. update player turn
        gameState.updatePlayerTurn();

        // 3. get winnerOrTie
        const winnerOrTie = gameState.getWinner();

        // 4. render HTML
        render(gameState, winnerOrTie);

    } else {
        // alert("NO!");
    }

}

function resetBoard(gameState) {
    gameState.reset();
    render(gameState);
}

function addListeners() {
    for (let index = 0; index < cells.length; index++) {
        cells[index].addEventListener("click", () => {
            gameLoop(gameState, index);
        });
    }
    restartButton.addEventListener("click", () => {
        resetBoard(gameState);
    });
}


addListeners();