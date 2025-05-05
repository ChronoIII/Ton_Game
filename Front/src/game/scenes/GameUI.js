import { Scene } from "phaser";

export class GameUI extends Scene
{
    #stateManager
    #enemyManager

    #progress = {
        background: null,
        bar: null,
        posX: 0,
        posY: 0,
    }

    #uiContainer = {}

    constructor() {
        super('GameUI')
    }

    init(data) {
        this.#stateManager = data.stateManager
        this.#enemyManager = data.enemyManager
    }

    create() {
        this.#displayDrawpadButton()

        this.#displayCoinText('MAX')
        this.#displayRoundTimeCounter('MAX')
        this.#displayInvasionProgressBar(0.01)

        this.game.scene.getScene('Game').events.on('[stateManager]game-status_game-update', gameState => {
            switch (gameState) {
                case this.#stateManager.GameStates.GAME_BEGIN:
                    this.#showWaveLevelText('Survive')
                    break
                case this.#stateManager.GameStates.ROUND_END:
                    this.#showWaveEndingText('Wave Cleared')
                    break
            }
        })

        this.game.scene.getScene('Game').events.on('[stateManager]game-status_round-update', (roundState) => {
            this.#displayRoundTimeCounter(Math.round(roundState.remainingSec * 0.001))
        })

        this.game.scene.getScene('Game').events.on('[stateManager]game-status_player-update', (playerState) => {
            this.#displayCoinText(Math.round(playerState.coin))
        })

        this.game.scene.getScene('Game').events.on('[stateManager]game-enemy-update', (enemyState) => {
            let progressInvasion = enemyState.maxEntry / enemyState.entry

            this.#displayInvasionProgressBar(progressInvasion.toFixed(2))
        })
    }

    #displayInvasionProgressBar(progress) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        if (!Object.hasOwn(this.#uiContainer, 'progress_invasion')) {
            this.#progress.posX = width - 10
            this.#progress.posY = (height / 2) + 150

            this.#uiContainer.progress_invasion = {}

            this.#uiContainer.progress_invasion.background = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300, 0xFFFFFF, 1)
                .setOrigin(0.5, 1)
            this.#uiContainer.progress_invasion.bar = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300 * 0.01, 0xFF0000, 1)
                .setOrigin(0.5, 1)
        }

        this.#uiContainer.progress_invasion.bar.destroy()
        this.#uiContainer.progress_invasion.bar = this.add.rectangle(this.#progress.posX, this.#progress.posY, 10, 300 * progress, 0xFF0000, 1)
            .setOrigin(0.5, 1)
    }

    #displayDrawpadButton() {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

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
    }

    #displayCoinText(coin) {
        let labelPosX = 10
        let labelPosY = 20

        if (!Object.hasOwn(this.#uiContainer, 'coin_text')) {
            this.#uiContainer.coin_text = this.add.text(labelPosX, labelPosY, coin, {
                color: '#fff',
                font: '400 20px arial',
            }).setOrigin(0, 0.5)
        }

        this.#uiContainer.coin_text.setText(coin)
    }

    #displayRoundTimeCounter(remainingSec) {
        let labelPosX = this.cameras.main.width - 10
        let labelPosY = 20

        if (!Object.hasOwn(this.#uiContainer, 'round_time_text')) {
            this.#uiContainer.round_time_text = this.add.text(labelPosX, labelPosY, remainingSec, {
                color: '#fff',
                font: '400 20px arial',
            }).setOrigin(1, 0.5)
        }

        this.#uiContainer.round_time_text.setText(remainingSec)
    }

    #showWaveLevelText(text) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        let objectiveLabelText = this.add.text(width / 2, height * 0.2, 'Objective updated:', {
            font: '600 20px arial',
            fontFamily: 'Verdana',
            letterSpacing: 1,
            color: '#FFF',
            align: 'center',
            stroke: '#333',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100)

        let objectiveValueText = this.add.text(width / 2, height * 0.24, text, {
            font: '800 25px arial',
            fontFamily: 'Verdana',
            letterSpacing: 2,
            color: '#F00',
            align: 'center',
            stroke: '#333',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100)

        this.tweens.add({
            targets: [objectiveLabelText, objectiveValueText],
            alpha: 0,
            delay: 3000,
            duration: 2000,
            repeat: 0,
            onComplete: () => {
                this.#stateManager.setGameState(this.#stateManager.GameStates.ROUND_BEGIN)

                objectiveLabelText.destroy()
                objectiveValueText.destroy()
            },
        })
    }

    #showWaveEndingText(text) {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        let endingLabelText = this.add.text(width / 2, height * 0.22, text, {
            font: '600 25px arial',
            fontFamily: 'Verdana',
            letterSpacing: 1,
            color: '#FFF',
            align: 'center',
            stroke: '#333',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(100)

        this.tweens.add({
            targets: [endingLabelText],
            alpha: 0,
            delay: 5000,
            duration: 2000,
            repeat: 0,
            onComplete: () => {
                this.#stateManager.setGameState(this.#stateManager.GameStates.ROUND_BEGIN)

                endingLabelText.destroy()
            },
        })
    }
}
