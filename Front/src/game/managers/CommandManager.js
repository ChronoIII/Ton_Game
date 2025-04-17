import Erosion from '../utilities/Erosion'

export default class CommandManager {
    static #COMMANDS = Object.freeze({
        AIR_STRIKE_COMMAND: 'airstrike.png',
    })

    static #COMMAND_PATTERNS = []

    static initializeCommands(scene) {
        // let erodedCanvas = Erosion.applyErosion(canvas)

        Object.keys(CommandManager.#COMMANDS).forEach(command => {
            let commandFilename = CommandManager.#COMMANDS[command]

            let _canvas = document.createElement('canvas')
            _canvas.width = 300
            _canvas.height = 300
            let _ctx = _canvas.getContext('2d')

            let _image = new Image()
            
            _image.onload = () => {
                _ctx.drawImage(_image, 0, 0)

                this.#COMMAND_PATTERNS.push({
                    name: command,
                    data: Erosion.applyErosion(_canvas)
                })
            }

            _image.src = `assets/commands/${commandFilename}`
        })
    }

    static getCommands() {
        return this.#COMMAND_PATTERNS
    }

    static findCommand(_canvas) {
        let erodedCanvas = Erosion.applyErosion(_canvas)
        
        // let a = this.#COMMAND_PATTERNS.filter((x) => {
        //     let imgDiff = Erosion.compareImages(erodedCanvas, x.data)

        //     return imgDiff <= 0.5
        // })
        console.log(
            this.#COMMAND_PATTERNS.map(x => {
                return Erosion.compareImages(x.data, erodedCanvas)
            })
        )

        // console.log(a)
    }
}