const Jimp = require('jimp');

async function mergeImages(canvasValues, images2Merge){
    const canvas = new Jimp(canvasValues.width, canvasValues.height, (err, image) => {
        console.error(err);
    });
    let textData = {
        text: '', //the text to be rendered on the image
        maxWidth: 1004, //image width - 10px margin left - 10px margin right
        maxHeight: 72+20, //logo height + margin
        placementX: 10, // 10px in on the x axis
        placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
    };
    
    //Load images into memory and save into an array----------------
    const images = [];
    for(const image in images2Merge){
        try{
            const imgHolder = await Jimp.read(image.path)
            images.push(imgHolder);
        }
        catch(err){
            console.error(err);
        }
    }

    //Load fonts for annotating images-----------------------
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

    //Combine images----------------------------------------
    for(let i = 0; i < images.length; i++){
        canvas.print(
            font, 
            canvas2Merge[i].text.x, 
            canvas2Merge[i].text.y, 
            canvas2Merge[i].
            text.value
        );

        canvas.blit(
            image[i], 
            images2Merge[i].x, 
            images2Merge[i].y
        );
    }
    
    
}