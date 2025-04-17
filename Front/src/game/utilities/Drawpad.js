export default class Drawpad {
    COLOR_PRIMARY = 0x4e342e33
    PANEL
    CANVAS
    ON_DISPLAY = false

    #scene
    #height = 300
    #width = 300
    #x = 0
    #y = 0
    #hue = 0

    constructor(scene) {
        this.#scene = scene

        this.#scene.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.#scene.load.plugin(
            'rexrestorabledataplugin', 
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrestorabledataplugin.min.js', 
            true
        );

        this.#scene.load.plugin(
            'rexlzstringplugin', 
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlzstringplugin.min.js', 
            true
        );
    }

    createCanvas() {
        let panel = this.#scene.rexUI.add.sizer({
            orientation: 'x'
        })
        let background = this.#scene.rexUI.add.roundRectangle(this.#x, this.#y, this.#width, this.#height, 10, 0xFFFFFF, 0.5)
            .setOrigin(0.5)
        let canvas = this.#scene.rexUI.add.canvas(this.#x, this.#y, this.#width, this.#height)
            .setOrigin(0.5)
        let text = this.#scene.add.text(
            this.#x,
            this.#y - (this.#height / 2 + 20),
            'Send command to the HQ',
            {
                fontFamily: 'Verdana',
                fontSize: '15px',
                color: '#fff8',
            }
        )
        .setOrigin(0.5)
        let label = this.#scene.rexUI.add.label({
            x: this.#x,
            y: this.#y - (this.#height / 2 + 20),
            origin: 0.5,
            align: 'center',
            text: text
        })


        panel
            .add(
                label,
                0,
                'center',
                false,
            )
            .addBackground(background, 0, 'center', 10)
            .add(  
                canvas,
                0,
                'center',
                false,
            )
            .modal({
                touchOutsideClose: true,
                destroy: true,
                cover: {
                    color: 0x0,
                    alpha: 0.5,
                    transitIn: function(gameObject, duration) { },
                    transitOut: function(gameObject, duration) { },
                },

            }, () => {
                this.ON_DISPLAY = false
            })
            .bringToTop()
            .addChildrenMap('canvas', canvas)

        this.#scene.rexUI.add.pan(canvas)
            .on('pan', (pan, gameObject, lastPointer) => {
                panel.emit('canvas.pan', pan, gameObject, lastPointer);

                this.circle(
                    Math.floor(gameObject.input.localX),
                    Math.floor(gameObject.input.localY),
                    5, // radius
                    // `hsl(${this.#hue},50%,50%)`, // color
                    `hsl(0,100%,100%)`
                )

                this.#hue = (this.#hue + 3) % 360
            })
            .on('panend', function(pan, gameObject, lastPointer) {
                panel.emit('canvas.panend', pan, gameObject, lastPointer);
            })
        
        this.ON_DISPLAY = true
        this.CANVAS = canvas
        this.PANEL = panel

        this.setCanvas(canvas).clear()

        return this
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        return this;
    }

    setPosition(_x, _y) {
        this.#x = _x
        this.#y = _y
        return this
    }

    setSize(_width, _height) {
        this.#width = _width
        this.#height = _height
        return this
    }

    clear() {
        this.canvas.fill(0x000);
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
        return this
    }

    destroy() {
        this.ON_DISPLAY = false
        this.PANEL.fadeOutDestroy(200)
    }
}