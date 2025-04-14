import { Scene, Input } from 'phaser';
import Enemy from '../actors/Enemy';

export class Game extends Scene
{
    #pointer = null
    #wasd = null

    #playerMoveSpeed = 300
    #enemyMoveSpeed = 120
    #timer = 0

    #player = null
    #barrier = null
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

        let bg = this.add.sprite(0, 0, 'background')
        bg.setOrigin(0,0)
        bg.displayHeight = height
        bg.displayWidth = width

        this.#player = this.physics.add.sprite(width / 2, height + 32, 'basic_turret')
            .setOrigin(0.5, 1.5)
        this.#barrier = this.physics.add.sprite(width / 2, height, 'shield_barrier')
            .setScale(0.3)
        this.tweens.add({
            targets: [this.#barrier],
            scale: 0.28,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })

        this.#mouseInputEvents()
    }

    update (time, delta) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        // this.#playerMovement()

        this.#timer += delta

        while (this.#timer > 3000) {
            let spawnCount = Math.floor((Math.random() * 2) + 1)
            for (let i = 1; i <= spawnCount; i++) {
                this.#enemySpawner()
            } 
            this.#timer = 0
        }

        // Reset recoil knockback (player)
        if (this.#player.y < height + 32) {
            this.#player.body.velocity.y = 0
            this.#player.y = height + 32
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

            // Pythagoream
            // https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
            let radian = Math.acos(adjacent / hypotenuse)
            // let degree = radian * (180 / Math.PI)

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

    #playerMovement () {
        if (this.#wasd.left.isDown) {
            this.#player.body.velocity.x = -1 * this.#playerMoveSpeed
        } else if (this.#wasd.right.isDown) {
            this.#player.body.velocity.x = 1 * this.#playerMoveSpeed
        } else {
            this.#player.body.velocity.x = 0
        }

        if (this.#wasd.up.isDown) {
            this.#player.body.velocity.y = -1 * this.#playerMoveSpeed
        } else if (this.#wasd.down.isDown) {
            this.#player.body.velocity.y = 1 * this.#playerMoveSpeed
        } else { nhm 
            this.#player.body.velocity.y = 0
        }
    }

    #enemySpawner () {
        let velocity = new Phaser.Math.Vector2(1, 1)
                .setLength(this.#enemyMoveSpeed)

        let hopp = this.physics.add.sprite(Math.random() * (0, this.cameras.main.width), 0, 'hopp')
            .setVelocity(0, velocity.y)
            .setScale(0.8)
            .setData('health', 3)
        
        hopp.anims.play('hopp_walk', true)

        this.tweens.add({
            targets: [hopp],
            scale: 0.9,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })

        this.physics.add.overlap(hopp, this.#bullets, (enemy, bullet) => {
            bullet.destroy()

            this.tweens.add({
                targets: enemy,
                alpha: 0.1,
                y: {
                    from: enemy.y,
                    to: enemy.y - 10
                },
                duration: 100,
                repeat: 0,
                yoyo: true,
                onComplete: () => {
                    enemy.y = enemy.y - 10
                    enemy.setAlpha(1)
                }
            })

            enemy.setData('health', enemy.getData('health') - 1)

            if (enemy.getData('health') <= 0) {
                let posX = enemy.x
                let posY = enemy.y

                enemy.destroy()

                let destroyParticle = this.physics.add.sprite(posX, posY, 'destroy_particles')
                    .setScale(1.1)
                    .anims.play('destroyed')

                destroyParticle.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    destroyParticle.destroy()
                }, this)
            }
        })
    }
}
