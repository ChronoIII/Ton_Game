import { Scene, Input } from 'phaser';

export class Game extends Scene
{
    #pointer = null
    #wasd = null
    #player = null

    #mouseX = null
    #mouseY = null
    #moveSpeed = 300

    constructor ()
    {
        super('Game');
    }
    
    preload () {
        this.#pointer = this.input.activePointer
        this.#wasd = this.input.keyboard.addKeys({
            up: (Input.Keyboard.KeyCodes.W),
            down: (Input.Keyboard.KeyCodes.S),
            left: (Input.Keyboard.KeyCodes.A),
            right: (Input.Keyboard.KeyCodes.D),
        })
    }

    create ()
    {
        let height = this.cameras.main.height
        let width = this.cameras.main.width

        this.#player = this.physics.add.sprite(width / 2, height - 50, 'star')


        // this.cameras.main.setBackgroundColor(0x00ff00);

        // this.add.image(512, 384, 'background').setAlpha(0.5);

        // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        // EventBus.emit('current-scene-ready', this);

        this.#mouseInputEvents()
    }

    update () {
        this.#playerMovement()
    }

    #mouseInputEvents () {
        this.input.on('pointerdown', (pointer, object) => {
            console.log(pointer.x, pointer.y)
        })
    }

    #playerMovement () {
        if (this.#wasd.left.isDown) {
            this.#player.body.velocity.x = -1 * this.#moveSpeed
        } else if (this.#wasd.right.isDown) {
            this.#player.body.velocity.x = 1 * this.#moveSpeed
        } else {
            this.#player.body.velocity.x = 0
        }

        if (this.#wasd.up.isDown) {
            this.#player.body.velocity.y = -1 * this.#moveSpeed
        } else if (this.#wasd.down.isDown) {
            this.#player.body.velocity.y = 1 * this.#moveSpeed
        } else {
            this.#player.body.velocity.y = 0
        }
    }
}
