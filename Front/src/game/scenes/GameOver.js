import { Scene } from 'phaser'

export class GameOver extends Scene {
    constructor() {
        super('GameOver')
    }

    init() {

    }

    preload() {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.add.text(width / 2, height / 2 - 50, 'Game Over', {
            font: 'bold 30px arial',
            letterSpacing: 1
        })
        .setOrigin(0.5)

        this.add.rectangle(width / 2, (height / 2) + 50, 200, 50, 0xFFFFFF, 1)
        this.add.text(width / 2, (height / 2) + 50, 'Retry', {
            font: 'bold 20px arial',
            color: '#000000',
            letterSpacing: 1,
        }).setOrigin(0.5).setInteractive()

        this.add.rectangle(width / 2, (height / 2) + 120, 200, 50, 0xFFFFFF, 1)
        this.add.text(width / 2, (height / 2) + 120, 'Back', {
            font: 'bold 20px arial',
            color: '#000000',
            letterSpacing: 1,
        }).setOrigin(0.5).setInteractive()

    }
 }