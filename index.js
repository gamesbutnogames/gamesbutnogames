const views = ["#homepage"]
const gameData = [{
    title: "Cup Matching",
    url: "cupmatching",
    image: "cup.png",
    description: "Match the cups",
    rules: "Longer u take more u suck",
}, {
    title: "Shut The Doors",
    url: "shutthedoors",
    image: "shutthedoors.png",
    description: "Shut the doors",
    rules: "U will defo lose",
}, {
    title: "MazeSweeper",
    url: "mazesweeper",
    image: "mazesweeper.png",
    description: "Stomp the colours",
    rules: "Tbh idek what the fuck this one is",
}, {
    title: "Tic Tac Onion",
    url: "tictaconion",
    image: "tictaconion.png",
    description: "Onions",
    rules: "Ogres are like onions",
}, {
    title: "Noughts Or Crosses",
    url: "noughtsorcrosses",
    image: "noughtsorcrosses.png",
    description: "Like noughts and crosses but less balanced",
    rules: "This game isn't very fair",
}]

var selectedElement

function switchView(newView) {
    for (let view of views) {
        if (view != newView) $(view).hide()
    }
    $(newView).show()
}

switchView("#homepage")


function gameClicked(event) {

    // window.location.href = 

}

document.getElementById("info-close").addEventListener("click", () => {
    document.getElementById("info-box").style.display = "none"
    document.getElementById("screen-blocker").style.display = "none"
    gameCards.forEach(element => {
        element.tabIndex = 1
    })
})

document.addEventListener("keydown", event => {if (event.key == "Enter") document.activeElement.click()})
document.addEventListener("click", () => {
    if (selectedElement != undefined) {
        selectedElement.classList.remove("selected")
        selectedElement.querySelectorAll("button").forEach((buttonEl) => buttonEl.tabIndex = -1)
        selectedElement = undefined
}})

let gameCards = document.querySelectorAll(".gamecard")

gameCards.forEach((element, index) => {
    element.style.zIndex = gameCards.length - index
    element.addEventListener("click", (event) => {
        event.stopPropagation() // prevent click event being registered on document
        if (selectedElement != undefined) {
            selectedElement.classList.remove("selected")
            selectedElement.querySelectorAll("button").forEach((buttonEl) => buttonEl.tabIndex = -1)
        }
        element.classList.add("selected")
        element.querySelectorAll("button").forEach((buttonEl) => buttonEl.tabIndex = 1)
        selectedElement = element
    }) 
})

let infoButtons = document.querySelectorAll(".info-button")

infoButtons.forEach(element => {
    element.addEventListener("click", (event) => {
        console.log(gameData[gameData.length - element.parentElement.parentElement.style.zIndex])
        document.getElementById("info-icon").src = gameData[gameData.length - element.parentElement.parentElement.style.zIndex].image
        document.getElementById("play-info").href = `${gameData[gameData.length - element.parentElement.parentElement.style.zIndex].url}/index.html`
        document.getElementById("game-title").innerHTML = gameData[gameData.length - element.parentElement.parentElement.style.zIndex].title
        document.getElementById("description-info").innerHTML = gameData[gameData.length - element.parentElement.parentElement.style.zIndex].description
        document.getElementById("rules-info").innerHTML = gameData[gameData.length - element.parentElement.parentElement.style.zIndex].rules
        document.getElementById("info-box").style.display = "flex"
        document.getElementById("screen-blocker").style.display = "block"

        if (selectedElement != undefined) {
            selectedElement.classList.remove("selected")
            selectedElement.querySelectorAll("button").forEach((buttonEl) => buttonEl.tabIndex = -1)
            selectedElement = undefined
            event.stopPropagation()
        }
        gameCards.forEach(element => {
            element.tabIndex = -1
        })
    })
})