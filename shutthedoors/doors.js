function createDoors() {

    for (let n = 1; n < 13; n++) {

        var door = document.createElement("div")
        door.innerHTML = `
        <div class="back-door">
          <div class="door door-open">
          <div class="door-number-used">${n}</div>
          </div>
          <div class="door-number">${n}</div>
        </div>`
    
        $("#doors").append(door)

    }
    $(".back-door").click(closeDoor)

}

createDoors()


function closeDoor(event) {

  if (gameover) {
    return
  }

  let door = event.target
  if ((!pickingDoors) || (!$(door).find(".door").hasClass("door-open"))) {
    return
  }

  if (isValidDoor(door)) {
    $(door).children(".door").removeClass("door-open")
  }
}

function getOpenDoors() {
  let openDoors = []
  for (door of $("#doors").children()) {
      if ($(door).find(".door").hasClass("door-open")) {
        openDoors.push(door)
      }
  }
  return openDoors
}

function getRemainingNumbers() {

  let numbers = []

  for (door of getOpenDoors()) {
    numbers.push(parseInt($(door).find(".door-number").text()))
  }

  return numbers

}

var chosenDoors = 0

function isValidDoor(door) {

  let number = parseInt($(door).find(".door-number").text())

  if (number > currentNumber) {
    return false
  }

  
  if (number === currentNumber) {
    closedDoors()
    return true
  } else if (chosenDoors < 1) {
    let remainingNumbers = getRemainingNumbers()
    let remainder = currentNumber-number

    for (let other of remainingNumbers) {
      if (other === number) {
        continue
      } else if (other === remainder) {
        currentNumber -= number
        chosenDoors += 1
        return true
      }
    }


  }

  return false

}

function playCheck() {

  let remainingNumbers = getRemainingNumbers()

  if (remainingNumbers.includes(currentNumber)) {
    return true
  }

  for (number1 of remainingNumbers) {
    for (number2 of remainingNumbers) {

      if (number1 === number2) {
        continue
      }

      if ((number1 + number2) === currentNumber) {
        return true
      }

    }
  }

  return false
  

}

var gameover = false
var pickingDoors = false
var shaking = false
var currentNumber = 0

const shakeTime = 2000
var justShook = false

$("#random-numbers").hover(event => {
  if (pickingDoors || gameover) {
    return
  }
  if (justShook) {
    return
  }
  $("#d1").addClass("shake")
  $("#d2").addClass("shake2")
}, event => {
  $("#d1").removeClass("shake")
  $("#d2").removeClass("shake2")
  justShook = false
})

$("#random-numbers").click(event => {
  if (pickingDoors || shaking || gameover) {
    return
  }
  shaking = true
  justShook = true
  $("#d1").removeClass("shake")
  $("#d2").removeClass("shake2")
  $("#d1").addClass("shakeLarge")
  $("#d2").addClass("shakeLarge2")

  var numberChange = setInterval(() => {
    $("#d1").text(Math.ceil(Math.random()*6))
    $("#d2").text(Math.ceil(Math.random()*6))
  }, 50)

  setTimeout(() => {
    $("#d1").removeClass("shake")
    $("#d2").removeClass("shake2")
    $("#d1").removeClass("shakeLarge")
    $("#d2").removeClass("shakeLarge2")
    clearInterval(numberChange)
    rolledDice()
  }, shakeTime)

})

function rolledDice() {

  let number1 = parseInt($("#d1").text())
  let number2 = parseInt($("#d2").text())

  currentNumber = number1+number2

  $("#total").text(`= ${currentNumber}`)

  pickingDoors = true
  shaking = false

  let closedDoors = 12-getOpenDoors().length

  if (closedDoors >= 12) {
    endGame("Great Work! You Successfully Closed All 12 Doors!")
  } else if (!playCheck()) {
    endGame(`Nice Try! You Closed ${closedDoors} Doors`)
  }

}

function endGame(message) {
  $("#message").text(message)
  $("#gameover").slideDown()
  gameover = true
}

function closedDoors() {
  chosenDoors = 0
  pickingDoors = false
}

function restart() {
  $("#gameover").slideUp()
  for (door of $("#doors").children()) {
    $(door).find(".door").addClass("door-open")
  }
  $("#d1").text("")
  $("#d2").text("")
  $("#total").text(`= ?`)
  currentNumber = 0
  gameover = false
  pickingDoors = false
  chosenDoors = 0
  shaking = false
}

$("#gameover").css("display", "none");