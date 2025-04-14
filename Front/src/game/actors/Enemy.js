export default class Enemy extends Phaser.Physics.Arcade.Sprite
{
    #timer
    #moveSpeed

    #enemy

    constructor(scene) {
        super(scene)
    }

    preload() {
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

    update(time, delta) {
        this.#timer += delta

        while (this.#timer > 2500) {
            this.#enemySpawner()
            this.#timer = 0
        }
    }

    collideDamage(object, callback = null) {
        this.physics.add.overlap(this.#enemy, object, (enemy, object) => {
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
                }
            })

            enemy.setData('health', enemy.getData('health') - 1)

            if (enemy.getData('health') <= 0) {
                let posX = enemy.x
                let posY = enemy.y

                enemy.destroy()

                let destroyParticle = this.physics.add.sprite(posX, posY, 'destroy_particles')
                    .setScale(1)
                    .anims.play('destroyed')

                destroyParticle.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    destroyParticle.destroy()
                }, this)
            }
        })
    }

    #enemySpawner () {
        let velocity = new Phaser.Math.Vector2(1, 1)
                .setLength(this.#moveSpeed)

        this.#enemy = this.physics.add.sprite(Math.random() * (0, this.cameras.main.width), 0, 'hopp')
            .setVelocity(0, velocity.y)
            .setScale(0.8)
            .setData('health', 3)
        
        this.#enemy.anims.play('hopp_walk', true)
    }
}