function createBoard(_x, _y) {

    for (let y = 0; y < _y; y++) {

        let row = $(`<div class="row"></div>`)
        row.data("y", y)

        $("#board").append(row)

        for (let x = 0; x < _x; x++) {
            
            let square = $(`<div class="square"></div>`)
            square.data("x", x)
            square.data("y", y)

            row.append(square)

            square.click(squareClicked)

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

function createPiece(colour, size, space=null) {

    let piece = $(`<div class="piece"></div>`)

    piece.data("space", space)
    piece.data("colour", colour)
    piece.data("size", size)

    piece.addClass(size)

    movePiece(piece, space)
    let moveInterval = setInterval(() => {
        movePiece(piece, piece.data("space"))
    }, 100)
    piece.data("moveInterval", moveInterval)

    piece.click(pieceClicked)

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
}

function squareClicked(event) {
    // let square = $(event.target)
    // let piece = $(`<div class="piece small"></div>`)
    // $("#board").append(piece)


}

function pieceClicked(event) {
    let piece = $(event.target)
    console.log(piece.data("size"))
}

$(() => {
    createBoard(4, 4)
    createPieces()
})