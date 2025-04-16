import { Scene, Input } from 'phaser';
import Drawpad from '../utilities/Drawpad'
import EnemyManager from '../managers/EnemyManager'

export class Game extends Scene
{
    #enemyManager

    #pointer = null
    #timer = 0
    #interval = 3000

    #player = null
    #barrier = null
    #bullets = []

    #test = false
    #asd = 0

    #drawPad

    constructor ()
    {
        super('Game');
    }
    
    preload () {
        this.#enemyManager = new EnemyManager()
            .changeScene(this)

        this.#pointer = this.input.activePointer

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

        // Initialize DrawPad
        this.#drawPad
            .setPosition(width / 2, height - (128 * 2))
            .setSize(width / 2, 300)
        
        let squareSize = 70
        this.add.rectangle(width - ((squareSize / 2) + 10), height - ((squareSize / 2) + 8), squareSize, squareSize, 0xFFFFFF, 0.5)
            .setInteractive()
            .on('pointerdown', () => {
                // this.physics.world.timeScale = 10
                this.#drawPad.createCanvas()
                    .on('canvas.panend', (pan, canvas, lastPointer) => {
                        console.log('fjkashdjkhjsd')
                        this.#drawPad.destroy()
                    })
            })

        this.#player = this.physics.add.sprite(width / 2, height + 30, 'basic_turret')
            .setOrigin(0.5, 1.5)
            .setScale(0.8)
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
    }

    update (time, delta) {
        let height = this.cameras.main.height

        // Enemy Spawner timer
        this.#timer += delta
        if (this.#timer > this.#interval) {
            this.#enemyManager
                .damageTo(this.#bullets)
                .spawnEnemiesPerTime(5)
            this.#timer = 0
        }

        // Reset recoil knockback (player)
        if (this.#player.y < this.#player.getData('posY')) {
            this.#player.body.velocity.y = 0
            this.#player.y = this.#player.getData('posY')
        }
    }

    #mouseInputEvents () {
        this.input.on('pointerdown', (pointer, object) => {
            // @TODO: Structure and relocate this catcher
            if (this.#drawPad.ON_DISPLAY) return

            let pointerX = pointer.x
            let pointerY = pointer.y

            let playerX = this.#player.x
            let playerY = this.#player.y

            let adjacent = playerX - pointerX
            let opposite = playerY - pointerY
            let hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))

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

        this.#bullets.push(
            this.physics.add.sprite(posX, posY, 'basic_bullet')
                .setVelocity(-velocity.x, -velocity.y)
                .setScale(2, 2)
        )
    }
}
