var currentTurn = 0
var currentBoard = -1

var smallGrids = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1]
]

var bigGrid = [
    -1, -1, -1, 
    -1, -1, -1, 
    -1, -1, -1
]

const tiles = document.querySelectorAll(".tile")
const grids = document.querySelectorAll(".small-grid")

tiles.forEach(element => {
    element.addEventListener("click", event => {
        // console.log([...tiles].indexOf(element))

        PlaceToken([...tiles].indexOf(element))
    })
})

function PlaceToken(location) {
    let board = Math.floor(location/9)
    console.log(board)

    if (currentBoard == -1 || board == currentBoard) {
        if(smallGrids[board][location%9] == -1 && bigGrid[board] == -1) {
            tiles[location].innerHTML = "ox"[currentTurn]
            document.getElementsByTagName("body")[0].classList.add(["cross-body", "nought-body"][currentTurn])
            document.getElementsByTagName("body")[0].classList.remove(["nought-body", "cross-body"][currentTurn])
            tiles[location].classList.remove("available")
            tiles[location].classList.add(["nought-token", "cross-token"][currentTurn])
            smallGrids[board][location%9] = currentTurn
            let win = CheckWin(smallGrids[board], location%9, currentTurn)
            // console.log(win)
            if (win) {
                console.log("WINNER WINNER CHICKEN DINNER WEINER :D WINNER CHICKEN DINNER WINNER WINNER CHICKEN DINNER")
                bigGrid[board] = currentTurn
                grids[board].classList.add(["nought-win", "cross-win"][currentTurn])
                let winToken = document.createElement("div")
                winToken.classList.add("win-token", ["nought-token", "cross-token"][currentTurn])
                winToken.innerHTML = "ox"[currentTurn]
                grids[board].appendChild(winToken)
                var gameOver = CheckWin(bigGrid, board, currentTurn)
                if (gameOver) { // document.getElementsByTagName("body")[0].classList.add(["nought-win", "cross-win"][currentTurn])
                    document.getElementsByTagName("body")[0].classList.add(["nought-body", "cross-body"][currentTurn])
                    document.getElementsByTagName("body")[0].classList.remove(["cross-body", "nought-body"][currentTurn])
                }
                console.log(gameOver, "game over?")
            }
            currentTurn = currentTurn == 0 ? 1 : 0
            if (currentTurn == 1) {
                if (!gameOver) document.getElementById("nought-icon").classList.remove("turn")
                document.getElementById("cross-icon").classList.add("turn")
            } else {
                if (!gameOver) document.getElementById("cross-icon").classList.remove("turn")
                document.getElementById("nought-icon").classList.add("turn")
            }
            console.log(location%9, "loco")
            currentBoard = bigGrid[location%9] != -1 ? -1 : (smallGrids[location%9].includes(-1) ? location%9 : -1)
            if (gameOver) currentBoard = -2
            ColourGrids()
        }
        
    }
}

function CheckWin(board, lastToken, tokenType) {
    let differences = []
    let win = false
    board.forEach((token, index) => {
        if (token != tokenType) return
        let difference = [Math.floor(lastToken/3 - Math.floor(index/3)), lastToken%3 - index%3]
        // console.log(difference)
        if (JSON.stringify(differences).includes(JSON.stringify([-difference[0], -difference[1]])) || JSON.stringify(differences).includes(JSON.stringify([difference[0]*2, difference[1]*2])) || JSON.stringify(differences).includes(JSON.stringify([difference[0]/2, difference[1]/2]))) {
            win = true
            return
        }
        differences.push(difference)
    })
    // console.log(differences)
    return win
}

function ColourGrids() {
    grids.forEach(element => {
        element.classList.remove(["cross", "nought"][currentTurn])
    })
    if (currentBoard == -2) return
    grids.forEach(element => {
        console.log(currentBoard)
        if (currentBoard == -1) element.classList.add(["nought", "cross"][currentTurn])
    })
    if (currentBoard != -1) grids[currentBoard].classList.add(["nought", "cross"][currentTurn])
}
