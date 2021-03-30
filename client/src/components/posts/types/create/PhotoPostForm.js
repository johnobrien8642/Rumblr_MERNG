import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import MatchedTagResults from '../../../tags/Matched_Tag_Results.js'
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
const { CREATE_PHOTO_POST } = Mutations;
const { FETCH_FEED } = Queries;

const PhotoPostForm = () => { 
  let [mainImageFiles, setMain] = useState([]);
  let [bodyImageFiles, setBody] = useState([]);
  let mainImages = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [description, setDescription] = useState('');
  let [errMessage, setErr] = useState('');
  let history = useHistory();

  let [createPhotoPost] = useMutation(CREATE_PHOTO_POST, {
    update(client, { data }){
    const { createPhotoPost } = data;
      
      var readQuery = client.readQuery({
        query: FETCH_FEED,
        variables: {
          blogName: Cookies.get('currentUser')
        }
      })
      
      var { fetchUserFeed } = readQuery;
      
      var newPostArr = [createPhotoPost, ...fetchUserFeed]
      
      client.writeQuery({
        query: FETCH_FEED,
        variables: {
          blogName: Cookies.get('currentUser')
        },
        data: {
          fetchUserFeed: newPostArr
        }
      })
    },
    onCompleted() {
      resetInputs();
      history.push('/dashboard');
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    setMain(mainImageFiles = []);
    setBody(bodyImageFiles = []);
    mainImages.current = [];
    bodyImages.current = [];
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErr(errMessage = '');
  }

  const previewMainImages = (e) => {
    const files = Object.values(e.currentTarget.files)

    if (mainImageFiles.length + 1 > 10) {
      setErr(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    
    const readAndPreview = (file) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        var imgObj = {};
        imgObj.src = reader.result
        imgObj.alt = file.name
        mainImages.current.push(imgObj)
        setMain(mainImageFiles = [...mainImageFiles, file])
      }
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
    if (mainImageFiles.length + 1 > 10) {
      setErr(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    
    const readAndPreview = (file) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        var imgObj = {};
        imgObj.src = reader.result
        imgObj.alt = file.name
        bodyImages.current.push(imgObj)
        setBody(bodyImageFiles = [...bodyImageFiles, file])
      }
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
        
        createPhotoPost({
          variables: {
            mainImages: cleanedMain,
            description: description,
            descriptionImages: cleanedBody,
            tags: tags,
            user: Cookies.get('currentUser')
          }
        })
      }
    )
  }

  const removeMainImage = (i) => {
    mainImages.current.splice(i, 1)
    setMain(mainImageFiles.splice(i, 1))
  }

  const removeBodyImage = (i) => {
    bodyImages.current.splice(i, 1)
    setMain(bodyImageFiles.splice(i, 1))
  }
  
  return (
    <div
      className='postForm'
    >
      <form
        id='photoPostForm'
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
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewMainImages(e)
              document.getElementById('photoPostForm').reset()
            }}
          />
          {mainImages.current.map((img, i) => {
            return (
              <div key={i}>
                <button 
                  type='button' 
                  onClick={() => removeMainImage(i)}
                >
                  X
                </button>
                <img src={img.src} alt={img.alt} />
              </div>
            )
          })}
        </div>

        <textarea
          value={description}
          placeholder='Write a description...'
          onChange={e => setDescription(description = e.target.value)}
        ></textarea>

        <div
          className={'bodyPreview'}
        >
          <h2>Body Images</h2>
          <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewBodyImages(e)
              document.getElementById('photoPostForm').reset()
            }}
          />
          {bodyImages.current.map((img, i) => {
            return (
              <div key={i}>
                <button 
                  type='button' 
                  onClick={() => removeBodyImage(i)}
                >
                  X
                </button>
                <img src={img.src} alt={img.alt} />
              </div>
            )
          })}
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

export default PhotoPostForm;