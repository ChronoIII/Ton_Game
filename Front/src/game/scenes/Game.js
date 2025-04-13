import { Scene, Input } from 'phaser';

export class Game extends Scene
{
    #pointer = null
    #wasd = null
    #player = null

    #mouseX = null
    #mouseY = null
    #moveSpeed = 300

    #timer = 0

    #bullets = []

    constructor ()
    {
        super('Game');
    }
    
    preload () {
        this.#pointer = this.input.activePointer
        this.#wasd = this.input.keyboard.addKeys({
            up: (Input.Keyboard.KeyCodes.W),
            down: (Input.Keyboard.KeyCodes.S),
            left: (Input.Keyboard.KeyCodes.A),
            right: (Input.Keyboard.KeyCodes.D),
        })

        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNames('basic_turret', {
                frames: [0, 1, 2, 3, 0],
            }),
            frameRate: 16,
            repeat: 0,
        });

        this.anims.create({
            key: 'hopp_walk',
            frames: this.anims.generateFrameNames('hopp', {
                frames: [0, 1]
            }),
            frameRate: 16,
            repeat: -1
        })

        this.anims.create({
            key: 'destroyed',
            frames: this.anims.generateFrameNames('destroy_particles', {
                frames: [0, 1, 2, 3, 4]
            }),
            frameRate: 16,
            repeat: 0
        })
    }

    create ()
    {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.#player = this.physics.add.sprite(width / 2, height + 32, 'basic_turret')
            .setOrigin(0.5, 1.5)

        this.#mouseInputEvents()
    }

    update (time, delta) {
        // this.#playerMovement()

        this.#timer += delta

        while (this.#timer > 2500) {
            this.#enemySpawner()
            this.#timer = 0
        }
    }

    #mouseInputEvents () {
        this.input.on('pointerdown', (pointer, object) => {
            let pointerX = pointer.x
            let pointerY = pointer.y

            let playerX = this.#player.x
            let playerY = this.#player.y

            let adjacent = playerX - pointerX
            let opposite = playerY - pointerY
            let hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))

            // https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
            let radian = Math.acos(adjacent / hypotenuse)
            // let degree = radian * (180 / Math.PI)

            this.#player.anims.play('fire', true)
            this.#player.rotation = radian - Phaser.Math.DegToRad(90)
            // this.#player.velocity = (radian, 1500)
            // this.#player.setPosition(this.#player.x, this.#player.y + 5)
            //     .setVelocity(new Phaser.Math.Vector2(1, 1)
            //     .setLength(100)
            //     .setPosition(this.#player.x, this.#player.y - 5)
            // )

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

    #playerMovement () {
        if (this.#wasd.left.isDown) {
            this.#player.body.velocity.x = -1 * this.#moveSpeed
        } else if (this.#wasd.right.isDown) {
            this.#player.body.velocity.x = 1 * this.#moveSpeed
        } else {
            this.#player.body.velocity.x = 0
        }

        if (this.#wasd.up.isDown) {
            this.#player.body.velocity.y = -1 * this.#moveSpeed
        } else if (this.#wasd.down.isDown) {
            this.#player.body.velocity.y = 1 * this.#moveSpeed
        } else {
            this.#player.body.velocity.y = 0
        }
    }

    #enemySpawner () {
        let velocity = new Phaser.Math.Vector2(1, 1)
                .setLength(150)

        let hopp = this.physics.add.sprite(Math.random() * (0, this.cameras.main.width), 0, 'hopp')
            .setVelocity(0, velocity.y)
            .setScale(0.8)
            .setData('health', 2)
        
        hopp.anims.play('hopp_walk', true)

        this.physics.add.overlap(hopp, this.#bullets, (x, y) => {
            console.log('hit')

            y.destroy()

            this.tweens.add({
                targets: x,
                alpha: 0.1,
                // ease: 'Cubic.easeOut',
                duration: 100,
                repeat: 0,
                yoyo: true
            })

            x.setData('health', x.getData('health') - 1)

            if (x.getData('health') <= 0) {
                let posX = x.x
                let posY = x.y

                x.destroy()

                let a = this.physics.add.sprite(posX, posY, 'destroy_particles')
                    .setScale(1)
                    .anims.play('destroyed')

                a.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    a.destroy()
                }, this)
            }
        })
    }
}
