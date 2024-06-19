var sizes = {
    "small":0,
    "medium":1,
    "large":2,
}

var stacks = {}


function createBoard(_x, _y) {

    for (let y = 0; y < _y; y++) {

        let row = $(`<div class="row"></div>`)
        row.data("y", y)

        $("#board").append(row)

        stacks[y] = {}

        for (let x = 0; x < _x; x++) {
            
            let square = $(`<div class="square"></div>`)
            square.data("x", x)
            square.data("y", y)
            stacks[y][x] = []

            row.append(square)

            square.on("click", squareClicked)

        }

    }

}

function createPieces() {

    createPiecesForColour("black")
    createPiecesForColour("white")

}

function createPiecesForColour(colour) {

    for (let n = 0; n < 4; n++) {

        let holder = $(`<div class="piece-rack"></div>`)

        $(`#${colour}-holder`).append(holder)

        holder.append(createPiece(colour, "small", holder))
        holder.append(createPiece(colour, "medium", holder))
        holder.append(createPiece(colour, "large", holder))


    }
}

function createPiece(colour, size, space) {

    let piece = $(`<div class="piece"></div>`)

    piece.data("space", space)
    piece.data("colour", colour)
    piece.data("size", size)
    piece.data("on-board", false)

    piece.addClass(size)

    movePiece(piece, space)

    let moveInterval = setInterval(() => {
        movePiece(piece, piece.data("space"))
    }, 100)
    piece.data("moveInterval", moveInterval)

    piece.on("click", pieceClicked)

    let circle = $(`<div class="circle"></div>`)
    circle.addClass(size)
    circle.addClass(colour)


    piece.append(circle)

    return piece

}

function movePiece(piece, space) {

    if (!space) {
        return
    }

    let squareRect = space[0].getBoundingClientRect()
    let pieceRect = piece[0].getBoundingClientRect()
    piece.css("top", ((squareRect.height-pieceRect.height)/2)+squareRect.top)
    piece.css("left", ((squareRect.width-pieceRect.width)/2)+squareRect.left)

    if (!piece.data("space").hasClass("piece-rack")) {
        let oldStack = getStack(piece.data("space"))
        oldStack.pop()
    }


    // piece.data("space").data("pieces", piece.data("space").data("pieces").splice(-1))

    if (!space.hasClass("piece-rack")) {
        let newStack = getStack(space)

        newStack.push(piece)
    }

    piece.data("space", space)


    // space.data("pieces", space.data("pieces").push(piece))

}

function squareClicked(event) {

    if (!gameStarted) {
        return
    }

    let square = $(event.target)

    if (pieceSelected) {
        pieceSelected.data("space").removeClass("selected")
        movePiece(pieceSelected, square)
        pieceSelected.data("on-board", true)
        pieceSelected = null
        madeMove()
    }

}


function pieceClicked(event) {

    if (!gameStarted) {
        return
    }

    let piece = $(event.target)

    if (pieceSelected) {

        if (piece.data("space") === pieceSelected.data("space")) {
            pieceSelected.data("space").removeClass("selected")
            pieceSelected = null
            return
        }

        if ((!piece.data("on-board")) && piece.data("colour") === currentTurn) {
            pieceSelected.data("space").removeClass("selected")
            pieceSelected = piece
            pieceSelected.data("space").addClass("selected")
            return
        }

        if (canMoveOntoPiece(pieceSelected, piece)) {

            pieceSelected.data("space").removeClass("selected")
            movePiece(pieceSelected, piece.data("space"))
            pieceSelected = null
            madeMove()

        }

    } else {

        if (piece.data("colour") === currentTurn) {
            pieceSelected = piece
            pieceSelected.data("space").addClass("selected")
        }

    }

}

function canMoveOntoPiece(piece, other) {

    if (!other.data("on-board")) {
        return false
    } else {
        return sizes[other.data("size")] < sizes[piece.data("size")]
    }


}

function getStack(space) {
    return stacks[space.data("y")][space.data("x")]
}

function getTopPiece(pieces) {

    console.log(pieces)

    let top = pieces[0]

    for (piece of pieces) {
        if (sizes[piece.data("size")] > top.data("size")) {
            top = piece
        }
    }

    return top

}

function checkWinForColour(colour) {

    console.log(`checking ${colour}`)

    let lines = {
        "x":{},
        "y":{},
        "diag":[],
        "rdiag":[],
    }

    for (s of $("#board").find(".square")) {

        let square = $(s)

        if (getStack(square).length <= 0) {
            continue
        }

        let top = getTopPiece(getStack(square))
        // let top = square.data("data").pieces.at(-1)
        console.log(top.data("colour"))

        if ($(top).data("colour") === colour) {

            let x = square.data("x")
            let y = square.data("y")

            if (lines.x[x]) {
                lines.x[x].push(top)
            } else {
                lines.x[x] = [top]
            }

            if (lines.y[y]) {
                lines.y[y].push(top)
            } else {
                lines.y[y] = [top]
            }

            if (x === y) {
                lines.diag.push(top)
            } else if (x === 3-y) {
                lines.rdiag.push(top)
            }

        }

    }

    let wins = []

    console.log(wins)

    for (straight of ["x", "y"]) {
        for (line of Object.keys(lines[straight])) {
            let win = lines[straight][line]
            if (win.length >= 4) {
                wins.push(win)
            }
        }
    }

    if (lines.diag.length >= 4) {
        wins.push(lines.diag)
    } else if (lines.rdiag.length >= 4) {
        wins.push(lines.rdiag)
    }

    return wins
}

function checkForWin() {

    let blackWins = checkWinForColour("black")
    let whiteWins = checkWinForColour("white")

    if (blackWins.length === whiteWins.length) {
        //Currently Drawing
    } else {
        if (blackWins.length > whiteWins.length) {
            gameWon(blackWins[0])
        } else if (blackWins.length < whiteWins.length) {
            gameWon(whiteWins[0])
        }
    }

}

function gameWon(line) {

    let colour = line[0].data("colour")

    for (piece of line) {
        piece.data("space").addClass("line")
    }

    gameStarted = false

}

function madeMove() {

    if (currentTurn === "black") {
        currentTurn = "white"
    } else {
        currentTurn = "black"
    }

    checkForWin()
    
}

var pieceSelected = null
var currentTurn = "black"
var gameStarted = true

$(() => {
    createBoard(4, 4)
    createPieces()
})