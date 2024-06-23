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
    piece.addClass(colour)

    movePiece(piece, space)

    let moveInterval = setInterval(() => {
        positionPiece(piece, piece.data("space"))
    }, 100)
    piece.data("moveInterval", moveInterval)

    piece.on("click", pieceClicked)

    let circle = $(`<div class="circle"></div>`)
    circle.addClass(size)
    circle.addClass(colour)


    piece.append(circle)

    return piece

}

function positionPiece(piece, space) {

    if (!space) {
        return
    }

    let squareRect = space[0].getBoundingClientRect()
    let pieceRect = piece[0].getBoundingClientRect()
    piece.css("top", ((squareRect.height-pieceRect.height)/2)+squareRect.top)
    piece.css("left", ((squareRect.width-pieceRect.width)/2)+squareRect.left)
}

function movePiece(piece, space) {

    if (!space) {
        return
    }

    let oldSpace = piece.data("space")
    piece.data("space", space)

    positionPiece(piece, space)

    if (!oldSpace.hasClass("piece-rack")) {
        let oldStack = getStack(oldSpace)
        oldStack.pop()
    }


    // piece.data("space").data("pieces", piece.data("space").data("pieces").splice(-1))

    if (!space.hasClass("piece-rack")) {
        let newStack = getStack(space)

        newStack.push(piece)
    }



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

    return pieces.at(-1)

}

function checkWinForColour(colour) {

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

    $("#message").hide()
    $("#end-game").show()

    if (colour === "white") {
        $("#end-message-onion").attr("src", "white-onion.svg")
    } else {
        $("#end-message-onion").attr("src", "red-onion.png")   
    }

    gameStarted = false

}

function restart() {

    stacks = {}
    gameStarted = true
    currentTurn = "black"
    pieceSelected = null
    gameStarted = true

    for (child of $("#board").children()) {
        $(child).remove()
    }

    for (child of $("#black-holder").children()) {
        $(child).remove()
    }

    for (child of $("#white-holder").children()) {
        $(child).remove()
    }

    $("#end-game").hide()
    $("#message").show()
    $("#message-onion").attr("src", "red-onion.png")

    createBoard(4, 4)
    createPieces()

}

function madeMove() {

    if (currentTurn === "black") {
        currentTurn = "white"
        $("#message-onion").attr("src", "white-onion.svg")
        //This image is a dif format lmao
    } else {
        currentTurn = "black"
        $("#message-onion").attr("src", "red-onion.png")
    }

    

    checkForWin()
    
}

var pieceSelected = null
var currentTurn = "black"
var gameStarted = true

$("#end-game").hide()

$(() => {
    createBoard(4, 4)
    createPieces()
})