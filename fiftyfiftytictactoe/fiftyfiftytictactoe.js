function createBoard(_x, _y) {

    for (let y = 0; y < _y; y++) {

        let row = $(`<div class="row"></div>`)
        row.data("y", y)

        $("#board").append(row)

        for (let x = 0; x < _x; x++) {
            
            let square = $(`<div class="square"></div>`)
            square.data("x", x)
            square.data("y", y)
            square.data("data", {"pieces":[]})

            row.append(square)

            // square.click(squareClicked)

        }

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

}

function createPiece(space) {

    let piece = $(`<div class="piece"></div>`)

    movePiece(piece, space)

    let moveInterval = setInterval(() => {
        movePiece(piece, piece.data("space"))
    }, 100)
    piece.data("moveInterval", moveInterval)

    $("#board").append(piece)

}

$(() => {
    createBoard(6, 6)
    createPiece($($("#board").find(".square")[0]))
})