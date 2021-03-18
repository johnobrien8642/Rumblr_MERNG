import React, { useState } from 'react';
import axios from 'axios'
import { useMutation } from '@apollo/client';
import Mutations from '../../graphql/mutations';
const mongoose = require('mongoose')
const { CREATE_POST } = Mutations;

const Post = () => {
  let [mainImageFiles, setMain] = useState([]);
  let [bodyImageFiles, setBody] = useState([]);
  let [errMessage, setErr] = useState('')
  let [createPost] = useMutation(CREATE_POST, {
    onCompleted(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error)
    }
  });

  const previewMainImages = (e) => {
    const files = Object.values(e.currentTarget.files)
    if (mainImageFiles.length + 1 > 10) {
      setErr(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    let mainPreview = document.querySelector('.mainPreview')

    function readAndPreview(file) {
      var reader = new FileReader();

      reader.addEventListener('load', function() {
        var image = new Image();
        image.src = this.result;
        image.alt = file.name;
        image.className = 'preview'
        setMain(mainImageFiles = [...mainImageFiles, file])
        mainPreview.appendChild( image );
      }, false)

      reader.readAsDataURL(file);
    }

    if (files) {
      files.forEach((f, i) => {
        readAndPreview(f)
      });
    }
  }
  
  const previewBodyImages = (e) => {
    const files = Object.values(e.currentTarget.files)
    if (bodyImageFiles.length + 1 > 10) {
      setErr(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    let bodyPreview = document.querySelector('.bodyPreview')

    function readAndPreview(file) {
      var reader = new FileReader();

      reader.addEventListener('load', function() {
        var image = new Image();
        image.src = this.result;
        image.alt = file.name;
        image.className = 'preview'
        setBody(bodyImageFiles = [...bodyImageFiles, file])
        bodyPreview.appendChild( image );
      }, false)

      reader.readAsDataURL(file);
    }

    if (files) {
      files.forEach((f, i) => {
        readAndPreview(f)
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var mainImagesFormData = new FormData();
    var bodyImagesFormData = new FormData();

    for (var i = 0; i < mainImageFiles.length; i++) {
      var file = mainImageFiles[i];
      mainImagesFormData.append('photos', file);
    }

    for (var i2 = 0; i2 < bodyImageFiles.length; i2++) {
      var file2 = bodyImageFiles[i2];
      bodyImagesFormData.append('photos', file2);
    }

    function main() {
      return axios.post('/api/posts/', mainImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(mainRes => {
        let mainImgObj = mainRes.data;
        return mainImgObj
      })
    }

    function body() {
      return axios.post('/api/posts/', bodyImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(bodyRes => {
        let bodyImgObj = bodyRes.data;
        return bodyImgObj
      })
    }

    Promise.all([main(), body()]).then(
      ([mainObjs, bodyObjs]) => {
        let cleanedMain = mainObjs.map((obj) => { 
          delete obj.__v 
          return obj
        })
        let cleanedBody = bodyObjs.map((obj) => { 
          delete obj.__v 
          return obj
        })
        createPost({
          variables: {
            mainImages: cleanedMain,
            bodyImages: cleanedBody
          }
        })
      }
    )
  }

  return (
    <div>
      <form
        onSubmit={e => handleSubmit(e)}
        encType={'multipart/form-data'}
      >
        <div
          className={'mainPreview'}
        >
          <h2>Main Images</h2>
          <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='main'
            accept='.png, .jpg, jpeg'
            onChange={previewMainImages}
          />
        </div>
        
        <div
          className={'bodyPreview'}
        >
          <h2>Body Images</h2>
          <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='body'
            accept='.png, .jpg, jpeg'
            onChange={previewBodyImages}
          />
        </div>

        <button
          type='submit'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Post;