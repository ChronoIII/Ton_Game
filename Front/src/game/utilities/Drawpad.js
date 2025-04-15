export default class Drawpad {
    COLOR_PRIMARY = 0x4e342e
    PANEL
    CANVAS

    #scene
    #height = 300
    #width = 300
    #x = 0
    #y = 0

    constructor(scene) {
        this.#scene = scene

        this.createCanvas()
    }

    createCanvas() {
        let panel = this.#scene.rexUI.add.sizer({
            orientation: 'x'
        })
        let background = this.#scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, this.COLOR_PRIMARY)
        let canvas = this.#scene.rexUI.add.canvas(this.#x, this.#y, this.#width, this.#height)
            .setOrigin(0)

        panel
            .addBackground(background)
            .add(
                canvas,
                0,
                'center',
                false,
            )

        panel.addChildrenMap('canvas', canvas)

        this.#scene.rexUI.add.pan(canvas)
            .on('pan', function(pan, gameObject, lastPointer) {
                panel.emit('canvas.pan', pan, gameObject, lastPointer);
            })
            .on('panend', function(pan, gameObject, lastPointer) {
                panel.emit('canvas.panend', pan, gameObject, lastPointer);
            })
        
        this.CANVAS = canvas
        this.PANEL = panel

        this.setCanvas(canvas).clear()

        return this
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        return this;
    }

    setSize(_width, _height) {
        this.#width = _width
        this.#height = _height
        this.CANVAS.setSize(_width, _height)
        return this
    }

    clear() {
        this.canvas.fill('black');
        return this;
    }

    circle(x, y, r, color, fill) {
        if (fill === undefined) {
            fill = true;
        }
        var ctx = this.canvas.context;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        this.canvas.needRedraw();
        return this;
    }

    on(event, callback) {
        this.PANEL.on(event, callback)
    }
}