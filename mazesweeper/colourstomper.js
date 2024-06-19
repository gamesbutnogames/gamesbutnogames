
function populateColourPicker() {

    var colours = ["red", "purple", "lightgreen", "yellow", "orange", "blue", "white"]

    for (colour of colours) {
        let button = $(`<div class="colour-button"></div>`)
        button.data("colour", colour)
        button.data("clicked", false)
        button.css("background-color", colour)
        button.click(colourPicked)
        $("#colour-picker").append(button)
    }

}

var player1Colour = null
var player2Colour = null


function colourPicked(event) {
    let button = $(event.target)

    if (button.data("clicked")) {
        return
    }

    if (!player1Colour) {
        player1Colour = button.data("colour")
    } else {
        player2Colour = button.data("colour")
    }

    button.data("clicked", true)
    button.addClass("clicked")

    if (player1Colour && player2Colour) {
        startGame()
    }

}

function startGame() {
    gameStarted = true
    $("#colour-picker").hide()
    populateBoard(() => {
        placingStompers = true
        highlightPlacementSquares()
    })

}

function createBoard(_x, _y) {

    for (let y = 0; y < _y; y++) {

        var row = $(`<div class="row"></div>`)
        row.data("y", y)

        $("#board").append(row)

        for (let x = 0; x < _x; x++) {
            
            var square = $(`<div class="square"></div>`)
            square.data("x", x)
            square.data("y", y)
            square.data("filled", true)

            row.append(square)

            square.click(squareClicked)

        }

    }

}

function populateBoard(afterPopulation) {

    let allColours = {
        "red": 7,
        "purple": 7,
        "lightgreen": 7,
        "yellow": 7,
        "orange": 7,
        "blue": 7,
        "white": 7
    }

    let colourDistro = []

    //This is shit but i don't care
    while (colourDistro.length < 49) {

        let num = Math.floor(Math.random()*(Object.keys(allColours).length))
        let chosenColour = Object.keys(allColours)[num]
        if (allColours[chosenColour] != 0) {
            allColours[chosenColour] -= 1
            colourDistro.push(chosenColour)
        }

    }

    let squares = $("#board").find(".square")

    for (let n = 0; n < squares.length; n++) {

        let square = $(squares[n])
        let colour = colourDistro[n]
        var ball = $(`<div class="ball" data-colour="${colour}"></div>`)
        ball.css("background-color", colour)
        ball.addClass("placed")
        ball.css("animation-delay", `${square.data("y")*0.05}s`)
        ball.one("animationend", (e) => {
            $(e.target).removeClass("placed")

            if ($(e.target).parent().data("x") === 6 && $(e.target).parent().data("y") === 6) {
                afterPopulation()
            }

        })
        square.append(ball)

    }

}

var gameStarted = false
var placingStompers = false
var player1 = null
var player2 = null
var currentPlayer = null


function createStomper(player=1, colour, square) {


    let stomper = $(`<div class="stomper">`)
    let stomperball = $(`<div class="stomperball"></div>`)
    stomperball.css("background-color", colour)
    stomper.append(stomperball)
    stomper.data("colour", colour)
    stomper.data("player", player)
    stompSquare(stomper, square, true)
    $("#board").append(stomper)
    return stomper

}


function squareClicked(event) {

    if (!gameStarted) {
        return
    }

    let square = $(event.target)

    if (placingStompers) {
        if (!player1) {
            if (!checkPlacementValid(square)) {
                return
            }
            player1 = createStomper(1, player1Colour, square)
            highlightPlacementSquares()
        } else {
            if (!checkPlacementValid(square)) {
                return
            }
            player2 = createStomper(2, player2Colour, square)
            placingStompers = false
            nextTurn()
        }
        return
    }


    if (!square.data("filled")) {
        return
    }

    let ball = square.find(".ball")

    if (ball.data("colour") === currentPlayer.data("colour")) {

        stompSquare(currentPlayer, square)

    } else {

        let currentSquare = currentPlayer.data("square")
        let mX = square.data("x")-currentSquare.data("x")
        let mY = square.data("y")-currentSquare.data("y")
        let distance = Math.floor(Math.sqrt(mX**2 + mY**2))
    
        if (distance <= 1) {
            stompSquare(currentPlayer, square)
        }
    
    }



}

