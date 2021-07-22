const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

app.get('/info', async (req, res) => {
  const { url } = req.query;

  const info = await ytdl.getBasicInfo(url);
  const { title, lengthSeconds, ownerChannelName } = info.videoDetails;

  return res.json({ url, title, video_length: lengthSeconds, channel: ownerChannelName });
});

app.get('/download', async (req, res) => {
  const { url } = req.query;

  ytdl.getBasicInfo(url).then(info => {
    const { title } = info.videoDetails;

    res.set('Content-Type', 'audio/mpeg; charset=utf-8');
    res.header('Content-Disposition', `attachment; filename=${encodeURIComponent(title)}.mp3`);

    ytdl(url, { filter: 'audioonly' }).pipe(res);
  });
});

app.listen(process.env.PORT || 3333);