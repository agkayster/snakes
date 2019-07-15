document.addEventListener('DOMContentLoaded', () => {


  const grid = document.querySelector('.grid')
  const squares = []
  const width = 11
  let userIndex = 115
  let alienIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let missileIndex = 
  let intervalId = null

  let direction = 1

  //using a let to assign null to the variable player, to use it anywhere we call player
  let player = null
  // let alien = null

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
  gridForGame()

  //Make my aliens ==============================================================
  function makeAlien (){
    alienIndex.forEach(alienIndex => {
      console.log(alienIndex, 'ai')
      squares[alienIndex].classList.add('alien')
    })

  }
  makeAlien()

  //Make my missile
  function makemissile(){

  }

  // Moving my player ===========================================================
  function moveMyPlayer() {
    //find the player in the user index array and assign it to player
    player = squares.find(square => square.classList.contains('player'))
    console.log(player, 'this is player =====>')
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
  moveMyAlien()


  // =========================================> Event Listener
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





// =======================================================> End of DOM
})

// let gameInPlay = false
// if (!gameInPlay)
//   return false
