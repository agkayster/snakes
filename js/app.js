document.addEventListener('DOMContentLoaded', () => {


  const grid = document.querySelector('.grid')
  const squares = []
  const width = 11
  const score = document.querySelector('.score')
  const startGame = document.querySelector('h1')
  let userIndex = 115
  let alienIndex = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  let intervalId = null
  let scores = 0
  // let gameInPlay = null
  // let missileId = null
  // let missileIndex = userIndex

  let direction = 1

  //using a let to assign null to the variable player, to use it anywhere we call player
  let player = null

  // let alien = null
  // let missile = null

  // create grid ============================================================
  function gridForGame(){
    for(let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      squares.push(square)
      grid.appendChild(square)
    }
    // to put the player on the particular square for movement
    squares[userIndex].classList.add('player')

    //to put the alien on the particular squares for movement

    // squares[alienIndex].classList.add('alien')
  }
  // gridForGame()

  //Make my aliens ==============================================================
  function makeAlien (){
    alienIndex.forEach(alienIndex => {
      // console.log(alienIndex, 'ai')
      squares[alienIndex].classList.add('alien')
    })

  }
  // makeAlien()


  // Moving my player ===========================================================
  function moveMyPlayer() {
    //find the player in the user index array and assign it to player
    player = squares.find(square => square.classList.contains('player'))
    // console.log(player, 'this is player =====>')
    player.classList.remove('player')
    // to add back the player
    squares[userIndex].classList.add('player')
  }


  // Moving my Alien ============================================================
  function moveMyAlien(){
    intervalId = setInterval(() => {
      squares.forEach(square => square.classList.remove('alien'))
      alienIndex = alienIndex.map(alien => alien + direction)

      alienIndex.forEach(alien => {
        squares[alien].classList.add('alien')
      })
      //when aliens reach the end of the board
      if (alienIndex.some(alien => alien >= 110)) {
        clearInterval(intervalId)
      //   // endGame()
      //   // message.textContent = 'Aliens won'
      }
      const atLeftEdge = alienIndex[0] % width === 0
      const atRigthEdge = alienIndex[alienIndex.length - 1] % width === width - 1

      if((atLeftEdge && direction === -1) || (atRigthEdge && direction === 1)){
        direction = width
      }else if (direction === width) {
        if (atLeftEdge) direction = 1
        else direction = -1

      }
    },500)
  }
  // moveMyAlien()

  // Creating a function 'play' and putting all relevant callbacks()===========>
  function play(){
    gridForGame()
    makeAlien()
    moveMyAlien()

  }

  //To reset the game==========================================================>

  //   function reset() {
  //     if endGame = true{
  //
  // }
  //   }

  // Move my missile ==========================================================

  document.addEventListener('keydown', function (e) {
    let missileIndex = userIndex
    if (e.keyCode === 32) {
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

        }
      }, 200)
    }
  })
  //

  // =========================================> Event Listener for moveMyPlayer
  document.addEventListener('keydown', function (e) {
    // if (!gameInPlay)
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
  //================================================> Event listener to start games
  startGame.addEventListener('click', play)
  // startGame.addEventListener('click', reset)
  // userIndex = 115
  // alienIndex = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  // scores = 0
  // score.innerText = 0
  // clearInterval(intervalId)
  // clearInterval(missileId)

  //End game if all aliens are dead===================>
  function endGame(){
    if (alienIndex.length === 0){
      alert('Game Over!')
    }
  }







// =======================================================> End of DOM
})

// let gameInPlay = false
// if (!gameInPlay)
//   return false