function stompSquare(stomper, square, placement=false) {

    let ball = square.find(".ball")
    ball.addClass("empty")

    moveStomper(stomper, square)

    square.data("filled", false)

    if (!placement) {
        nextTurn()
    }

}

function checkPlacementValid(square) {

    if (player1) {
        if ((player1.data("square").data("x") === square.data("x")) && (player1.data("square").data("y") === square.data("y"))) {
            return false
        }
    }

    if (square.data("x") === 0 || square.data("x") === 6) {
        return true
    }
    if (square.data("y") === 0 || square.data("y") === 6) {
        return true
    }

    return false
}



function highlightPlacementSquares() {

    for (s of $("#board").find(".square")) {

        //This is a bit shit but whatever

        let square = $(s)

        if (square.data("x") === 0 || square.data("x") === 6) {
            square.addClass("available")
            continue
        }
        if (square.data("y") === 0 || square.data("y") === 6) {
            square.addClass("available")
            continue
        }

        square.removeClass("available")

    }

    if (player1) {
        player1.data("square").removeClass("available")
    }
}

function getAvailableSquares(stomper) {

    let squares = []

    for (s of $("#board").find(".square")) {
        let square = $(s)
        if (square.data("filled")) {
            let ball = square.find(".ball")

            if (ball.data("colour") === stomper.data("colour")) {
                squares.push(square)
                continue
            } else {
    
                let currentSquare = stomper.data("square")
                let mX = square.data("x")-currentSquare.data("x")
                let mY = square.data("y")-currentSquare.data("y")
                let distance = Math.floor(Math.sqrt(mX**2 + mY**2))
            
                if (distance <= 1) {
                    squares.push(square)
                    continue
                }
            }
        }

    }

    return squares

}

function highlightAvailableSquares(stomper) {
    let squares = getAvailableSquares(stomper)
    for (s of $("#board").find(".square")) {

        $(s).removeClass("available")

    }

    for (square of squares) {
        square.addClass("available")
    }
}



function nextTurn() {

    if (!currentPlayer) {
        currentPlayer = player1
    } else {

        if (currentPlayer === player1) {
            currentPlayer = player2
            player1.removeClass("current")
        } else {
            currentPlayer = player1
            player2.removeClass("current")
        }
    }

    currentPlayer.addClass("current")

    highlightAvailableSquares(currentPlayer)

    let over = checkGameOver(currentPlayer)

    if (over) {
        endGame(currentPlayer)
    }

}

function endGame(loser) {
    if (loser === player1) {
        $("#winner").css("background-color", player2.data("colour"))
    } else {
        $("#winner").css("background-color", player1.data("colour"))
    }
    
    $("#game-over").show()

}



function moveStomper(stomper, square) {
    let rect = square[0].getBoundingClientRect()
    stomper.css("top", rect.top)
    stomper.css("left", rect.left)
    stomper.data("square", square)
}

function checkGameOver(stomper) {

    let availableSquares = getAvailableSquares(stomper)

    if (availableSquares.length <= 0) {
        return true
    } else {
        return false
    }

}

function restartGame() {

    gameStarted = false
    placingStompers = false
    player1 = null
    player2 = null
    currentPlayer = null
    player1Colour = null
    player2Colour = null

    for (child of $("#board").children()) {
        $(child).remove()
    }

    for (button of $("#colour-picker").children()) {
        $(button).remove()
    }

    $("#game-over").hide()
    $("#colour-picker").show()

    populateColourPicker()
    createBoard(7, 7)

}

$("#game-over").css("display", "none");

addEventListener("resize", () => {
    if (player1) {
        moveStomper(player1, player1.data("square"))
    }
    if (player2) {
        moveStomper(player2, player2.data("square"))
    }

})

$(() => {
    populateColourPicker()
    createBoard(7, 7)
    // populateBoard()
    // player1 = createStomper(1, "red", $($("#board").find(".square")[0]))
    // player2 = createStomper(2, "lightgreen", $($("#board").find(".square")[1]))
    // nextTurn()

})