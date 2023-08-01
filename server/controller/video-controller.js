import fs from 'fs';
import path, { dirname, resolve } from 'path';

let videoDir = '';

const getVideoInfoByDir = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(videoDir, (err, files) => {
            let cnt = 0;
            let data = {};
            files.forEach(file => {
                let fileDetails = fs.lstatSync(path.resolve(videoDir, file));
                if (fileDetails.isDirectory()) {
                    // console.log(`Dir: ${file}, ${videoDir}${file}`);
                    // data.push({ name: file, path: `${videoDir}${file}`, type: 'dir' });
                    data = { ...data, [cnt]: { name: file, path: `${videoDir}${file}`, type: 'dir' } };
                }
                else {
                    // console.log(`File: ${file}, ${videoDir}${file}`);
                    // data.push({ name: file, path: `${videoDir}${file}`, type: 'file' });
                    data = { ...data, [cnt]: { name: file, path: `${videoDir}${file}`, type: 'video' } };
                }
                cnt++;
            })
            console.log(data);
            resolve(data);
        })
    })
}

export const getVideoDataByDir = (request, response) => {
    videoDir = videoDir + `${request.params.dir}/`;
    console.log(videoDir);
    let responseData = {};

    getVideoInfoByDir(videoDir).then((res) => {
        responseData = res;
        console.log(responseData);
        response.status(200).json(responseData);
    }).catch((err) => {
        response.status(500).json(err);
    })
}

export const getVideoData = (request, response) => {
    videoDir = '/Users/prabh/Videos/';
    let responseData = {};

    getVideoInfoByDir(videoDir).then((res) => {
        responseData = res;
        console.log(responseData);
        response.status(200).json(responseData);
    }).catch((err) => {
        response.status(500).json(err);
    })
}

export const playVideo = (request, response) => {
    const prev = videoDir;
    const range = request.headers.range;
    const vid = request.params.vid;
    videoDir = videoDir + `${vid}`;
    // videoDir = `/Users/prabh/Videos/${vid}`;
    console.log(videoDir);
    const videoSize = fs.statSync(videoDir).size;
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
    const stream = fs.createReadStream(videoDir, {
        start,
        end
    })
    // videoDir = `/Users/prabh/Videos/`;
    videoDir = prev;
    stream.pipe(response);
}