
$(()=>{

   let windowWidth = window.innerWidth
   let windowHeight = window.innerHeight
   let initialAudio = new Audio('../assets/friendbotInitialAudio.mp3')
   
   initialAudio.addEventListener('ended', ()=>{
      if($('.mainWrapper').find('#friendbotInfo').text() == 'Pausar o áudio'){
         $('.mainWrapper').find('#friendbotInfo').text('Escute o Friendbot')
      }
   })

   let finalAudio = new Audio('../assets/friendbotFinalAudio.mp3')

   finalAudio.addEventListener('ended', ()=>{
      if($('.mainWrapper').find('#friendbotFinalInfo').text() == 'Pausar o áudio'){
         $('.mainWrapper').find('#friendbotFinalInfo').text('Escute o Asteróide')
      }
   })

   let friendbotImageDiv = '<div id="friendbotImgDiv" class="w-50"></div>'
   let btnsDiv = '<div id="btnsDiv" class="w-50 h-75 p-2"></div>'
   let btnListenToFriendbot = '<div><button id="friendbotInfo" class="btn-success w-100 p-2">Escute o Asteróide</button></div>'
   let btnSkipToGame = '<div><button id="skipToGame" class="btn-primary w-100 p-2 mt-3">Ajudar o Asteróide</button></div>'
   let infoPreGame = '<div id="infoPreGame" class="d-flex flex-row w-100 h-100"></div>'

  $('.mainWrapper').on('click', '#letsGoBtn', () => {
      $('#mainRow').removeClass('h-50').addClass('h-100')
      $('#letsGoBtn').remove()
      $('#letsGoDiv').append(infoPreGame)
      $('#infoPreGame').append(btnsDiv)
      $('#infoPreGame').append(friendbotImageDiv)
      $('#btnsDiv').append(btnListenToFriendbot)
      $('#btnsDiv').append(btnSkipToGame)
  })

  $('.mainWrapper').on('click','#friendbotInfo', ()=>{
     console.log('clicked')
     if($('#friendbotInfo').text() == 'Escute o Asteróide'){
         initialAudio.play()
         $('#friendbotInfo').text('Pausar o áudio')  
     } else if($('#friendbotInfo').text() == 'Pausar o áudio'){
        initialAudio.pause()
        $('#friendbotInfo').text('Escute o Asteróide')
     }
  })

  $('.mainWrapper').on('click','#friendbotFinalInfo', ()=>{
   console.log('clicked')
   if($('#friendbotFinalInfo').text() == 'Escute o Asteróide'){
       finalAudio.play()
       $('#friendbotFinalInfo').text('Pausar o áudio')  
   } else if($('#friendbotFinalInfo').text() == 'Pausar o áudio'){
      finalAudio.pause()
      $('#friendbotFinalInfo').text('Escute o Asteróide')
   }
})

  $('.mainWrapper').on('click', '#skipToGame', ()=>{
     initialAudio.pause()
     $('.mainWrapper').find('.container').remove()
     $('.mainWrapper').append('<div id="gameCanvas"></div>')
     startGame()
  })

  $('.mainWrapper').on('click', '#tryAgain', ()=>{
   $('.mainWrapper').find('.container').remove()
   $('.mainWrapper').append('<div id="gameCanvas"></div>')
   startGame()
  })

  $('.mainWrapper').on('click', '#backToStart', ()=>{
   window.location.href = '/'
})


   var gameWidth = 800
   var gameHeight = windowHeight < 600 ? 500 : 600 


  // GAME VARIABLES
  const startGame = () => {
   var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO,'gameCanvas', { preload: preload, create: create, update: update })
  
  
   // GAME LOGIC
   var round = 1
   var flagRocks = false
   var rocksPosition = []
   var flagRockets = false
   var rocketsPosition = []
   var score = {
      progress: 0,
      energy:100,
   }
   var playerDirection = 'right'
   var buttonUp
   var buttonLeft
   var buttonDown
   var buttonRight
   var isButtonUp
   var isButtonDown
   var isButtonLeft
   var isButtonRight
   
   // GAME SPRITES
   var platforms
   var rocks
   var player
   var rockets
   var progressBar
   var energyBar
   var energyBarMask
   var progressBarMask
 
   function handleRocksCollision(player, rock){
      if(playerDirection == 'left'){
       player.animations.play('damageLeft')   
      } else if(playerDirection == 'right'){
         player.animations.play('damageRight')
      }
      score.energy = score.energy - 10
      rock.kill()
   }
 
   function handleRocketsCollision(player, rocket){
       score.progress = score.progress + 10
       rocket.kill()
   }
 
   function checkRocks2 () {
       let isAlive = []
       rocksPosition.forEach((i) => {
          if(i.alive == true) {
             isAlive.push('true')
          } else if(i.alive == false){
             isAlive.push('false')
          }
       })
       if(isAlive.includes('true')) {
          flagRocks = true
       } else {
          flagRocks = false
       }
   }

    function checkRockets (){
       if(rocketsPosition.length != 0){
          if(rocketsPosition[rocketsPosition.length -1].x <= 0){
             
             flagRockets = false
          } else{
             flagRockets = true
          }
       }else{
          flagRockets = false
       }
    }
 
 
    function createRocks(){
       if(flagRocks == false){
           rocksPosition = []
           for(let i = 0; i < round; i++){
           
             let rock = rocks.create(Math.random() * (gameWidth - 200 - (20*i) + 1) + gameWidth, Math.random()*(gameHeight - 100 + 1), 'rock')
                rock.scale.setTo(0.3,0.3)
                rock.body.gravity.y = 0
                rocksPosition.push(rock)
          
          }
       }
   }
 
   function createRockets(){
    if(flagRockets == false){
        rocketsPosition = []
        for(let i = 0; i < 1; i++){
             let rocket = rockets.create(Math.random() * (gameWidth - 300 + 1) + gameWidth, Math.random()* (gameHeight - 100  + 1), 'rocket')
             rocket.scale.setTo(3,3)
             rocket.body.gravity.y = 0
             rocketsPosition.push(rocket)        
        }
        round++
       }
    }
 
    function updateScore() {
       progressBarMask.clear()
       progressBarMask.beginFill(0x00ff00)
       progressBarMask.drawRoundedRect(0, 0, (score.progress * (progressBar.width/100)), progressBar.height, 9)
 
       energyBarMask.clear()
       energyBarMask.beginFill(0xff0000)
       energyBarMask.drawRoundedRect(0, 0, (score.energy * (energyBar.width/100)), energyBar.height, 9)
    }

   function actionOnClickUp(){
      isButtonUp = true 
   }
   
   function actionOnClickLeft(){
      isButtonLeft = true
   }
   
   function actionOnClickDown(){
      isButtonDown = true
   }

   function actionOnClickRight(){
      isButtonRight = true
   }

   function resize() {
      var canvas = game.canvas 
      var width = document.getElementsByClassName('mainWrapper')[0].offsetWidth
      var height = window.innerHeight
      var wratio = width / height
      var ratio = canvas.width / canvas.height;

      if (wratio < ratio) {
            canvas.style.width = width + 'px'
            canvas.style.height = (width / ratio) + 'px'
      } else {
            canvas.style.width = (height * ratio) + 'px'
            canvas.style.height = height + 'px'
      }
   }
 
    function checkScore() {
       if(score.progress == 100){
          game.destroy(true, false)
          $('.mainWrapper').find('#gameCanvas').remove()
          $('.mainWrapper').append('<div class="container h-50"><div id="mainRow" class="row h-75"></div></div>')
          $('.mainWrapper').find('#mainRow').append('<div class="col md-10 lg-8 d-flex p-2 initialMessage"></div>')
          $('.mainWrapper').find('.initialMessage').append('<div id="finalMessageDiv" class="w-50 h-75 p-1 mr-2"></div>')
          $('.mainWrapper').find('#finalMessageDiv').append('<div class="text-center mb-5"><p style="color:green;margin-bottom:0;">Muito obrigado amigo!</p><p style="color:green;">Você me salvou!</p></div>')
          $('.mainWrapper').find('#finalMessageDiv').append('<div id="finalBtnsDiv" class="w-100 h-75 p-1"></div>')
          $('.mainWrapper').find('#finalBtnsDiv').append('<div class="w-100 mb-2"><button id="friendbotFinalInfo" class="btn-success w-100 p-1 rounded">Escute o Asteróide</button></div>')
          $('.mainWrapper').find('#finalBtnsDiv').append('<div class="w-100"><button id="backToStart" class="btn-primary w-100 p-1 rounded">Voltar ao início</button></div>')
          $('.mainWrapper').find('.initialMessage').append(friendbotImageDiv)
       } else if(score.progress !== 100 && score.energy == 0){
         game.destroy(true, false)
         $('.mainWrapper').find('#gameCanvas').remove()
         $('.mainWrapper').append('<div class="container h-50"><div id="mainRow" class="row h-75"></div></div>')
         $('.mainWrapper').find('#mainRow').append('<div class="col md-10 lg-8 d-flex p-2 initialMessage"></div>')
         $('.mainWrapper').find('.initialMessage').append('<div id="finalMessageDiv" class="w-50 h-75 p-1"></div>')
         $('.mainWrapper').find('#finalMessageDiv').append('<div class="text-center mb-5"><p style="color:red; margin-bottom:0">Não foi desta vez!</p><p style="color:red;">Tente de novo!</p></div>')
         $('.mainWrapper').find('#finalMessageDiv').append('<div id="finalBtnsDiv" class="w-100 h-75 p-1"></div>')
         $('.mainWrapper').find('#finalBtnsDiv').append('<div class="d-flex justify-content-center"><button id="tryAgain" class="btn-primary w-75">Tente de novo!</button></div>')
         $('.mainWrapper').find('.initialMessage').append(friendbotImageDiv)
       } else {
          return
       }
    }
 
    function preload() {
       game.load.image('background','../assets/background6.jpg')
       game.load.image('ground','../assets/lunar_surface.png')
       game.load.spritesheet('astronaut','assets/astronaut_sprite_5_2.png',38, 45)
       game.load.image('rock', 'assets/pedra.png')
       game.load.image('rocket', 'assets/foguete.png')
       game.load.image('progressBar', 'assets/progressBar.png')
       game.load.image('energyBar', 'assets/lifeBar.png')
       game.load.image('buttonUp','assets/buttonUpPressed.png')
       game.load.image('buttonLeft','assets/buttonLeftPressed.png')
       game.load.image('buttonDown','assets/buttonDownPressed.png')
       game.load.image('buttonRight','assets/buttonRightPressed.png')
       game.load.image('buttonUpBig','assets/buttonUpPressedBigger.png')
       game.load.image('buttonLeftBig','assets/buttonLeftPressedBigger.png')
       game.load.image('buttonDownBig','assets/buttonDownPressedBigger.png')
       game.load.image('buttonRightBig','assets/buttonRightPressedBigger.png')
    }
 
    function create() {
      window.addEventListener('resize', resize)
      resize()
   
   
      // Enabling Arcade Physics System
      game.physics.startSystem(Phaser.Physics.ARCADE)
   
      // sky
      game.add.sprite(0,0,'background')
   
      
      // Platforms group will contain ground and a platform for testing obstacles functionality
      platforms = game.add.group()
   
      // Enabling physics for objects belonging to platforms group
      platforms.enableBody = true
      // Ground creation
      var ground = platforms.create(0, game.world.height - 40, 'ground')
      // Scale 'ground' object to fit the width of the game
      ground.scale.setTo(2,2)
      ground.body.immovable = true
      
     // rocks
     rocks = game.add.group()
     rocks.enableBody = true
     
     // rockets
     rockets = game.add.group()
     rockets.enableBody = true
    
     // player
     player = game.add.sprite(50, game.world.height - 150, 'astronaut')
     player.scale.setTo(2,2)
     game.physics.arcade.enable(player)
     player.body.bounce.y = 0.2
     player.body.gravity.y = 70
     player.body.collideWorldBounds = true
     player.animations.add('walkLeft', [14,15,16,17,18,19,20], 10, true)
     player.animations.add('walkRight', [0,1,2,3,4,5,6,7], 10, true)
     player.animations.add('moveRight', [70,71,72,73], 30, true)
     player.animations.add('moveLeft', [56,57,58,59], 10, true)
     player.animations.add('damageRight', [99,100,101,102,103], 5, true)
     player.animations.add('damageLeft', [106,105,104,103], 5, true)
     
     // Progress bar
     progressBar = game.add.sprite(120, 16, 'progressBar')
 
     // Progress bar mask
     progressBarMask = game.add.graphics(120,16)
     
     // Energy bar
     energyBar = game.add.sprite(120, 46, 'energyBar')
    
     // Energy Bar mask
     energyBarMask = game.add.graphics(120, 46)
     energyBarMask.beginFill(0xff0000)
     energyBarMask.drawRoundedRect(0, 0, (10*energyBar.width/10), energyBar.height, 9)
       
     scoreText2 = game.add.text(16, 14, 'Progresso', { fontSize: '20px', fill:'#ffffff' })
     scoreText3 = game.add.text(16, 44, 'Energia', { fontSize: '20px', fill:'#ffffff' })

     // Buttons
     /*if(!windowWidth < 600){
      buttonUp = game.add.button(800 - 100, 400,'buttonUp', ()=> console.log('up') , this)
      buttonUp.onInputUp.add(()=> isButtonUp = false, this)
      buttonUp.onInputDown.add(()=> isButtonUp = true, this)
    
      buttonLeft = game.add.button(800 - 140, 440,'buttonLeft', ()=> console.log('left') , this)
      buttonLeft.onInputUp.add(()=> isButtonLeft = false, this)
      buttonLeft.onInputDown.add(()=> isButtonLeft = true, this)
    
      buttonDown = game.add.button(800 -100, 480,'buttonDown', ()=> console.log('down') , this)
      buttonDown.onInputUp.add(()=> isButtonDown = false, this)
      buttonDown.onInputDown.add(()=> isButtonDown = true, this)
    
      buttonRight = game.add.button(800 - 60, 440,'buttonRight', ()=> console.log('right') , this)
      buttonRight.onInputUp.add(()=> isButtonRight = false, this)
      buttonRight.onInputDown.add(()=> isButtonRight = true, this)  
   } else if(windowWidth < 600 ){*/
      buttonUp = game.add.button(800 - 140, 400,'buttonUpBig', ()=> console.log('up') , this)
      buttonUp.onInputUp.add(()=> isButtonUp = false, this)
      buttonUp.onInputDown.add(()=> isButtonUp = true, this)
    
      buttonLeft = game.add.button(800 - 210, 440,'buttonLeftBig', ()=> console.log('left') , this)
      buttonLeft.onInputUp.add(()=> isButtonLeft = false, this)
      buttonLeft.onInputDown.add(()=> isButtonLeft = true, this)
    
      buttonDown = game.add.button(800 -140, 480,'buttonDownBig', ()=> console.log('down') , this)
      buttonDown.onInputUp.add(()=> isButtonDown = false, this)
      buttonDown.onInputDown.add(()=> isButtonDown = true, this)
    
      buttonRight = game.add.button(800 - 70, 440,'buttonRightBig', ()=> console.log('right') , this)
      buttonRight.onInputUp.add(()=> isButtonRight = false, this)
      buttonRight.onInputDown.add(()=> isButtonRight = true, this)
   
   }
 
    function update() { 
        
       rocksPosition.forEach((rock)=> {
          if(rock.x <= 30) {
             rock.kill()
          }
          rock.x = rock.x - (1 + (0.1*round))
       })
       rocketsPosition.forEach((rocket) => {
          if(rocket.x <= 30) {
             rocketsPosition.filter((i) => i !== rocket)
             rocket.kill()
          }
          rocket.x = rocket.x - (1 + (0.05 * round))
       })
       var cursors = game.input.keyboard.createCursorKeys()
       var playerHitsPlatform = game.physics.arcade.collide(player, platforms)
       
       player.body.velocity.x = 0
       if((cursors.up.isDown || isButtonUp) && !playerHitsPlatform){
          player.body.velocity.y = -30
          player.position.y -= 3
          if(playerDirection == 'right'){
             player.animations.play('moveRight')
          } else if(playerDirection == 'left') {
             player.animations.play('moveLeft')
          }
       } else if((cursors.down.isDown || isButtonDown) && !playerHitsPlatform) {
          player.body.velocity.y = 30
          player.position.y += 3
       } else if((cursors.right.isDown || isButtonRight) && !playerHitsPlatform) {
          if(playerDirection !== 'right'){
             playerDirection = 'right'
          }
          player.body.velocity.x = 30
          player.position.x += 3
          player.animations.play('moveRight')
       }  else if((cursors.left.isDown || isButtonLeft) && !playerHitsPlatform){
          if(playerDirection !== 'left'){
             playerDirection = 'left'
          }
          player.body.velocity.x = 30
          player.position.x -= 3
          player.animations.play('moveLeft')
       } else if(playerHitsPlatform) {
          if(cursors.right.isDown || isButtonRight){
             if(playerDirection !== 'right'){
                playerDirection = 'right'
             }
             player.body.velocity.x = 20
             player.position.x += 2
             player.animations.play('walkRight')
          } else if(cursors.left.isDown || isButtonLeft){
             if(playerDirection !== 'left'){
                playerDirection = 'left'
             }
             player.body.velocity.x = -20
             player.position.x -= 2
             player.animations.play('walkLeft')
          } else if(cursors.up.isDown || isButtonUp) {
             if(playerDirection == 'left'){
                player.frame = 28
                player.body.velocity.y = -30
                player.position.y -= 3
             } else if(playerDirection == 'right'){
                player.body.velocity.y = 30
                player.position.y +=  3
                player.frame = 70
             }   
          } else {
             if(playerDirection == 'left'){
                player.frame = 28   
             } else if(playerDirection == 'right'){
                player.frame = 70
             }   
          }
       } else{
          if(playerDirection == 'left'){
             player.frame = 28   
          } else if(playerDirection == 'right'){
             player.frame = 70
          }
      }
           
       game.physics.arcade.overlap(player, rocks, handleRocksCollision, null, this)
       game.physics.arcade.overlap(player, rockets, handleRocketsCollision, null, this)
 
       checkRocks2()
       checkRockets()
       createRocks()
       createRockets()
       updateScore()
       checkScore()
 
     }
  }
})
  