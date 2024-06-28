
// if you spell a word, you lose
// if you make spelling a word impossible, you lose
// you may swap 2 adjacent letters or remove a letter each turn
// if you move a letter, the next player must remove one


function createWord(word) {


    for (l of word) {

        let letter = createLetter(l)

        $("#word").append(letter)

    }


}

function createLetter(l) {

    let letter = $(`<div class="letter">${l}</div>`)
    letter.data("letter", l)
    return letter

}

function deletePressed() {
    $("#delete").addClass("selected")
}

function swapPressed() {
    $("#swap").addClass("selected")

}


function openHelp() {
    $("#help").show()
}

function closeHelp() {
    $("#help").hide()
}

createWord("HELLO")