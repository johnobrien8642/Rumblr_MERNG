import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import TextPostInput from '../../util/components/forms/inputTypes/Text_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const TextPostForm = () => {
  let [title, setTitle] = useState('');
  let [main, setMain] = useState('')
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
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
    setMain(main = '');
    body.current = []
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
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
        instanceData.main = main;
        instanceData.descriptions = body.current.filter(obj =>
          obj.kind !== 'img'
        )
        instanceData.descriptionImages = cleanedBody;
        instanceData.user = Cookies.get('currentUser');
        instanceData.tags = tags;
        instanceData.kind = 'TextPost'
        
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
      <h1>TextPost</h1>
      <form
        id='textPostForm'
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

      <TextPostInput 
        title={title}
        setTitle={setTitle}
        main={main}
        setMain={setMain}
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
        disabled={!title}
      >
        Post
      </button>
      </form>
    </div>
  )
}

export default TextPostForm;