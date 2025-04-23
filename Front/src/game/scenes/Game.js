import { Scene, Input } from 'phaser';
import Drawpad from '../utilities/Drawpad'
import EnemyManager from '../managers/EnemyManager'
import CommandManager from '../managers/CommandManager';
import Recognizer from '../utilities/Recognizer';

export class Game extends Scene
{
    #enemyManager

    #spawnTimer = 0
    #outOfBoundTimer = 0
    #spawnInterval = 5000
    #outOfBoundInternal = 1000
    #roundTimer
    #roundInterval = 30000

    #player = null
    #barrier = null
    #utilities = []
    #canFire = true
    
    #drawPad

    #progressBar
    #progressBox
    #enemyPassed = 0
    #enemyMax = 10
    #enemyProgress = 0.01
    #enemiesPerTick = 5

    #razorObjectGroup
    #objectWithActions = {}
    
    constructor ()
    {
        super('Game');
    }
    
    preload () {
        this.#enemyManager = new EnemyManager()
            .changeScene(this)

        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNames('basic_turret', {
                frames: [0, 1, 2, 3, 0],
            }),
            frameRate: 16,
            repeat: 0,
        });

        this.#drawPad = (new Drawpad(this))
    }

    create ()
    {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        // Background Setup
        let bg = this.add.image(0, 0, 'background')
        bg.setOrigin(0.04, 0)
        bg.setAlpha(0.9)
        bg.displayHeight = height
        bg.displayWidth = width * 1.2

        // // Progress Bar
        // this.#progressBar = this.add.graphics()
        //     .clear()
        //     .fillStyle(0xFF0000, 1)
        //     .fillRect(width - 40, height / 2, 10, 300)

        // // Progress Box
        // this.#progressBox = this.add.graphics()

        // this.#progressBox
        //     .clear()
        //     .fillStyle(0xFFFFFF, 1)
        //     .fillRect(width - 40, height / 2, 10, 300 * (1.0 - this.#enemyProgress))

        this.#progressBar = this.add.rectangle(width - 10, height / 2, 10, 300, 0xFF0000, 1)
            .setOrigin(0.5)
        this.#progressBox = this.add.rectangle(width - 10, height / 2, 10, 300 * (1.0 - (this.#enemyPassed / this.#enemyMax)), 0xFFFFFF, 1)

        // Initialize DrawPad
        this.#drawPad
            .setPosition(width / 2, height - (128 * 2))
            .setSize(300, 300)
        
        // Drawpad Button
        let squareSize = 60
        let a = this.add.rectangle(width - ((squareSize / 2) + 10), height - ((squareSize / 2) + 8), squareSize + 5, squareSize, 0xFF0000, 0.7)
            .setInteractive()
            .on('pointerdown', () => {
                this.#drawPad.createCanvas()
                    .on('canvas.panend', (pan, canvas, lastPointer) => {
                        let points = this.#drawPad.points()
                        let recognizeData = Recognizer.recogize(points, 3)
                        
                        let command = CommandManager.activeCommand(this, recognizeData)

                        if (!!command.action) {
                            let commandKey = command.action
                            if (!this.#objectWithActions.hasOwnProperty(commandKey)) this.#objectWithActions[commandKey] = []

                            this.#objectWithActions[commandKey].push(command)
                        }

                        let commandGameObject = [command.data]
                        if (command.data instanceof Phaser.GameObjects.Group) {
                            commandGameObject = command.data.getChildren()
                        }
    
                        this.#utilities.push(...commandGameObject)

                        this.#drawPad.destroy()
                    })
            })
        this.add.text(width - ((squareSize / 2) + 10), height - ((squareSize / 2) + 8), 'HQ', {
            font: '800 19px arial',
            fontSize: 18,
            fontFamily: 'Verdana',
            letterSpacing: 3,
        }).setOrigin(0.5).setDepth(100)

        this.#player = this.physics.add.sprite(width / 2, height + 30, 'basic_turret')
            .setOrigin(0.5, 1.5)
            .setScale(1)
            .setData('posX', width / 2)
            .setData('posY', height + 30)
        this.#barrier = this.physics.add.sprite(width / 2, height, 'shield_barrier')
            .setScale(0.23)
        this.tweens.add({
            targets: [this.#barrier],
            scale: 0.25,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })

        this.#mouseInputEvents()

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('GameOver')
        })
    }

    update (time, delta) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        // Round raise difficulty
        // Spawn more enemies per tick (+3)
        // Lower spawn interval (-1s)
        this.#roundTimer += delta
        if (this.#roundTimer > this.#roundInterval) {
            this.#enemiesPerTick += 3
            this.#spawnInterval -= 1000

            this.#roundTimer = 0
        }

        // Enemy Spawner timer
        this.#spawnTimer += delta
        if (this.#spawnTimer > this.#spawnInterval) {
            this.#enemyManager
                .damageTo(this.#utilities)
                .spawnEnemiesPerTime(this.#enemiesPerTick)
            this.#spawnTimer = 0
        }

        // Out of boundss checker
        this.#outOfBoundTimer += delta
        if (this.#outOfBoundTimer > this.#outOfBoundInternal) {
            this.#enemyManager
                .outOfBounds(() => {
                    this.#enemyPassed++

                    // Redraw loading bar
                    this.#progressBox.destroy()
                    // this.#progressBox = this.add.graphics()
                    //     .fillStyle(0xFFFFFF, 1)
                    //     .fillRect(width - 40, height / 2, 10, 300 * Math.max(0.1, (1.0 - (this.#enemyPassed / this.#enemyMax))))
                    this.#progressBar= this.add.rectangle(width - 10, height / 2, 10, 300 * (1.0 - (this.#enemyPassed / this.#enemyMax)), 0xFFFFFF, 1)

                    let posX = this.#progressBar.x 
                    this.tweens.add({
                        targets: [
                            this.#progressBar,
                            this.#progressBox,
                        ],
                        x: {
                            from: posX + (Math.random() > 0.5 ? 5 : -5),
                            to: posX,
                        },
                        duration: 100,
                        repeat: 0,
                    }) 
                })
            this.#outOfBoundTimer = 0
        }

        // Reset recoil knockback (player)
        if (this.#player.y < this.#player.getData('posY')) {
            this.#player.body.velocity.y = 0
            this.#player.y = this.#player.getData('posY')
        }

        // Run Phaser Action methods for command mechanics
        if (Object.keys(this.#objectWithActions).length > 0) {
            CommandManager.activateActionCommands(this.#objectWithActions)
        }

        // Game Over
        if (this.#enemyPassed >= this.#enemyMax) {
            this.scene.stop()
            this.cameras.main.fadeOut(1000, 0, 0, 0)
        }
    }

    #mouseInputEvents () {
        this.input.on('pointerdown', (pointer, object) => {
            // @TODO: Structure and relocate this catcher
            if (this.#drawPad.ON_DISPLAY || !this.#canFire) return

            // this.#canFire = false

            let pointerX = pointer.x
            let pointerY = pointer.y

            let playerX = this.#player.x
            let playerY = this.#player.y

            let adjacent = playerX - pointerX
            let opposite = playerY - pointerY
            // let hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))
            let hypotenuse = Math.hypot(adjacent, opposite)

            // @TITLE: Pythagoream
            // @REFERENCE: https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
            let radian = Math.acos(adjacent / hypotenuse)

            // Animation and rotation
            this.#player.anims.play('fire', true)
            this.#player.rotation = radian - Phaser.Math.DegToRad(90)

            // Knockback when fire
            this.#player.setPosition(this.#player.x, this.#player.y + 8)
            this.physics.moveTo(this.#player, this.#player.x, this.#player.y - 8, 100)

            // Bullet instantiate
            this.#bulletFire(this.#player.x, this.#player.y - 32, radian)
        })
    }

    #bulletFire (posX, posY, radian) {
        let velocity = new Phaser.Math.Vector2(1, 1)
            .setAngle(radian)
            .setLength(1500)

        this.#utilities.push(
            this.physics.add.sprite(posX, posY, 'basic_bullet')
                .setVelocity(-velocity.x, -velocity.y)
                .setScale(2, 2)
                .setData('durability', 1)
        )
    }
}
