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
        let spawnedList = []
        for (let i = 1; i <= spawnCount; i++) {
            let randomPosX
            let checker = true
            let stepper = 0

            while (checker) {
                randomPosX = Math.random() * (0, width)

                checker = spawnedList.some((x) => {
                    return randomPosX - 48 <= x.x && randomPosX + 48 >= x.x
                })

                stepper++
                if (stepper >= 2) break
            }

            if (checker) continue
            spawnedList.push(
                new Enemy(this.#scene, randomPosX, 0, 'hopp')
                    .damage(this.#damage)
            );

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

