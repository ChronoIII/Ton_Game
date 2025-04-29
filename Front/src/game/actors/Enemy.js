export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    #scene
    #texture
    #moveSpeed = 100
    #hit = 3
    #points = 10

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        this.#scene = scene
        this.#texture = texture
        this.#spawn()
    }

    damage(gameObject) {
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
            other.setData('durability', other.getData('durability') - 1)

            if (other.getData('durability') <= 0) {
                other.destroy()
            }

            this.#scene.tweens.add({
                targets: [other],
                alpha: 0.5,
                x: {
                    from: other.x + (Math.random() > 0.5 ? -5 : 5),
                    to: other.x
                },
                duration: 100,
                repeat: 0,
                yoyo: true,
            })

            this.#scene.events.emit('[enemy]game-status_damage', { current, other })

            if (current.getData('health') <= 0) {
                let drop = current.#drop()
                this.#scene.events.emit('[eneny]game-status_destroy', { current, other, drop })

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
        })

        return this
    }

    #drop() {
        let coinDrop

        let minimumCoinDrop = 10
        let maximumCoinDrop = 30
        
        coinDrop = minimumCoinDrop
        if (Math.random() >= 0.8) {
            let criticalCoinDrop = (Math.random() * maximumCoinDrop) + minimumCoinDrop
            coinDrop = criticalCoinDrop
        }

        return {
            coin: coinDrop
        }
    }

    #spawn() {
        this.#scene.add.existing(this)
        this.#scene.physics.world.enable(this)

        this.#initializer(this.#texture)
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
            .setData('points', this.#points)

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