const { createCanvas, loadImage } = require('canvas')

module.exports = async function imageMerger2(radar, line){
    const canvas = createCanvas(600, 800, 'png')
    const ctx = canvas.getContext('2d')
    ctx.font = '22px Arial'

    //Line Chart---------------------------------------
        ctx.fillText('Burnout over Time', 20, 20)

        // Draw line under text
        const text1 = ctx.measureText('Burnout over Time')
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.beginPath()
        ctx.lineTo(20, 40)
        ctx.lineTo(20 + text1.width, 40)
        ctx.stroke()

        //
        const image1 = await loadImage(line)
        ctx.drawImage(image1, text1.width + 5, text1.height + 5, text1.width + 150, text1.height + 150)

    //Radar Chart----------------------------------------
        ctx.fillText('Your Burnout', 20, 20)

        // Draw line under text
        const text2 = ctx.measureText('Your Burnout')
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.beginPath()
        ctx.lineTo(20, image1.y + 5)
        ctx.lineTo(20 + text2.width, image1.y)
        ctx.stroke()

        //
        const image2 = loadImage(radar)
        ctx.drawImage(image2, text2.width + 5, text2.y + 5, text2.width + 150, text2.height + 150)

    //sadness -----------------------------
        const image3 = await loadImage('../assets/burnout.png');
        ctx.drawImage(image3, image1.x + 5, 40, image1.x + 200, image2.y);
    
    //return buffer-----------------------
        const buf = canvas.toBuffer()
        return buf;
}