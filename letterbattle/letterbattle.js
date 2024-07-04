
// if you spell a word, you lose
// if you make spelling a word impossible, you lose
// you may swap 2 adjacent letters or remove a letter each turn
// if you move a letter, the next player must remove one


var swapping = false
var removing = false
var selected = null
var turn = 1
var justSwapped = false

function createWord(word) {


    for (let i = 0; i < word.length; i++) {

        let letter = createLetter(word[i])
        letter.css("order", i)  
        letter.on("click", event => {
            letterClicked($(event.target))
        })

        $("#word").append(letter)

    }


}

function createLetter(l) {

    let letter = $(`<div class="letter">${l}</div>`)
    letter.data("letter", l)
    return letter

}

function toggleRemove() {
    removing = !removing
    $("#remove").toggleClass("selected")
    
}

function toggleSwap() {

    if ($("#swap").hasClass("disabled")) {
        return
    }

    swapping = !swapping
    $("#swap").toggleClass("selected")
    selected = null
}

function letterClicked(letter) {
    if (removing) {
        removeLetter(letter)
    } else if (swapping) {

        if (selected) {

            letter.toggleClass("selected")
            swapLetters(selected, letter)

        } else {
            selected = letter
            letter.toggleClass("selected")
        }
    }

}

function swapLetters(letter1, letter2) {

    let i1 = letter1.css("order")
    let i2 = letter2.css("order")

    letter1.css("order", i2)
    letter2.css("order", i1)

    letter1.removeClass("selected")
    letter2.removeClass("selected")

    letter1.addClass("swapped")
    letter1.on("animationend", () => {
        letter1.removeClass("swapped")
    })
    letter2.addClass("swapped")
    letter2.on("animationend", () => {
        letter2.removeClass("swapped")
    })


    selected = null
    justSwapped = true

    toggleSwap()
    endTurn()


}

function removeLetter(letter) {

    justSwapped = false

    letter.addClass("removed")
    letter.on("animationend", () => {
        letter.animate({width:'toggle'}, 100, () => {
            letter.remove()

        });
    })

    toggleRemove()
    endTurn()
}


function openHelp() {
    $("#help").show()
}

function closeHelp() {
    $("#help").hide()
}

createWord("INTERESTING")

function getOrderedWord() {

    let letters = []

    for (l of $("#word").children()) {
        let letter = $(l)

        if (letter.hasClass("removed")) {
            continue
        }

        if (letters.length <= 0) {
            letters.push(letter)
        } else {
            let done = false
            for (let o = 0; o < letters.length; o++) {
                if (parseInt(letter.css("order")) < parseInt(letters[o].css("order"))) {
                    letters.splice(o, 0, letter)
                    done = true
                    break
                }
            }
            if (!done) {
                letters.push(letter)
            }
        }
    }

    return letters

}

function getLetters(elements) {

    let word = ""

    for (letter of elements) {
        word += letter.text().toUpperCase()
    }

    return word

}

function checkWord() {


    let word = getLetters(getOrderedWord())

    if (allWords.includes(word) || !checkWordPossible(word)) {
        console.log("Loss :(")
    } else {
        console.log("All Good :)")
    }

}

function checkWordPossible(allLetters) {

    let letters = []
    
    for (letter of allLetters) {
        letters.push(letter)
    }

    let result = checkPermutation("", letters)
    return result
    
}


function checkPermutation(word, remaining) {

    for (let r = 0; r < remaining.length; r++) {

        let newWord = word.repeat(1)
        newWord += remaining[r]
        console.log(newWord)

        if (allWords.includes(newWord)) {
            return newWord
        } else if (remaining.length > 0) {

            let newRemaining = remaining.slice(0)
            newRemaining.splice(r, 1)
            let permutation = checkPermutation(newWord.repeat(1), newRemaining)
            if (permutation) {
                return permutation
            }

        }

    }

    return null


}



function endTurn() {

    checkWord()

    if (turn === 1) {
        turn = 2
        $("#readout").text("Player 2")
    } else {
        turn = 1
        $("#readout").text("Player 1")
    }

    if (justSwapped) {
        $("#swap").addClass("disabled")
    } else {
        $("#swap").removeClass("disabled")
    }


}