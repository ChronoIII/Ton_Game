export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    #scene
    #moveSpeed = 150
    #hit = 3

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        this.#scene = scene
        this.#spawn()
    }

    damage(gameObject, callback = null) {
        this.#scene.physics.add.overlap(this, gameObject, (current, other) => {
            if (current.getData('invincible')) {
                return;
            }

            this.#scene.tweens.add({
                targets: current,
                alpha: 0.1,
                duration: 100,
                repeat: 0,
                yoyo: true,
                y: current.y - 20,
                onComplete: () => {
                    current.setAlpha(1)
                    current.setData('invincible', false)
                }
            })

            current.setData('invincible', true)
            current.setData('health', current.getData('health') - 1)

            other.destroy()

            if (current.getData('health') <= 0) {
                let posX = current.x
                let posY = current.y

                current.destroy()

                let destroyParticle = this.#scene.physics.add.sprite(posX, posY, 'destroy_particles')
                    .setScale(1.1)
                    .anims.play('destroyed')

                destroyParticle.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    destroyParticle.destroy()
                    this.destroy()
                }, this)
            }

            if (callback !== null) callback()
        })
    }

    #spawn() {
        this.#scene.add.existing(this)
        this.#scene.physics.world.enable(this)

        this.#initializer('hopp')
    }

    #initializer(_enemyType) {
        switch (_enemyType) {
            case 'hopp':
                this.anims.play('hopp_walk', true)
                break
        }

        this
            .setVelocity(0, this.#moveSpeed)
            .setScale(0.8)
            .setData('health', this.#hit)

        this.#scene.tweens.add({
            targets: [this],
            scale: 0.9,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })
    }
}