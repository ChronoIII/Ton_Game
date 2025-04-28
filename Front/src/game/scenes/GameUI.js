import { Scene } from "phaser";

export class GameUI extends Scene
{
    #stateManager
    #progress = {
        background: null,
        bar: null,
        posX: 0,
        posY: 0,
    }

    constructor() {
        super('GameUI')
    }

    init(data) {
        this.#stateManager = data.stateManager
    }

    create() {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.#progress.posX = width - 10
        this.#progress.posY = (height / 2) + 150

        this.#progress.background = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300, 0xFFFFFF, 1)
            .setOrigin(0.5, 1)
        this.#progress.bar = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300 * 0.01, 0xFF0000, 1)
            .setOrigin(0.5, 1)

        // Drawpad Button
        let squareSize = 60
        this.add.rectangle(width - ((squareSize / 2) + 10), height - ((squareSize / 2) + 8), squareSize + 5, squareSize, 0xFF0000, 0.7)
            .setInteractive()
            .on('pointerdown', () => {
                this.events.emit('initialize-drawpad-command')
            })
        this.add.text(width - ((squareSize / 2) + 10), height - ((squareSize / 2) + 8), 'HQ', {
            font: '800 19px arial',
            fontSize: 18,
            fontFamily: 'Verdana',
            letterSpacing: 3,
        }).setOrigin(0.5).setDepth(100)

        this.game.scene.getScene('Game').events.on('game-state_enemy-passed', () => {
            let enemyState = this.#stateManager.enemyState()
            let invasionProgress = enemyState.maxEntry / enemyState.entry

            this.#progress.bar.destroy()
            this.#progress.bar = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300 * invasionProgress, 0xFF0000, 1)
                .setOrigin(0.5, 1)
        })
    }
}
