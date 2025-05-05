import Enemy from '../actors/Enemy'

export default class EnemyManager 
{
    static #instance = null

    #scene
    #damage
    #enemies = []

    #typeStats = {
        hopp: {
            spawnable: true,
            moveSpeed: 100,
            hit: 3,
            points: 10,
            maxCount: 5,
            frameName: 'hopp_walk',
        }
    }
    
    constructor(scene) {
        this.#scene = scene

        this.#initialize()
        this.#enemyStatusUpdate({
            enemyOut: () => {},
            enemyDead: () => {},
        })
    }

    damageTo(gameObjects) {
        this.#damage = gameObjects
        return this
    }

    spawnEnemiesPerTime() {
        let width = this.#scene.cameras.main.width
        let enemyTypeToSpawn = 'hopp'

        let spawnCount = Math.floor((Math.random() * this.#typeStats[enemyTypeToSpawn].maxCount) + 1)
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
                new Enemy(this.#scene, randomPosX, randomPosY, enemyTypeToSpawn, this.#typeStats[enemyTypeToSpawn])
                    .damage(this.#damage)
            )
        }

        // Push to enemy list for lookup
        this.#enemies.push(...spawnedList)

        return this
    }

    getEnemies() {
        return this.#enemies
    }

    isWaveCleared() {
        return this.#enemies.length <= 0
    }

    stats(type) {
        return this.#typeStats[type]
    }

    updateStats(type, config) {
        if (!Object.hasOwn(this.#typeStats, type)) return
        
        this.#typeStats[type] = {
            ...this.#typeStats[type],
            ...config,
        }
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

    #enemyStatusUpdate({ enemyOut = null, enemyDead = null }) {
        let enemyUpdateTimer = 0
        let enemyUpdateInterval = 1000

        this.#scene.events.on('game-trigger_early_update', ({ time, delta }) => {
            enemyUpdateTimer += delta

            if (enemyUpdateTimer <= enemyUpdateInterval) {
                return
            }

            this.#enemies.forEach((enemy, index) => {
                let a, b
    
                console.log(`Enemy index: ${index}`, enemy.y)
                console.log(`Enemy index: ${index}`, enemy.getData('health'))
                if ((a = enemy.y > this.#scene.cameras.main.height) || (b = typeof enemy.getData('health') == 'undefined')) {
    
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

            enemyUpdateTimer = 0
        })
    }
}

