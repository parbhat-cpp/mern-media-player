import fs from 'fs';
import path from 'path';

let audioDir = '';

const getAudioInfoByDir = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(audioDir, (err, files) => {
            let cnt = 0;
            let data = {};
            files.forEach(file => {
                let fileDetails = fs.lstatSync(path.resolve(audioDir, file));
                if (fileDetails.isDirectory()) {
                    console.log(`Dir: ${file}, ${audioDir}${file}`);
                    // data.push({ name: file, path: `${audioDir}${file}`, type: 'dir' });
                    data = { ...data, [cnt]: { name: file, path: `${audioDir}${file}`, type: 'dir' } };
                }
                else {
                    console.log(`File: ${file}, ${audioDir}${file}`);
                    // data.push({ name: file, path: `${audioDir}${file}`, type: 'file' });
                    data = { ...data, [cnt]: { name: file, path: `${audioDir}${file}`, type: 'audio' } };
                }
                cnt++;
            })
            console.log(data);
            resolve(data);
        })
    })
}

export const getAudioDataByDir = (request, response) => {
    audioDir = audioDir + `${request.params.dir}/`;
    console.log(audioDir);
    let responseData = {};

    getAudioInfoByDir(audioDir).then((res) => {
        responseData = res;
        console.log(responseData);
        response.status(200).json(responseData);
    }).catch((err) => {
        response.status(500).json(err);
    })
}

export const getAudioData = (request, response) => {
    audioDir = '/Users/prabh/Music/';
    let responseData = {};
    getAudioInfoByDir(audioDir).then((res) => {
        responseData = res;
        console.log('responseeeeee', responseData);
        response.status(200).json(responseData);
    }).catch((err) => {
        response.status(500).json({ error: err.message });
    })
}

export const playAudio = (request, response) => {
    const prev = audioDir;
    const range = request.headers.range;
    const aud = request.params.aud;
    audioDir = audioDir + `${aud}`;
    // videoDir = `/Users/prabh/Videos/${vid}`;
    console.log(audioDir);
    const videoSize = fs.statSync(audioDir).size;
    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };
    response.writeHead(206, headers)
    const stream = fs.createReadStream(audioDir, {
        start,
        end
    })
    // videoDir = `/Users/prabh/Videos/`;
    audioDir = prev;
    stream.pipe(response);
}