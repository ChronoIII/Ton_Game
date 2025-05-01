import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    #canvasHeight
    #canvasWidth

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        let height = this.#canvasHeight = this.cameras.main.height
        let width = this.#canvasWidth = this.cameras.main.width

        this.add.image(width / 2, height / 2, 'background_menu').setScale(1, 1.5)

        this.#displayTitle(width / 2, height * 0.35)
        this.#displayMenuButton()
        
        EventBus.emit('current-scene-ready', this);
    }

    #displayTitle(titlePosX, titlePosY) {
        let title = this.add.text(titlePosX, titlePosY, "1st Battalion\nCannon", {
            fontSize: 38,
            fontFamily: 'Arial Black',
            align: 'center',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 8,
        }).setOrigin(0.5).setDepth(100)

        this.tweens.add({
            targets: [title],
            y: {
                from: titlePosY + 5,
                to: titlePosY - 5,
            },
            // ease: 'Back.easeInOut',
            repeat: -1,
            duration: 1000,
            yoyo: true,
        })
    }

    #displayMenuButton() {
        // let start_bg = this.add.graphics()
        //     .fillStyle(0x5555AA, 0.9)
        //     .fillRoundedRect(30, this.#canvasHeight * 0.775, 160, 60)
        //     .setDepth(80)
        let start_bg2 = this.add.graphics()
            .fillStyle(0x5555AA, 1)
            .fillRoundedRect(30, this.#canvasHeight * 0.775, 160, 55)
            .setDepth(80)
        let start_label = this.add.text(110, this.#canvasHeight * 0.8, 'Lets roll', {
                fontSize: 25,
                fontFamily: 'Arial Black',
                color: '#fff',
                stroke: '#000000',
                strokeThickness: 8,
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                start_label.setPosition(110, this.#canvasHeight * 0.805)
                // start_bg2.setPosition(30, this.#canvasHeight * 0.78)
            })
            .on('pointerup', () => {
                start_label.setPosition(110, this.#canvasHeight * 0.805)
                // start_bg2.setPosition(30, this.#canvasHeight * 0.78)

                this.scene.start('Game')
            })

        // let upgrade_bg = this.add.graphics()
        //     .fillStyle(0x5555AA, 0.9)
        //     .fillRoundedRect(30, this.#canvasHeight * 0.895, 160, 60)
        //     .setDepth(80)
        let upgrade_bg2 = this.add.graphics()
            .fillStyle(0x5555AA, 1)
            .fillRoundedRect(30, this.#canvasHeight * 0.895, 160, 55)
            .setDepth(80)
        let upgrade_label = this.add.text(110, this.#canvasHeight * 0.92, 'Upgrades', {
                fontSize: 25,
                fontFamily: 'Arial Black',
                color: '#fff',
                stroke: '#000000',
                strokeThickness: 8,
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                upgrade_label.setPosition(110, this.#canvasHeight * 0.925)
                // upgrade_bg2.setPosition(30, this.#canvasHeight * 0.925)
            })
            .on('pointerup', () => {
                upgrade_label.setPosition(110, this.#canvasHeight * 0.92)
                // upgrade_bg2.setPosition(30, this.#canvasHeight * 0.92)
            })
    }
}
