import simplify from "simplify-js"
import GestureRecognizer from '@2players/dollar1-unistroke-recognizer'

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

    #isDrawing = false
    #firstX
    #firstY
    #lastX
    #lastY
    #points = []

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

                let ctx = this.CANVAS.context

                const currentX = gameObject.input.localX
                const currentY = gameObject.input.localY

                this.#points.push({
                    x: currentX,
                    y: currentY,
                })

                if (!this.#firstX || !this.#firstY) {
                    this.#firstX = currentX
                    this.#firstY = currentY
                }

                if (!this.#lastX) {
                    this.#lastX = currentX
                }

                if (!this.#lastY) {
                    this.#lastY = currentY
                }

                ctx.beginPath()
                ctx.moveTo(this.#lastX, this.#lastY)
                ctx.lineTo(currentX, currentY)
                ctx.strokeStyle = 'white'
                ctx.lineWidth = 10
                ctx.lineCap = 'round'
                ctx.stroke()

                this.#lastX = currentX
                this.#lastY = currentY

                this.canvas.needRedraw();
            })
            .on('panend', (pan, gameObject, lastPointer) => {
                panel.emit('canvas.panend', pan, gameObject, lastPointer);

                this.#points.push({
                    x: this.#firstX,
                    y: this.#firstY,
                })

                // Connect the line from last point to first point visual
                let ctx = this.CANVAS.context
                ctx.beginPath()
                ctx.moveTo(this.#lastX, this.#lastY)
                ctx.lineTo(this.#firstX, this.#firstY)
                ctx.strokeStyle = 'white'
                ctx.lineWidth = 10
                ctx.lineCap = 'round'
                ctx.stroke()
                this.canvas.needRedraw();

                let gr = new GestureRecognizer()
                console.log(gr.recognize(this.#points, true))

                // @REFERENCE: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
                // @REFERENCE: https://mourner.github.io/simplify-js/
                // let simplifiedPoints = simplify(this.#points, 3)

                // let rewritePoints = simplifiedPoints.map((data) => {
                //     return [data.x, data.y]
                // })

                // // Connect from last point to first point
                // // Additional points to get the first angle
                // rewritePoints.push(rewritePoints[0])
                // rewritePoints.push(rewritePoints[1])

                // console.log(simplifiedPoints)
                // console.log(rewritePoints)

                // let angles = this.#getCornerAngle(rewritePoints)
                // console.log(angles)
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

    // $1 Unistroke Recognizer
    // @REFERENCE: https://depts.washington.edu/acelab/proj/dollar/index.html
    // @REFERENCE: https://www.npmjs.com/package/@2players/dollar1-unistroke-recognizer
    #getCornerAngle(pts) {
        let angles = []

        for (let i = 1; i < pts.length - 1; i++) {
            const [ax, ay] = pts[i - 1]
            const [bx, by] = pts[i]
            const [cx, cy] = pts[i + 1]

            const angle = this.#getAngle(ax, ay, bx, by, cx, cy)
            if (angle > 150 || angle < 30) continue
            angles.push(angle)
        }

        return angles
    }

    #getAngle(ax, ay, bx, by, cx, cy) {
        const AB = [ax - bx, ay - by]
        const CB = [cx - bx, cy - by]
 
        const dot = AB[0] * CB[0] + AB[1] * CB[1]
        const magAB = Math.hypot(AB[0], AB[1])
        const magCB = Math.hypot(CB[0], CB[1])

        const cosTheta = dot / (magAB * magCB)
        const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)))
        const angleDeg = angleRad * (180 / Math.PI)

        return angleDeg
    }
}