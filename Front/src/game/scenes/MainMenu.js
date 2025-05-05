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
        let title = this.add.text(titlePosX, titlePosY, "Cannon\nMayhem", {
            fontSize: 45,
            fontFamily: 'Arial Black',
            align: 'center',
            color: '#fff',
            letterSpacing: 5,
            stroke: '#333',
            strokeThickness: 8,
        }).setOrigin(0.5).setDepth(100)

        this.tweens.add({
            targets: [title],
            y: {
                from: titlePosY + 5,
                to: titlePosY - 5,
            },
            repeat: -1,
            duration: 1000,
            yoyo: true,
        })
    }

    #displayMenuButton() {
        // Start Button
        let startButtonConfig = {
            width: 180,
            height: 60,
            x: 30,
            y: this.#canvasHeight * 0.8,
        }
        this.add.graphics()
            .fillStyle(0xF97068, 1)
            .fillRoundedRect(startButtonConfig.x, startButtonConfig.y, startButtonConfig.width, startButtonConfig.height)
            .setDepth(80)
        this.add.text(startButtonConfig.width / 2 + startButtonConfig.x, startButtonConfig.y + startButtonConfig.height / 2, 'Lets roll', {
                fontSize: 25,
                fontFamily: 'Arial Black',
                color: '#fff',
                stroke: '#212738',
                strokeThickness: 8,
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {

            })
            .on('pointerup', () => {
                this.scene.start('Game')
            })

        // Upgrade Button
        let upgradeButtonConfig = {
            width: 180,
            height: 60,
            x: 30,
            y: this.#canvasHeight * 0.895,
        }
        this.add.graphics()
            .fillStyle(0xF97068, 1)
            .fillRoundedRect(upgradeButtonConfig.x, upgradeButtonConfig.y, upgradeButtonConfig.width, upgradeButtonConfig.height)
            .setDepth(80)
        this.add.text(upgradeButtonConfig.width / 2 + upgradeButtonConfig.x, upgradeButtonConfig.y + upgradeButtonConfig.height / 2, 'Upgrades', {
                fontSize: 25,
                fontFamily: 'Arial Black',
                color: '#fff',
                stroke: '#212738',
                strokeThickness: 8,
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {

            })
            .on('pointerup', () => {

            })
    }
}
