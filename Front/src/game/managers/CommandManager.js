import Erosion from '../utilities/Erosion'

export default class CommandManager {
    // static #COMMANDS = Object.freeze({
    //     AIR_STRIKE_COMMAND: 'airstrike.png',
    // })

    static #COMMAND_PATTERNS = {
        triangle: 'RZR',
        square: 'B-STRK'
    }

    static activeCommand(scene, gesture) {
        let commandGesture = this.#COMMAND_PATTERNS[gesture]
        switch (commandGesture) {
            case 'RZR':
                let razorRotationSpeed = 300
                let group = scene.add.group()

                for (let i = 1; i <= 2; i++) {
                    let isEven = i % 2 == 0
                    let razorGameObject = scene.physics.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height + (isEven ? 150 : -150), 'razor_command')
                        .setAngularVelocity(razorRotationSpeed)
                        .setOrigin(0.5)
                        .setScale(0.5)
                        .setData('durability', 10)
                    group.add(razorGameObject)
                }

                return group
            case 'B-STRK':
                let barVerticalSpeed = 100
                return scene.physics.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height, 'bar_command')
                    .setVelocity(0, -barVerticalSpeed)
                    .setData('durability', 10)
        }
    }
}