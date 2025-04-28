export default class Player extends Phaser.GameObjects.Sprite
{
    #scene
    #stateManager
    #drawPad

    #x
    #y

    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture)

        this.#scene = scene
        this.#stateManager = data.stateManager
        this.#drawPad = data.drawPad
        this.#x = x
        this.#y = y
        this.#spawn()

        this.#scene.events.on('[player]game-trigger_update', () => {
            // Reset recoil knockback (player)
            if (this.y < this.getData('posY')) {
                this.body.velocity.y = 0
                this.y = this.getData('posY')
            }
        })

        this.#scene.input.on('pointerdown', (pointer) => {
            if (this.#drawPad.ON_DISPLAY) return

            let pointerX = pointer.x
            let pointerY = pointer.y

            let playerX = this.x
            let playerY = this.y

            let adjacent = playerX - pointerX
            let opposite = playerY - pointerY
            let hypotenuse = Math.hypot(adjacent, opposite)

            // @TITLE: Pythagoream
            // @REFERENCE: https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
            let radian = Math.acos(adjacent / hypotenuse)

            // Animation and rotation
            this.anims.play('fire', true)
            this.rotation = radian - Phaser.Math.DegToRad(90)

            // Knockback when fire
            this.setPosition(this.x, this.y + 8)
            this.#scene.physics.moveTo(this, this.x, this.y - 8, 100)

            this.#scene.events.emit('game-state_bullet-fired', {
                object: new Bullet(this.#scene, this.x, this.y, 'basic_bullet', { radian })
            })
            
        })
    }

    withBarrier() {
        new Barrier(this.#scene, this.x, this.y - 30, 'shield_barrier')
    }

    #spawn() {
        this.#scene.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNames('basic_turret', {
                frames: [0, 1, 2, 3, 0],
            }),
            frameRate: 16,
            repeat: 0,
        });

        this
            .setOrigin(0.5, 1.5)
            .setScale(1)
            .setDepth(10)
            .setData('posX', this.#x)
            .setData('posY', this.#y)
        
        this.#scene.add.existing(this)
        this.#scene.physics.world.enable(this)
    }
}

class Bullet extends Phaser.Physics.Arcade.Sprite
{
    #data

    constructor(scene, x, y, texture, data) {
        super(scene, x, y, texture)

        this.#data = data

        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.#fire()
    }

    #fire() {
        let velocity = new Phaser.Math.Vector2(1, 1)
                .setAngle(this.#data.radian)
                .setLength(1500)

        this
            .setVelocity(-velocity.x, -velocity.y)
            .setScale(2, 2)
            .setDepth(10)
            .setData('durability', 1)
    }
}

class Barrier extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        
        scene.add.existing(this)
        scene.physics.world.enable(this)

        this
            .setScale(0.23)
            .setDepth(12)

        scene.tweens.add({
            targets: [this],
            scale: 0.25,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })
    }
}