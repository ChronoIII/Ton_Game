import Erosion from '../utilities/Erosion'

export default class CommandManager 
{
    #COMMAND_PATTERNS = {
        triangle: 'RZR',
        square: 'B-STRK',
        rectangle: 'B-STRK',
    }

    activeCommand(scene, gesture) {
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

                return {
                    data: group,
                    action: 'RotateAround',
                    config: {
                        x: scene.cameras.main.width / 2,
                        y: scene.cameras.main.height,
                        radian: 0.05,
                    }
                }
            case 'B-STRK':
                let barVerticalSpeed = 100
                let object = scene.physics.add.sprite(scene.cameras.main.width / 2, scene.cameras.main.height, 'bar_command')
                    .setVelocity(0, -barVerticalSpeed)
                    .setData('durability', 10)

                return {
                    data: object,
                    action: null,
                    config: null,
                }
        }
    }

    activateActionCommands(actions) {
        Object.keys(actions).forEach(actionKey => {
            let actionObject = actions[actionKey]
            switch (actionKey) {
                case 'RotateAround':
                    for (let i = 0; i < actionObject.length; i++) {
                        let indexActionObject = actionObject[i]
                        let gameObject = indexActionObject.data
                        let config = indexActionObject.config
                        Phaser.Actions.RotateAround(gameObject, { x: config.x, y: config.y }, config.radian)
                    }
            }
        })
    }
}