import Enemy from '../actors/Enemy'

export default class EnemyManager {
    static #instance = null

    #scene
    #damage
    #enemies = []
    
    #timer = 0
    
    constructor() {
        if (EnemyManager.#instance) return EnemyManager.#instance
        EnemyManager.#instance = this
    }

    changeScene(scene) {
        this.#scene = scene

        this.#initialize()

        return this
    }

    damageTo(gameObjects) {
        this.#damage = gameObjects
        return this
    }

    spawnEnemiesPerTime(count) {
        let width = this.#scene.cameras.main.width

        let spawnCount = Math.floor((Math.random() * count) + 1)
        for (let i = 1; i <= spawnCount; i++) {
            new Enemy(this.#scene, Math.random() * (0, width), 0, 'hopp')
                .damage(this.#damage)
        } 

        return this
    }

    #initialize() {
        this.#scene.anims.create({
            key: 'hopp_walk',
            frames: this.#scene.anims.generateFrameNames('hopp', {
                frames: [0, 1]
            }),
            frameRate: 16,
            repeat: -1
        })

        this.#scene.anims.create({
            key: 'destroyed',
            frames: this.#scene.anims.generateFrameNames('destroy_particles', {
                frames: [0, 1, 2, 3, 4]
            }),
            frameRate: 16,
            repeat: 0
        })
    }
}

