const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.get('/api/videos', (req, res) => {
  const videoDir = path.join(__dirname, 'public', 'video');
  fs.readdir(videoDir, (err, genreFolders) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return res.status(500).send('Unable to scan directory');
    }

    const genrePromises = genreFolders.map((genre) => {
      return new Promise((resolve, reject) => {
        const genrePath = path.join(videoDir, genre);
        fs.stat(genrePath, (err, stats) => {
          if (err) {
            console.error(`Error reading genre directory ${genre}:`, err);
            return reject(err);
          }
          if (stats.isDirectory()) {
            fs.readdir(genrePath, (err, files) => {
              if (err) {
                console.error(
                  `Error reading files in genre directory ${genre}:`,
                  err
                );
                return reject(err);
              }
              const videoFiles = files
                .filter((file) => file.endsWith('.mp4'))
                .map((file) => `http://localhost:5000/video/${genre}/${file}`);
              resolve({ genre, videos: videoFiles });
            });
          } else {
            resolve(null);
          }
        });
      });
    });

    Promise.all(genrePromises)
      .then((genres) => {
        const filteredGenres = genres.filter((genre) => genre !== null);
        res.json(filteredGenres);
      })
      .catch((error) => {
        console.error('Error processing genres:', error);
        res.status(500).send(error.message);
      });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
