import simplify from "simplify-js"
import GestureRecognizer from '@2players/dollar1-unistroke-recognizer'

export default class Recognizer {
    static #GESTURES = Object.freeze({
        TRIANGLE: 'triangle',
        SQUARE: 'square',
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
    })

    static recogize(points, agressionLevel = 3) {
        let gr = new GestureRecognizer()
        let unistrokeResponse = gr.recognize(points)
        console.log(unistrokeResponse)
        if (Object.values(this.#GESTURES).includes(unistrokeResponse)) {
            return unistrokeResponse
        }

        // Ramer-Douglas-Peucker Algorithm
        // @REFERENCE: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
        // @REFERENCE: https://mourner.github.io/simplify-js/
        let simplifiedPoints = simplify(points, agressionLevel)
        let mapPointsToArray = simplifiedPoints.map(data => {
            return [data.x, data.y]
        })
        mapPointsToArray.push(mapPointsToArray[1])
        
        let angles = this.#getCornerAngle(mapPointsToArray)
        switch (angles.length) {
            case 3: 
                return this.#GESTURES.TRIANGLE
            case 4:
                return this.#GESTURES.SQUARE
            default:
                return null
        }
    }

    // $1 Unistroke Recognizer
    // @REFERENCE: https://depts.washington.edu/acelab/proj/dollar/index.html
    // @REFERENCE: https://www.npmjs.com/package/@2players/dollar1-unistroke-recognizer
    static #getCornerAngle(pts) {
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

    static #getAngle(ax, ay, bx, by, cx, cy) {
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