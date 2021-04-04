import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import MatchedTagResults from '../../../tags/Matched_Tag_Results';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const TextPostForm = () => {
  let [title, setTitle] = useState("");
  let [body, setBody] = useState("");
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let [tag, setTag] = useState("");
  let [tags, setTags] = useState([]);
  let bodyImages = useRef([]);
  let [errMessage, setErrMessage] = useState('');
  let history = useHistory();

  let [createPost] = useMutation(CREATE_POST, {
    update(client, { data }){
    const { createPost } = data;
      
      var readQuery = client.readQuery({
        query: FETCH_USER_FEED,
        variables: {
          query: Cookies.get('currentUser')
        }
      })
      
      var { fetchUserFeed } = readQuery;
      
      var newPostArr = [createPost, ...fetchUserFeed]
      
      client.writeQuery({
        query: FETCH_USER_FEED,
        variables: {
          query: Cookies.get('currentUser')
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
    setTitle(title = '');
    setBody(body = '');
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  const previewBodyImages = (e) => {
    const files = Object.values(e.currentTarget.files)
    if (bodyImageFiles.length + 1 > 10) {
      setErrMessage(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    
    const readAndPreview = (file) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        var imgObj = {};
        imgObj.src = reader.result
        imgObj.alt = file.name
        bodyImages.current.push(imgObj)
        setBodyImageFiles(bodyImageFiles = [...bodyImageFiles, file])
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


  const removeBodyImage = (i) => {
    bodyImages.current.splice(i, 1)
    setBodyImageFiles(bodyImageFiles.splice(i, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var bodyImagesFormData = new FormData();

    for (var i2 = 0; i2 < bodyImageFiles.length; i2++) {
      var file2 = bodyImageFiles[i2];
      bodyImagesFormData.append('photos', file2);
    }

    function bodyPost() {
      return axios.post('/api/posts/', bodyImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(bodyRes => {
        let bodyImgObj = bodyRes.data;
        return bodyImgObj
      })
    }

    Promise.all([bodyPost()]).then(
      ([bodyObjs]) => {
        let cleanedBody = bodyObjs.map((obj) => {
          delete obj.__v
          return obj
        })

        var instanceData = {};
        instanceData.title = title;
        instanceData.body = body;
        instanceData.user = Cookies.get('currentUser');
        instanceData.descriptionImages = cleanedBody;
        instanceData.tags = tags;
        instanceData.kind = 'TextPost';
        
        createPost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }
  
  return (
    <div
      className='postForm'
    >
      <form
        id='textPostForm'
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >
      <input 
        value={title}
        placeholder='Title'
        onChange={e => setTitle(title = e.target.value)}
      />
      <textarea
          value={body}
          placeholder='Your text here...'
          onChange={e => setBody(body = e.target.value)}
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
            <MatchedTagResults 
              query={tag} 
              handleClickTagInput={handleClickTagInput}
            />
          </div>
      </div>

      <button
        type='submit'
        disabled={!title}
      >
        Post
      </button>
      </form>
    </div>
  )
}

export default TextPostForm;