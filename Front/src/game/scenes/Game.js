import { Scene, Input } from 'phaser'
import Drawpad from '../utilities/Drawpad'
import EnemyManager from '../managers/EnemyManager'
import CommandManager from '../managers/CommandManager'
import StateManager from '../managers/StateManager'
import Recognizer from '../utilities/Recognizer'
import Player from '../actors/Player'

export class Game extends Scene
{
    #enemyManager
    #stateManager
    #commandManager
    #drawPad
    #player
    #currentGameState = 'game-begin'

    #spawnTimer = 0
    #outOfBoundTimer = 0
    #spawnInterval = 5000
    #outOfBoundInternal = 1000
    #roundTimer
    #roundInterval = 30000

    #utilities = []

    #objectWithActions = {}
    
    constructor ()
    {
        super('Game');
    }
    
    preload () {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.#stateManager = new StateManager(this)
        this.#enemyManager = new EnemyManager(this)
        this.#commandManager = new CommandManager()
        this.#drawPad = new Drawpad(this)
        this.#player = new Player(this, width / 2, height + 30, 'basic_turret', { stateManager: this.#stateManager, drawPad: this.#drawPad }).withBarrier()

        this.scene.launch('GameUI', { stateManager: this.#stateManager })

        // Initialize DrawPad
        this.#drawPad
            .setPosition(width / 2, height - (128 * 2))
            .setSize(300, 300)
    }

    create ()
    {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        // Background Setup
        let bg = this.add.image(0, 0, 'background')
        bg.setOrigin(0.04, 0)
        bg.setAlpha(0.9)
        bg.displayHeight = height
        bg.displayWidth = width * 1.2

        // HQ Button Listener
        this.game.scene.getScene('GameUI').events.on('initialize-drawpad-command', () => {
            this.#drawPad.createCanvas()
                .on('canvas.panend', (pan, canvas, lastPointer) => {
                    let points = this.#drawPad.points()
                    let recognizeData = Recognizer.recogize(points, 3)
                    let command = this.#commandManager.activeCommand(this, recognizeData)

                    if (!!command.action) {
                        let commandKey = command.action
                        if (!this.#objectWithActions.hasOwnProperty(commandKey)) this.#objectWithActions[commandKey] = []

                        this.#objectWithActions[commandKey].push(command)
                    }

                    let commandGameObject = [command.data]
                    if (command.data instanceof Phaser.GameObjects.Group) {
                        commandGameObject = command.data.getChildren()
                    }

                    this.#utilities.push(...commandGameObject)

                    this.#drawPad.destroy()
                })
        })

        this.events.on('game-state_bullet-fired', (data) => {
            this.#utilities.push(data.object)
        })
    }

    update (time, delta) {
        // Round raise difficulty
        // Spawn more enemies per tick (+3)
        // Lower spawn interval (-1s)
        this.#roundTimer += delta
        if (this.#roundTimer > this.#roundInterval) {
            this.#stateManager.updateEnemyState({
                spawnPerTick: this.#stateManager.enemyState().spawnPerTick + 3,
                spawnInterval: this.#stateManager.enemyState().spawnInterval - 1000,
            })
            this.#spawnInterval -= 1000

            this.#roundTimer = 0
        }

        // Enemy Spawner timer
        this.#spawnTimer += delta
        if (this.#spawnTimer > this.#spawnInterval) {
            this.#enemyManager
                .damageTo(this.#utilities)
                .spawnEnemiesPerTime(this.#stateManager.enemyState().spawnPerTick)
            this.#spawnTimer = 0
        }

        // Out of boundss checker
        this.#outOfBoundTimer += delta
        if (this.#outOfBoundTimer > this.#outOfBoundInternal) {
            this.#enemyManager
                .outOfBounds(() => {
                    this.#stateManager.setEnemyState({
                        entry: this.#stateManager.enemyState().entry++
                    })

                    this.events.emit('game-state_enemy-passed')
                })
            this.#outOfBoundTimer = 0
        }

        // Run Phaser Action methods for command mechanics
        if (Object.keys(this.#objectWithActions).length > 0) {
            this.#commandManager.activateActionCommands(this.#objectWithActions)
        }

        // Game Over Trigger
        if (this.#currentGameState != this.#stateManager.currentGameState()) {
            if (this.#stateManager.currentGameState() == this.#stateManager.GameStates.GameOver) {
                this.scene.launch('GameOver')
            }

            this.#currentGameState = this.#stateManager.currentGameState()
        }

        this.events.emit('game-trigger_update', { time, delta })
    }
}
