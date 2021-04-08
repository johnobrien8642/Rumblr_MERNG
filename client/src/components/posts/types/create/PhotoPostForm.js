import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
import PhotoPostInput from '../../util/components/forms/inputTypes/Photo_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const PhotoPostForm = () => {
  let [mainImageFiles, setMainImageFiles] = useState([]);
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let [description, setDescription] = useState('');
  let mainImages = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let stringObjs = useRef([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0)
  let main = useRef([]);
  let body = useRef([]);
  let history = useHistory();

  useEffect(() => {
   body.current.forEach((obj, i) => {
     if (obj.kind === 'text') {
      obj.displayIdx = i
     }
   })
  })

  let [createPost] = useMutation(CREATE_POST, {
    update(client, { data }){
    try {
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
    } catch(err) {
      console.log(err)
    }
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
    setMainImageFiles(mainImageFiles = []);
    setBodyImageFiles(bodyImageFiles = []);
    mainImages.current = [];
    bodyImages.current = [];
    stringObjs.current = [];
    body.current = [];
    main.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
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

    function mainPost() {
      return axios.post('/api/posts/', mainImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(mainRes => {
        let mainImgObj = mainRes.data;
        return mainImgObj
      })
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

    Promise.all([mainPost(), bodyPost()]).then(
      ([mainObjs, bodyObjs]) => {
        let cleanedMain = mainObjs.map((obj) => {
          delete obj.__v
          return obj
        })

        let cleanedBody = bodyObjs.map((obj) => {
          delete obj.__v
          return obj
        })
    
        var instanceData = {};
        instanceData.mainImages = cleanedMain;
        instanceData.descriptions = body.current.filter(obj => obj.kind !== 'img')
        instanceData.descriptionImages = cleanedBody;
        instanceData.tags = tags;
        instanceData.user = Cookies.get('currentUser');
        instanceData.kind = 'PhotoPost';
        
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
      <h1>PhotoPost</h1>
      <form
        id='photoPostForm'
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
        encType={'multipart/form-data'}
      >

        <PhotoPostInput
          main={main}
          mainImageFiles={mainImageFiles}
          setMainImageFiles={setMainImageFiles}
          errMessage={errMessage}
          setErrMessage={setErrMessage}
        />

        <BodyImageAndText
          body={body}
          bodyImageFiles={bodyImageFiles}
          setBodyImageFiles={setBodyImageFiles}
          description={description}
          setDescription={setDescription}
          render={render}
          setRender={setRender}
          errMessage={errMessage}
          setErrMessage={setErrMessage}
        />

        <Tags
          tag={tag}
          setTag={setTag}
          tags={tags}
          setTags={setTags}
        />

        <button
          type='submit'
          disabled={
            mainImageFiles.length === 0 && 
            bodyImageFiles.length === 0
          }
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default PhotoPostForm;