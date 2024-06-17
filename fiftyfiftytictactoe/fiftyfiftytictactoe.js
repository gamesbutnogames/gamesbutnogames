function createBoard(_x, _y) {

    for (let y = 0; y < _y; y++) {

        let row = $(`<div class="row"></div>`)
        row.data("y", y)

        $("#board").append(row)

        for (let x = 0; x < _x; x++) {
            
            let square = $(`<div class="square"><div class="flip-icon bi bi-arrow-left-right"></div></div>`)
            square.data("x", x)
            square.data("y", y)
            square.data("piece", null)

            if (x <= 0) {
                square.css("border-left-style", "none")
            }
            if (x >= _x-1) {
                square.css("border-right-style", "none")
            }
            if (y <= 0) {
                square.css("border-top-style", "none")
            }
            if (y >= _y-1) {
                square.css("border-bottom-style", "none")
            }



            row.append(square)

            square.click(squareClicked)

            square.hover(() => {

                if (square.data("piece") && gameStarted && canFlip) {
                    square.find(".flip-icon").addClass("hover")
                }

            }, () => {
                if (square.data("piece")) {
                    square.find(".flip-icon").removeClass("hover")
                }
            })

        }

    }

}

function squareClicked(event) {

    if (!gameStarted) {
        return
    }

    let square = $(event.target)

    if (square.data("piece") && canFlip) {
        flipPiece(square.data("piece"))
        nextTurn()
        return
    } else if (nextPiece && !square.data("piece")) {
        movePiece(nextPiece, square)
        nextPiece.data("on-board", true)
        nextPiece = null
        nextTurn()
    }


}


function movePiece(piece, space) {
    if (!space) {
        return
    }
    let squareRect = space[0].getBoundingClientRect()
    let pieceRect = piece[0].getBoundingClientRect()
    piece.css("top", ((squareRect.height-pieceRect.height)/2)+squareRect.top)
    piece.css("left", ((squareRect.width-pieceRect.width)/2)+squareRect.left)
    piece.data("space", space)
    space.data("piece", piece)

}

function createPiece(colour, space) {

    let piece = $(`<img class="piece" src="piece-${colour}.svg"/>`)

    piece.data("colour", colour)
    piece.data("direction", 1)
    piece.data("transition", false)

    piece.bind("transitionstart", () => {
        piece.data("transition", true)
    })

    piece.bind("transitionend", () => {
        piece.data("transition", false)
    })

    let moveInterval = setInterval(() => {
        if (!piece.data("transition")) {
            movePiece(piece, piece.data("space"))
        }
    }, 100)

    piece.data("moveInterval", moveInterval)

    $("#board").append(piece)

    movePiece(piece, space)

    return piece

}

function nextPieceFlip() {

    if(!gameStarted) {
        return
    }

    if (nextPiece) {
        flipPiece(nextPiece)
    }
}

function flipPiece(piece) {
    piece.data("direction", piece.data("direction", )*-1)
    piece.toggleClass("flipped")
}

function createNextPiece() {

    let piece = createPiece(currentColour, $("#next-piece-square"))
    nextPiece = piece
    piece.data("on-board", false)
    
}

function nextTurn() {

    updatePairs()
    checkForWin()

    if (currentColour === "red") {
        currentColour = "black"
    } else {
        currentColour = "red"
    }

    let count = 0

    for (piece of $("#board").find(".piece")) {
        if ($(piece).data("on-board")) {
            count += 1
        }
    }

    if (count >= 18) {
        $("#next-piece").hide()
        canFlip = true
    } else if (!nextPiece) {
        createNextPiece()
    }

}

function crossCheck(square1, square2) {

    let direction1 = square1.data("piece").data("direction")
    let direction2 = square2.data("piece").data("direction")


    return ((direction1 === -1) && (direction2 === 1)) 
    
}

function circleCheck(square1, square2) {

    let direction1 = square1.data("piece").data("direction")
    let direction2 = square2.data("piece").data("direction")


    return ((direction1 === 1) && (direction2 === -1)) 
    
}

