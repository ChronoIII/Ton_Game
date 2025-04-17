export default class Erosion {
    static erode(canvas) {
        let context = canvas.getContext('2d')
        let img = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data

        let r = 0
        let g = 0
        let b = 0

        for (let row = 0; row < context.canvas.height; row++) {
            for (let column = 0; column < context.canvas.width; column++) {
                r += img[row * context.canvas.width + column] / 0xff;
                g += img[row * context.canvas.width + column + 1] / 0xff;
                b += img[row * context.canvas.width + column + 2] / 0xff;
            }
        }

        const count = context.canvas.width * context.canvas.height
        return {
            r: r / count,
            g: g / count,
            b: b / count,
        }
    }

    static applyErosion(canvas) {
        let context = canvas.getContext('2d')
        let width = context.canvas.width
        let height = context.canvas.height
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data
        const output = new Uint8ClampedArray(imageData.length);
        const kernelSize = 3;
        const kOffset = Math.floor(kernelSize / 2);
    
        for (let y = kOffset; y < height - kOffset; y++) {
            for (let x = kOffset; x < width - kOffset; x++) {
                let minR = 255, minG = 255, minB = 255;

                for (let ky = -kOffset; ky <= kOffset; ky++) {
                    for (let kx = -kOffset; kx <= kOffset; kx++) {
                        const i = ((y + ky) * width + (x + kx)) * 4;
                        minR = Math.min(minR, imageData[i]);
                        minG = Math.min(minG, imageData[i + 1]);
                        minB = Math.min(minB, imageData[i + 2]);
                    }
                }
                
                const idx = (y * width + x) * 4;
                output[idx] = minR;
                output[idx + 1] = minG;
                output[idx + 2] = minB;
                output[idx + 3] = 255;
            }
        }
    
        return output;
    }
    
    static compareImages(data1, data2) {
        let totalDiff = 0;
        for (let i = 0; i < data1.length; i += 4) {
            const diff = Math.abs(data1[i] - data2[i]) +
                         Math.abs(data1[i + 1] - data2[i + 1]) +
                         Math.abs(data1[i + 2] - data2[i + 2]);
            totalDiff += diff;
        }
        const avgDiff = totalDiff / (data1.length / 4);
        return avgDiff; // smaller = more similar
    }
    
    // static processImages(img1, img2) {
    //     const canvas1 = document.getElementById('canvas1');
    //     const ctx1 = canvas1.getContext('2d');
    //     const canvas2 = document.getElementById('canvas2');
    //     const ctx2 = canvas2.getContext('2d');
    
    //     ctx1.drawImage(img1, 0, 0);
    //     ctx2.drawImage(img2, 0, 0);
    
    //     const width = canvas1.width;
    //     const height = canvas1.height;
    
    //     const imgData1 = ctx1.getImageData(0, 0, width, height);
    //     const imgData2 = ctx2.getImageData(0, 0, width, height);
    
    //     const erodedData = applyErosion(imgData1.data, width, height);
    //     const comparison = compareImages(erodedData, imgData2.data);
    
    //     console.log("Average Difference:", comparison);
    // }
}