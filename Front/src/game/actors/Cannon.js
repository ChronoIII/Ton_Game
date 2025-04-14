export default class Cannon extends Phaser.GameObjects.Sprite {
    #pointer = null
    #wasd = null

    #player = null
    #barrier = null
    #bullets = []
    
    constructor(config) {
        super(config.scene, config.x, config.y, 'basic_turret')

        config.scene.add.existing(this)
    }

    create() {
        this.#init()

        this.#mouseInputEvents()
    }

    update(keys) {
        if (this.#player.y < height + 32) {
            this.#player.body.velocity.y = 0
            this.#player.y = height + 32
        }
    }

    #init() {
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
}