function updatePairs() {

    let squares = $("#board").find(".square")
    
    for (let p = 0; p < squares.length; p++) {
        let square1 = $(squares[p])

        if (square1.data("x") === 5) {
            continue
        }

        if (!square1.data("piece")) {
            continue
        }

        let square2 = $(squares[p+1])

        if (!square2.data("piece")) {
            continue
        }

        if (crossCheck(square1, square2) || circleCheck(square1, square2)) {
            mergeSquares(square1, square2)
        } else {
            unmergeSquares(square1, square2)
        }

    }
}

function mergeSquares(square1, square2) {

    square1.css("border-right-style", "none")
    square2.css("border-left-style", "none")

}

function unmergeSquares(square1, square2) {

    square1.css("border-right-style", "solid")
    square2.css("border-left-style", "solid")

}

function checkWinForShape(checkerFunction) {

    let lines = {
        "x":{},
        "y":{},
        "diag":[],
        "rdiag":[],
    }


    let squares = $("#board").find(".square")
    
    for (let p = 0; p < squares.length; p++) {
        let square1 = $(squares[p])

        if (square1.data("x") === 5) {
            continue
        }

        if (!square1.data("piece")) {
            continue
        }

        let square2 = $(squares[p+1])

        if (!square2.data("piece")) {
            continue
        }



        if (checkerFunction(square1, square2)) {

            let x = square1.data("x")
            let y = square1.data("y")

            if (lines.x[x]) {
                lines.x[x].push([square1, square2])
            } else {
                lines.x[x] = [[square1, square2]]
            }

            if (lines.y[y]) {
                lines.y[y].push([square1, square2])
            } else {
                lines.y[y] = [[square1, square2]]
            }

            if (x/2 === y) {
                lines.diag.push([square1, square2])
            } 
            
            if ((x/2) === (2-y)) {
                lines.rdiag.push([square1, square2])
            }

        }

    }


    let wins = []

    for (straight of ["x", "y"]) {
        for (line of Object.keys(lines[straight])) {
            let win = lines[straight][line]
            if (win.length >= 3) {
                wins.push(win)
            }
        }
    }

    if (lines.diag.length >= 3) {
        wins.push(lines.diag)
    }
    
    if (lines.rdiag.length >= 3) {
        wins.push(lines.rdiag)
    }

    return wins

}

function checkForWin() {

    let crossWins = checkWinForShape(crossCheck)
    let circleWins = checkWinForShape(circleCheck)

    if (crossWins.length === circleWins.length) {
        //Currently Drawing
    } else {
        if (crossWins.length > circleWins.length) {

            highlightWin(crossWins[0])
            endGame("cross")

        } else if (crossWins.length < circleWins.length) {

            highlightWin(circleWins[0])
            endGame("circle")

        }
    }


}

function endGame(winner) {

    gameStarted = false

    if (nextPiece)
        nextPiece.remove()
    $("#next-piece").hide()
    $("#win-message").show()
    $(`#win-${winner}`).show()
    $(`#restart`).show()


}

function restart() {

    for (child of $("#board").children()) {
        $(child).remove()
    }

    createBoard(6, 3)

    $(`#win-cross`).hide()
    $(`#win-circle`).hide()
    $(`#win-message`).hide()
    $(`#restart`).hide()

    $("#next-piece").show()

    gameStarted = true
    currentColour = "red"
    nextPiece = null
    canFlip = false
    createNextPiece()

}

function highlightWin(pairs) {
    for (pair of pairs) {
        let square1 = $(pair[0])
        let square2 = $(pair[1])
    
        square1.addClass("win")
        square2.addClass("win")
    }
}

var currentColour = "red"
var nextPiece = null
var gameStarted = true
var canFlip = false

$(`#win-cross`).hide()
$(`#win-circle`).hide()
$(`#win-message`).hide()
$(`#restart`).hide()



$(() => {
    createBoard(6, 3)
    createNextPiece()

})