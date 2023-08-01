import express from "express";
import cors from 'cors';
import { getVideoData, getVideoDataByDir, playVideo } from "./controller/video-controller.js";
import { getAudioData, getAudioDataByDir, playAudio } from "./controller/audio-controller.js";

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/video', getVideoData);
app.get('/video/:dir', getVideoDataByDir);
app.get('/play-video/:vid', playVideo);
app.get('/audio', getAudioData);
app.get('/audio/:dir', getAudioDataByDir);
app.get('/play-audio/:aud', playAudio);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})