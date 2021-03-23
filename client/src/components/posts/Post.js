import React, { useState } from 'react';
import axios from 'axios'
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../graphql/mutations';
import MatchedTagResults from '../posts/Matched_Tag_Results.js'
const { CREATE_POST } = Mutations;

const Post = () => {
  let [mainImageFiles, setMain] = useState([]);
  let [bodyImageFiles, setBody] = useState([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErr] = useState('');
  let history = useHistory();

  let [createPost] = useMutation(CREATE_POST, {
    onCompleted(data) {
      history.push('/')
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

  const handleEnterTagInput = (e) => {
    if (e.key === 'Enter' && tag) {
      setTags(tags.concat(`#${tag}`))
      setTag(tag = '')
    }
  }

  const handleClickTagInput = (e, title) => {
    e.preventDefault();
    setTags(tags.concat(title))
    setTag(tag = '')
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
            bodyImages: cleanedBody,
            tags: tags
          }
        })
      }
    )
  }

  return (
    <div>
      <form
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
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

        <div>
          {tags.map((tag, i) => {
            return (
              <div key={i}>
                {tag}
              </div>
            )
          })}

          <input
            type='text'
            value={tag}
            placeholder='#tags'
            onChange={e => setTag(tag = e.target.value)}
            onKeyDown={e => handleEnterTagInput(e)}
          />
          <div>
            <MatchedTagResults query={tag} handleClickTagInput={handleClickTagInput}/>
          </div>
        </div>
        <button
          type='submit'
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default Post;