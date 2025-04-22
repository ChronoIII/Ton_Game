import Enemy from '../actors/Enemy'

export default class EnemyManager {
    static #instance = null

    #scene
    #damage
    static #enemies = []
    
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

            let randomPosY = Math.floor((Math.random() * 50))
            spawnedList.push(
                new Enemy(this.#scene, randomPosX, randomPosY, 'hopp')
                    .damage(this.#damage)
            );
        }

        EnemyManager.#enemies.push(...spawnedList)

        return this
    }

    outOfBounds(callback = null) {
        EnemyManager.#enemies.forEach((enemy, index) => {
            if (enemy.y > this.#scene.cameras.main.height) {
                console.log('outside detected')

                if (!!callback) callback()

                let _enemies = [...EnemyManager.#enemies]
                _enemies.splice(index, 1)
                EnemyManager.#enemies = _enemies
            }
        })
    }

    static getEnemyCount () {
        return this.#enemies
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
                frames: [4, 3, 2, 1, 0]
            }),
            frameRate: 16,
            repeat: 0
        })
    }
}

