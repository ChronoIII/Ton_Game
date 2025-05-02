import Enemy from '../actors/Enemy'

export default class EnemyManager 
{
    static #instance = null

    #scene
    #damage
    #enemies = []
    
    constructor(scene) {
        this.#scene = scene

        this.#initialize()
    }

    damageTo(gameObjects) {
        this.#damage = gameObjects
        return this
    }

    spawnEnemiesPerTime(count) {
        let width = this.#scene.cameras.main.width

        let spawnCount = Math.floor((Math.random() * count) + 1)
        let spawnedList = []

        // Spawn enemy based on spawnCount
        for (let i = 1; i <= spawnCount; i++) {
            let randomPosX
            let checker = true
            let stepper = 0

            // Relocate enemy when overlapped on other
            while (checker) {
                randomPosX = Math.random() * (0, width)

                checker = spawnedList.some((x) => {
                    return randomPosX - 48 <= x.x && randomPosX + 48 >= x.x
                })

                stepper++
                if (stepper >= 2) break
            }

            // If relocating failed 3 times, ignore it
            if (checker) continue

            let randomPosY = Math.floor((Math.random() * 50))
            spawnedList.push(
                new Enemy(this.#scene, randomPosX, randomPosY, 'hopp')
                    .damage(this.#damage)
            )
        }

        // Push to enemy list for lookup
        this.#enemies.push(...spawnedList)

        return this
    }

    enemyOutOrDead({ enemyOut = null, enemyDead = null }) {
        console.log(this.#enemies)

        this.#enemies.forEach((enemy, index) => {
            let a, b
            if ((a = enemy.y > this.#scene.cameras.main.height) || (b = enemy.getData('health') <= 0)) {

                if (a && !!enemyOut) {
                    enemyOut(enemy)
                } else if (b && !!enemyDead) {
                    enemyDead(enemy)
                }

                console.log('Enemy: ', index, a, b)
                let _enemies = [...this.#enemies]
                _enemies.splice(index, 1)
                this.#enemies = _enemies
            }
        })
    }

    getEnemies() {
        return this.#enemies
    }

    isWaveCleared() {
        return this.#enemies.length <= 0
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

