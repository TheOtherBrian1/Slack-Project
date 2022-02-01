const {Storage} = require('@google-cloud/storage');
const {format} = require('util');
const path = require('path');

// Instantiate a storage client
const storage = new Storage({ keyFilename: path.join(__dirname, './keys.json') });
const bucket = storage.bucket('slack-images-bucket');

const results = async (buffer)=>{
    const res = await bucket.upload(path.join(__dirname, '/rock.png'))
    const url = res[0].metadata.mediaLink;
    console.log(url);
    return ({
        "title": {
            "type": "plain_text",
            "text": "Results"
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit"
        },
        "blocks": [
            {
                "type": "image",
                "image_url": url,
                "alt_text": "inspiration"
            }
        ],
        "type": "modal"
    })

}



module.exports = results;