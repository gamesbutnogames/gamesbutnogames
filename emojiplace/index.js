// var socket = new WebSocket("ws://"+location.host)
var socket = new WebSocket("wss://"+"misc.gamesbutnogames.com:8080")


socket.sendData = (data) => {
    socket.send(JSON.stringify(data))
}

socket.onerror = (event) => {

}

socket.onclose = (event) => {

}

socket.onopen = (event) => {

    retrieveAllSections()

}

socket.onmessage = (raw) => {
    let data = JSON.parse(raw.data)

    switch(data.type) {
        
        case "updateEmoji":
            updateEmoji(data.x, data.y, data.emoji)
        break;

        case "section":
            updateToSection(data.section)
        break;

        case "allSections":
            updateSections(data.sections)

    }

}


var selectedEmoji = "😀"
var currentSection = null

function createSquares(width, height) {


    for (let y = 0; y < height; y++) {

        let row = $(`<div class="row"></div>`)

        $("#grid").append(row)

        for (let x = 0; x < width; x++) {
            let square = $(`<div class="square">⬜</div>`)
            square.data("x", x)
            square.data("y", y)
            square.on("click", squareClicked)
            row.append(square)
            
        }
    }


  }

function updateToSection(grid) {

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            updateEmoji(x, y, grid[x][y])
        }
    }

}

function clearSection() {
    for (let x = 0; x < $("#grid").children().length; x++) {
        for (let y = 0; y < $("#grid").children().length; y++) {
            let square = $($($("#grid").children().eq(y)).children().eq(x))
            square.text("⬜")
        }
    }
}

function retrieveSection(section) {
    socket.sendData({type:"section", section:section})
}


function updateEmoji(x, y, emoji) {

    let square = $($($("#grid").children().eq(y)).children().eq(x))

    if (square.text() !== emoji) {

        square.removeClass("grow")
        square.addClass("shrink")

        square.on("animationend", () => {
            square.text(emoji)
            square.addClass("grow")
            square.removeClass("shrink")
            square.on("animationend", () => {
                square.removeClass("grow")
            })
        })

    }

}

function squareClicked(event) {

    let square = $(event.target)

    if (square.text() !== selectedEmoji) {

        socket.sendData({type:"change", section:currentSection, x:square.data("x"), y:square.data("y"), emoji:selectedEmoji})

    }

}

function changeEmojiClicked(event) {
    $("#picker").show()
}


function changeEmoji(detail) {

    selectedEmoji = detail.unicode

    $("#selected").text(selectedEmoji)
    $("#picker").hide()


}

function updateSections(sections) {

    for (child of $("#sections").children()) {
        $(child).remove()
    }

    let row = $(`<div class="section-row"></div>`)
    $("#sections").append(row)
    count = 0

    for (n of Object.keys(sections)) {

        if (count >= 3) {
            count = 0
            row = $(`<div class="section-row"></div>`)
            $("#sections").append(row)
        }

        let section = $(`<div class="section"><div class="section-icon"></div><div class="section-icon"></div><div class="section-icon"></div></div>`)
        section.data("name", n)

        for (let i = 0; i < sections[n].icons.length; i++) {
            if (sections[n].icons[i]) {
                $(section.children().eq(i)).text(sections[n].icons[i])
            } else {
                $(section.children().eq(i)).text("⬜")

            }
        }

        section.on("click", sectionClicked)

       row.append(section)

        count += 1

    }

}

function retrieveAllSections() {
    socket.sendData({type:"allSections"})
}

function sectionClicked(event) {

    let section = $(event.target)

    $("#home-view").hide()
    $("#section-view").show()
    currentSection = section.data("name")
    retrieveSection(currentSection)


}

function homeClicked(event) {
    retrieveAllSections()
    $("#section-view").hide()
    $("#home-view").show()
    clearSection()

}


$("#picker").hide()
$("#section-view").hide()

document.querySelector("emoji-picker").addEventListener("emoji-click", event => changeEmoji(event.detail));


createSquares(10, 10)