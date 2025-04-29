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
        this.add.text(titlePosX, titlePosY, "1st Battalion\nCannon", {
            fontSize: 38,
            fontFamily: 'Arial Black',
            align: 'center',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 8,
        }).setOrigin(0.5).setDepth(100)
    }

    #displayMenuButton() {
        this.add.text(50, this.#canvasHeight * 0.8, 'Lets roll', {
            fontSize: 25,
            fontFamily: 'Arial Black',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 8,
        })

        this.add.graphics().fillRoundedRect(0, this.#canvasHeight * 0.8, 100, 100, 100)

        this.add.text(50, this.#canvasHeight * 0.88, 'Upgrades', {
            fontSize: 25,
            fontFamily: 'Arial Black',
            color: '#fff',
            stroke: '#000000',
            strokeThickness: 8,
        })
    }
}
