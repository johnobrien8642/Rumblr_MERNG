import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
import multer from 'multer';
import ogs from 'open-graph-scraper';
import path from 'path';
const Image = mongoose.model('Image')
const Audio = mongoose.model('Audio')
const Video = mongoose.model('Video')
const __dirname = path.resolve();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, path.join(__dirname, '/uploads/images'))
    } else if (file.fieldname === 'audio') {
      cb(null, path.join(__dirname, '/uploads/audio'))
    } else if (file.fieldname === 'video') {
      cb(null, path.join(__dirname, '/uploads/video'))
    }
  },
  
  filename: (req, file, cd) => {
    cd(null, Date.now() +  '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })

// var upload = multer({ dest: 'uploads/'})



router.post('/images', upload.any(), async (req, res, next) => {

  const url = req.protocol + '://' + req.get('host')
  
  function createImg(f, i) {
    let img = new Image({
      url: url + '/uploads/images/' + f.filename,
      created: Date.now(),
      displayIdx: i
    })
    return img.save()
  }

  const promises = req.files.map((f, i) => createImg(f, i))

  Promise
    .all(promises)
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error on image post promise: ${err}`)
    })
})

router.post('/audio', upload.any(), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  
  function createAudio(f) {
    let audio = new Audio({
      url: url + '/uploads/audio/' + f.filename,
      created: Date.now(),
    })
    return audio.save()
  }

  Promise
    .all([createAudio(req.files[0])])
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error on image post promise: ${err}`)
    })
})

router.post('/video', upload.any(), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  
  function createVideo(f) {
    let video = new Video({
      url: url + '/uploads/video/' + f.filename,
      created: Date.now(),
    })
    return video.save()
  }

  Promise
    .all([createVideo(req.files[0])])
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error on image post promise: ${err}`)
    })
})

router.post('/metadata', (req, res, next) => {
  const options = { url: req.body.params.url }
  ogs(options, (error, results, response) => {
    res.send(results)
  })
})

export default router;