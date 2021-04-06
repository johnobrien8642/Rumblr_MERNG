import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
import multer from 'multer';

var upload = multer({ dest: 'uploads/' })

const Image = mongoose.model('Image')

router.post('/', upload.any(), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  
  function createImg(f, i) {
    let img = new Image({
      url: url + '/uploads/' + f.filename,
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
      console.log(err)
    })
})

export default router;