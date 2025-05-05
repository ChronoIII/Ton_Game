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
    #isEnemySpawned = false

    #spawnTimer = 0
    #spawnInterval = 5000

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

        this.scene.launch('GameUI', { stateManager: this.#stateManager, enemyManager: this.#enemyManager })

        this.#drawPad
            .setPosition(width / 2, height - (128 * 2))
            .setSize(300, 300)
        this.#stateManager.setRoundState({
            remainingSec: this.#stateManager.roundState().interval
        })
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

        this.#eventListeners()
        this.#stateManager.setGameState(this.#stateManager.GameStates.GAME_BEGIN)
    }

    update (time, delta) {
        let seconds = time * 0.001

        this.events.emit('game-trigger_early_update', { time, delta, seconds })

        if (this.#stateManager.currentGameState() != this.#stateManager.GameStates.ROUND_BEGIN) {
            // Starting game will spawn ememies immediately
            this.#spawnTimer = this.#spawnInterval / 2

            return
        }

        // Round raise difficulty
        // Spawn more enemies per tick (+3)
        // Lower spawn interval (-1s)
        if (this.#stateManager.roundState().remainingSec <= 0) {

            if (this.#enemyManager.isWaveCleared() && this.#isEnemySpawned) {
                this.#stateManager.setGameState(this.#stateManager.GameStates.ROUND_END)

                this.#stateManager.updateEnemyState({
                    spawnPerTick: this.#stateManager.enemyState().spawnPerTick + 3,
                    spawnInterval: this.#stateManager.enemyState().spawnInterval - 100,
                })

                this.#stateManager.setRoundState({
                    wave: this.#stateManager.roundState().wave++,
                    interval: this.#stateManager.roundState().interval + 10000,
                    remainingSec: this.#stateManager.roundState().interval + 10000,
                })

                this.#enemyManager.updateStats('hopp', {
                    moveSpeed: this.#enemyManager.stats('hopp').moveSpeed + 50,
                    hit: this.#enemyManager.stats('hopp').hit + 0.5,
                })
            }

            return
        }

        // Enemy Spawner timer
        this.#spawnTimer += delta
        if (this.#spawnTimer > this.#spawnInterval) {
            this.#enemyManager
                .damageTo(this.#utilities)
                .spawnEnemiesPerTime(this.#stateManager.enemyState().spawnPerTick)

            this.#spawnTimer = 0
            this.#isEnemySpawned = true
        }

        // Run Phaser Action methods for command mechanics
        if (Object.keys(this.#objectWithActions).length > 0) {
            this.#commandManager.animateCommands(this.#objectWithActions)
        }

        // Game Over Trigger
        if (this.#currentGameState != this.#stateManager.currentGameState()) {
            if (this.#stateManager.currentGameState() == this.#stateManager.GameStates.GAME_OVER) {
                this.scene.launch('GameOver')
            }

            this.#currentGameState = this.#stateManager.currentGameState()
        }

        // Updates remaining seconds every wave level
        if (this.#stateManager.roundState().remainingSec > 0) {
            this.#stateManager.setRoundState({
                remainingSec: (this.#stateManager.roundState().remainingSec - seconds)
            })
        }

        this.events.emit('game-trigger_late_update', { time, delta, seconds })
    }

    #eventListeners() {
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

        // Player Cannon Fired
        this.events.on('game-state_bullet-fired', (data) => {
            this.#utilities.push(data.object)
        })

        // Enemy get Damaged
        this.events.on('[enemy]game-status_damage', (data) => {
            console.log(data)
        })

        // Enemy Destroyed
        this.events.on('[eneny]game-status_destroy', (data) => {
            let playerCurrentState = this.#stateManager.playerState()
            let enemyDrop = data.drop

            this.#stateManager.updatePlayerState({
                coin: playerCurrentState.coin + enemyDrop.coin
            })
        })
    }
}
