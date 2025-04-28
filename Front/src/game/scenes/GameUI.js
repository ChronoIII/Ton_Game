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
        this.#displayInvasionProgressBar()
        this.#showWaveLevelText("Survive")
    }

    #displayInvasionProgressBar() {
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

            this.tweens.add({
                targets: [this.#progress.bar, this.#progress.box],
                alpha: 0,
                x: {
                    from: this.#progress.posX + 5,
                    to: this.#progress.posX - 5,
                },
                duration: 100,
                repeat: -1,
                yoyo: true,
            })
        })
    }

    #showWaveLevelText(text) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        let objectiveLabelText = this.add.text(width / 2, height * 0.2, 'Objective:', {
            font: '600 19px arial',
            fontFamily: 'Verdana',
            letterSpacing: 1,
            color: '#FFF',
            align: 'center',
        }).setOrigin(0.5).setDepth(100)

        let objectiveValueText = this.add.text(width / 2, height * 0.24, text, {
            font: '800 25px arial',
            fontFamily: 'Verdana',
            letterSpacing: 2,
            color: '#F00',
            align: 'center',
        }).setOrigin(0.5).setDepth(100)

        setTimeout(() => {
            this.tweens.add({
                targets: [objectiveLabelText, objectiveValueText],
                alpha: 0,
                duration: 2000,
                repeat: 0,
                onComplete: () => {
                    this.#stateManager.setGameState(this.#stateManager.GameStates.ROUND_BEGIN)
                }
            })
        }, 3000)
    }

}
