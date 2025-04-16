export default class Erosion {
    static erode(canvas) {
        let context = canvas.getContext('2d')
        let img = context.getImageData(0, 0, context.canvas.width, context.canvas.height)

        console.log(img.data instanceof Uint8ClampedArray, img.data)
    }
}