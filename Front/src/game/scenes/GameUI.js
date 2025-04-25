import { Scene } from "phaser";

export class GameUI extends Scene
{
    #stateManager
    #progress = {
        background: null,
        bar: null,
    }

    constructor(stateManager) {
        super('GameUI')

        this.#stateManager = stateManager
    }

    create() {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.#progress.bar = this.add.rectangle(width - 10, height / 2, 10, 300, 0xFF0000, 1)
            .setOrigin(0.5)
        this.#progress.background = this.add.rectangle(width - 10, height / 2, 10, 300, 0xFFFFFF, 1)

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
    }
}
