// Obstacles class

class Obstacle {
    // FIELD sprite or group (PRIVATE) defined by constructor
    type
    //  FIELD sprite or spritesheet (PRIVATE) defined by constructor
    typeSprite
    // FIELD key value (PRIVATE)  Defined by constructor 
    keyID 
    // FIELD sprite file (PRIVATE) Defined by constructor
    file
    // FIELD  { name: { frameSeq: [], numFrames: Number, boolean}}
    animations
    // reference to a Sprite Object or Group Object 
    reference
    // CONSTRUCTOR
    constructor(game, type, typeSprite, keyID, file){
        this.game = game
        this.type = type
        this.typeSprite = typeSprite
        this.keyID = keyID
        this.file = file
    }
    
    // #type GETTER
    getType(){
        return this.type
    }
    
    // #type SETTER
    setType(type){
        if(type !== 'sprite' && type !== 'group') throw new Error('The type provided is not allowed')
        this.type = type
    }
    
    // #typeSprite  GETTER
    getTypeSprite() {
        return this.typeSprite
    }
    
    // #typeSprite SETTER
    setTypeSprite(typeSprite){
        if(typeSprite !== 'single' && typeSprite !== 'spriteSheet') throw new Error ('The typeSprite provided is not allowed')
        this.typeSprite = typeSprite
    }

    // #keyID GETTER 
    getKeyID() {
        return this.keyID
    }
    
    // #keyID SETTER 
    setKeyID(keyID) {
        this.keyID = keyID
    }

    // #file GETTER 
    getFile() {
        return this.file
    }

    // #file SETTER 
    setFile(file) {
        this.file = file
    }

    // #animations GETTER
    getAnimations(){
        return this.animations
    }

    // #animations SETTER
    setAnimations(animations){
        this.animations = animations
    }

    // method called inside Phaser preload()
    preload(dimensions=[]) {
        if(this.typeSprite === 'single'){
            this.game.load.image(this.keyID,this.file)
        } else if (this.typeSprite === 'spriteSheet' && dimensions.length !== 2){
            throw new Error ('Provide dimensions array with 1st element as spriteFrame width and 2nd element as spriteFrame height')
            
        } else if (this.typeSprite === 'spriteSheet' && dimensions.length === 2){
            this.game.load.spritesheet(this.keyID, this.file, dimensions[0], dimensions[1])
        }
    }

    addAnimations(ref){
        this.animations.forEach(i => {
            ref.animations.add(i.name, i.frames, i.framesPerSec, true)
        })
    }

    // method called inside Phaser create() to create a Phaser.Sprite object or to create a group of Phaser.Sprite objects ->  sets reference 
    create(enablePhysics, instanceParams=[]) {
        if(this.type === 'sprite'){
            let ref = this.game.add.sprite(instanceParams[0].positions[0], instanceParams[0].positions[1], this.keyID)
            this.reference = ref
            if(enablePhysics) this.game.physics.arcade.enable(this.reference)
            if(instanceParams[0].scale && instanceParams[0].scale.setScale && instanceParams[0].scale.setScale  === true) this.reference.scale.setTo(instanceParams[0].scale.params[0], instanceParams[0].scale.params[1])
            if(instanceParams[0].gravity && instanceParams[0].gravity.setGravity && instanceParams[0].gravity.setGravity === true) this.reference.body.gravity.y = instanceParams[0].gravity.gravityY
            if(instanceParams[0].collideWorldBounds && instanceParams[0].collideWorldBounds === true) this.reference.body.collideWorldBounds = true
            if(instanceParams[0].addAnimations && instanceParams[0].addAnimations === true) this.addAnimations(this.reference)
            if(instanceParams[0].immovable && instanceParams[0].immovable === true) this.reference.body.immovable = true
        } else if(this.type === 'group'){
            let ref = this.game.add.group()
            this.reference = ref
            if(enablePhysics === true) {
                this.reference.enableBody = true
            }
            instanceParams.forEach((i,k)=>{
                var k = this.reference.create(i.positions[0], i.positions[1], this.keyID)
                if(i.scale && i.scale.setScale && i.scale.setScale === true) k.scale.setTo(i.scale.params[0],i.scale.params[1])
                if(i.gravity && i.gravity.setGravity && i.gravity.setGravity === true) k.body.gravity.y = i.gravity.gravityY
                if(i.collideWorldBounds && i.collideWorldBounds === true) k.body.collideWorldBounds = true
                if(i.animations && i.animations.addAnimations && i.animations.addAnimations === true) this.addAnimations(k)
                if(i.animations && i.animations.playAnimation[0] && i.animations.playAnimation[0] === true) {           
                    k.animations.play(i.animations.playAnimation[1])
                }
                if(i.immovable && i.immovable === true) k.body.immovable = true
            })
        }
    }

