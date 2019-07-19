document.addEventListener('DOMContentLoaded', () => {

  //GLOBAL SCOPE================================>
  const grid = document.querySelector('.grid')
  const score = document.querySelector('span')
  const livesBoard = document.querySelector('.lives span')
  const startGame = document.querySelector('.start')
  // const overlay = document.querySelector('.overlay')
  // const hidden = document.querySelector('.hidden')
  const reset = document.querySelector('.reset')
  const message = document.querySelector('.para')
  const squares = []
  const width = 11
  let userIndex = 115
  const alienStart = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  let alienIndex = alienStart.slice()
  let intervalId = null
  let direction = 1
  let scores = 0
  let lives = 3
  let alienBombInterval = null
  let collisionInterval = null
  let currentPlayer = null
  // let gameInPlay = false
  let player = null


  const stopGame = document.querySelector('.stop')
  const pauseGame = document.querySelector('.pause')
  // const playAudio = document.querySelector('.sound')
  // let missileId = null


  // All my variables needed for my code

  //using a let to assign null to the variable player, to use it anywhere we call player

  // CREATE GRID ============================================================
  function gridForGame(){
    // creating my squares/grid using the width in my variable in a "for loop"
    for(let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      squares.push(square)
      grid.appendChild(  square)
    }
    // to put the player on the particular square for movement
    squares[userIndex].classList.add('player')
  }
  // call back for my grid to be used in my game
  gridForGame()

  // Creating a function 'PLAY GAME' to start the Game and putting all relevant callbacks()===========>
  function play(e){
    // gridForGame()
    makeAlien()
    moveMyAlien()
    lives = 3
    // overlay.style.display = 'none'
    // hidden.style.display = 'none'
    // gameInPlay = true
    livesBoard.textContent = lives
    e.target.removeEventListener('click', play)
    intervalId = setInterval(moveMyAlien, 500)
    alienBombInterval = setInterval(alienLaser, 700)
    collisionInterval = setInterval(alienCollision, 50)
  }

  // MOVING PLAYER FUNCTIONS ===========================================================
  function moveMyPlayer() {
    //find the player in the user index ID on the Grid and assign it to player
    player = squares.find(square => square.classList.contains('player'))
    player.classList.remove('player')
    // to add back the player
    squares[userIndex].classList.add('player')
    // for each time 'player' is removed, 'player' has to be added back
  }

  //ALIEN SHOOTING AT PLAYER====================================
  function alienLaser() {
    const bombIndex = alienIndex[Math.floor(Math.random() * (alienIndex.length-1))]
    alienBombs(bombIndex)
  }

  //ALIEN KILLING PLAYER====================================
  function alienCollision() {
    currentPlayer = squares[userIndex]
    if (currentPlayer.classList.contains('bomb')) {
      currentPlayer.classList.remove('bomb')
      if (lives > 0) {
        lives--
        livesBoard.textContent = lives
      }
      if (lives === 0) {
        console.log('lives', lives)
        endGame()
        message.textContent = 'You had just one job man!!! Earth has fallen!'
      }
    }
  }

  //MAKE MY ALIENS ==============================================================
  function makeAlien (){
    alienIndex.forEach(alienIndex => {
      squares[alienIndex].classList.add('alien')
    })

  }
  // makeAlien()



  // MOVE ALIENS FUNCTIONS ============================================================
  function moveMyAlien(){
    // using a 'forEach' to check for aliens in the square and move them
    squares.forEach(square => square.classList.remove('alien'))
    alienIndex = alienIndex.map(alien => alien + direction)

    alienIndex.forEach(alien => {
      squares[alien].classList.add('alien')
      //Each time 'alien' is removed, it is added back
    })
    //when aliens reach the end of the board
    if (alienIndex.some(alien => alien >= 110)) {
      clearInterval(intervalId)
      endGame()
    }
    // To ensure that aliens do not leave the grid
    const atLeftEdge = alienIndex[0] % width === 0
    const atRigthEdge = alienIndex[alienIndex.length - 1] % width === width - 1
    // Ensure that when aliens reach the end, the drop down a square synchronously
    if((atLeftEdge && direction === -1) || (atRigthEdge && direction === 1)){
      direction = width
    }else if (direction === width) {
      if (atLeftEdge) direction = 1
      else direction = -1

    }
  }

  // moveMyAlien()

  //MAKE ALIEN BOMBS===========================================================>
  function alienBombs(bombIndex){
    let alienBombIndex = bombIndex + width
    let alienBomb = squares[alienBombIndex]
    const bombInterval = setInterval(() => {
      if (alienBomb)
        alienBomb.classList.remove('bomb')
      if (alienBombIndex + width >= width ** 2)
        clearInterval(bombInterval)
      else if (alienBomb) {
        alienBombIndex += width
        alienBomb = squares[alienBombIndex]
        alienBomb.classList.add('bomb')
      }
    }, 50)
  }

  //================================================> Event listener to start game
  startGame.addEventListener('click', play)


  //RESET GAME==========================================================>
  reset.addEventListener('click', () => {
    alienIndex = alienStart.slice()
    makeAlien()
    moveMyAlien()
    scores = 0
    score.innerText = scores
    lives = 3
    livesBoard.textContent = lives
    clearInterval(collisionInterval)
    clearInterval(intervalId)
    intervalId = setInterval(moveMyAlien, 500)
    collisionInterval = setInterval(alienCollision, 50)
  })

  // MISSILE MOVEMENT ==========================================================

  document.addEventListener('keydown', function (e) {
    let missileIndex = userIndex
    if (e.keyCode === 38) {
      const missileId = setInterval(() => {
        if(missileIndex - width >=0) {
          squares[missileIndex].classList.remove('missile')
          missileIndex -= width
          squares[missileIndex].classList.add('missile')
        } else {
          squares[missileIndex].classList.remove('missile')
        } if(squares[missileIndex].classList.contains('alien')) {
          squares[missileIndex].classList.remove('missile', 'alien')
          clearInterval(missileId)
          const newAlienIndex = alienIndex.indexOf(missileIndex)
          alienIndex.splice(newAlienIndex, 1)
          scores++
          endGame()
          // console.log(score)
          score.innerText = scores
          // hidden.style.display = 'flex'

        }
      }, 200)
    }
  })


  // =========================================> Event Listener for moveMyPlayer
  document.addEventListener('keydown', function (e) {
    // if (!gameInPlay)
    //   return false
    switch(e.keyCode) {
      //move left
      case 37:
        if (userIndex % width !== 0) {
          userIndex-= 1
          moveMyPlayer()
        }
        break
        //move right
      case 39:
        if(userIndex % width < width - 1) {
          userIndex += 1
          moveMyPlayer()
        }
        break
    }
  })


  //END GAME IF ALIENS ARE DEAD===================>
  function endGame(){
    if (alienIndex.length === 0){
      message.textContent = 'Well done!'
    }else if(alienIndex.some(alien => alien >= 110)){
      message.textContent = 'You lose!'
    }else{
      // message.textContent = 'you win'
    }

    // clearInterval(collisionInterval)
    // // clearInterval(intervalId)
    // clearInterval(alienBombInterval)

    // gameInPlay = false

  }

  //================================================> Event listener to stop game
  stopGame.addEventListener('click', stopMyGame)

  //STOP GAME==========================================>
  function stopMyGame(){
    alienIndex.splice(0, alienIndex.length)
    // alienIndex = alienStart.slice()
    // makeAlien()
    // moveMyAlien()
    scores = 0
    score.innerText = scores
    clearInterval(intervalId)
    squares.forEach(square => square.classList.remove('alien'))
  }
  // stopMyGame()

  //================================================> Event listener to pause game
  pauseGame.addEventListener('click', pauseMyGame)

  //PAUSE GAME========================================>
  function pauseMyGame(e){
    if (e.target.innerHTML === 'PAUSE GAME') {
      // alienIndex.splice(0, alienIndex.length)
      // scores = 0
      // score.innerText = scores
      clearInterval(intervalId)
      clearInterval(alienBombInterval)
      // clearInterval(bombInterval)
      e.target.innerHTML = 'play'
    } else if (e.target.innerHTML === 'play') {
      intervalId = setInterval(moveMyAlien, 500)
      alienBombInterval = setInterval(alienLaser, 700)

      e.target.innerHTML = 'PAUSE GAME'

    }
  }
  //play game audio===================================>

  // function gameSound(){
  //   playAudio.play()
  // }
  // gameSound()







// =======================================================> End of DOM
})