    // method called inside Phaser update() to allow for collision detection among differente objects
    collide(withWhat, callback){
        if(callback != null) return this.game.physics.arcade.collide(this.reference, withWhat, callback)
        return this.game.physics.arcade.collide(this.reference, withWhat)
    }

    // overlab(withWhat, callback)
    // method called inside Phaser update() to allow programming response to objects' overlap
    overlap(withWhat, callback){
        this.game.physics.arcade.overlap(this.reference, withWhat, callback)    
    }
}

class Score {
    #livesToSave
    #health
    #timeRemaining
    #scoreText1 // {text: String, positions: [w,h], style:{}}
    #scoreText2 // {text: String, positions: [w,h], style:{}}
    #scoreText3 // {text: String, positions: [w,h], style:{}}
    #userMessage // {text: String, positions: [w,h], style:{}}
    game
    
    constructor(game, livesToSave, health, initialTime){
        this.#livesToSave = livesToSave
        this.#health = health
        this.#timeRemaining = initialTime
        this.game = game
    }

    // #livesToSave GETTER
    getLivesToSave(){
        return this.#livesToSave
    }

    // #livesToSave SETTER
    setLivesToSave(livesToSave){
        this.#livesToSave = livesToSave
    }

    // #health GETTER
    getHealth(){
        return this.#health
    }

    // #health SETTER
    setHealth(health) {
        this.#health = health
    }

    // #timeRemaining GETTER
    getTimeRemaining(){
        return this.#timeRemaining
    }

    // $timeRemaining SETTER
    setTimeRemaining(timeRemaining){
        this.#timeRemaining = timeRemaining
    }

    // #scoreTest1 CREATION
    createScoreText1(params){
        this.#scoreText1 = this.game.add.text(params.positions[0], params.positions[1], params.text, params.style)
    }

    // #scoreTest1 GETTER
    getScoreText1() {
        return this.#scoreText1.text
    }
    
    // #scoreText1 SETTER
    setScoreText1(scoreText){
        this.#scoreText1.text = scoreText
    }

    
    // #scoreTest2 CREATION
    createScoreText2(params){
        this.#scoreText2 = this.game.add.text(params.positions[0], params.positions[1], params.text, params.style)
    }
    
    // #scoreTest2 GETTER
    getScoreText2() {
        return this.#scoreText2.text
    }
    
    // #scoreText2 SETTER
    setScoreText2(scoreText){
        this.#scoreText2.text = scoreText
    }
    
    // #scoreTest3 CREATION
    createScoreText3(params){
        this.#scoreText3 = this.game.add.text(params.positions[0], params.positions[1], params.text, params.style)
    }

    // #scoreTest3 GETTER
    getScoreText3() {
        return this.#scoreText3.text
    }
    
    // #scoreText3 SETTER
    setScoreText3(scoreText){
        this.#scoreText3.text = scoreText
    }

    // #userMessage CREATION
    createUserMessage(params){
        this.#userMessage = this.game.add.text(params.positions[0], params.positions[1], params.text, params.style)
    }

    // #userMessage GETTER
    getUserMessage() {
        return this.#userMessage.text
    }
    
    // #userMessage SETTER
    setUserMessage(userMessage){
        this.#userMessage.text = userMessage
    }

    // start timer
    startCountdown(){
        var timer = this.game.time.create(false)
        timer.loop(1000, ()=> this.#timeRemaining-- , this)
        timer.start()
    }

    updateText(){
        this.#scoreText1.text = this.#livesToSave
        this.#scoreText2.text = this.#health
        this.#scoreText3.text = this.#timeRemaining
    }

    checkTimeRemaining(){
        if(this.#timeRemaining === 0) this.#userMessage.text = 'Game Over'
    }
}