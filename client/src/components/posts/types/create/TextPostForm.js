import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import TextPostInput from '../../util/components/forms/inputTypes/Text_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js';
const { bodyPost, updateCacheCreate,
        handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx } = PostFormUtil;
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const TextPostForm = () => {
  let [title, setTitle] = useState('');
  let [main, setMain] = useState('')

  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'textPostForm'
  const formInputId = 'textPostInput'
  let history = useHistory();

  useEffect(() => {
    resetDisplayIdx(body)
  })

  let [createPost] = useMutation(CREATE_POST, {
    update(client, { data }){
    const { createPost } = data;
    var currentUser = Cookies.get('currentUser')
    var query = FETCH_USER_FEED
    
    updateCacheCreate(client, createPost, currentUser, query)
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
    document.querySelector('#mainTextInput').innerHTML = ''
    setTitle(title = '');
    setMain(main = '');
    body.current = []
    setBodyImageFiles(bodyImageFiles = []);
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    var bodyImagesFormData = handleFormData(bodyImageFiles)
  
    Promise.all([
      bodyPost(bodyImagesFormData)
    ]).then(
      ([bodyUploads]) => {
        
        var instanceData = {
          statics: { title, main },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          user: Cookies.get('currentUser'),
          tags, kind: 'TextPost'
        }
        
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
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

      <TextPostInput
        formInputId={formInputId}
        title={title}
        setTitle={setTitle}
        main={main}
        setMain={setMain}
      />

      <BodyImageAndText
        formId={formId}
        formInputId={formInputId}
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
        disabled={!main}
      >
        Post
      </button>
      </form>
      <div
        onClick={() => {
          history.push('/')
        }}
      >
        Close
      </div>
    </div>
  )
}

export default TextPostForm;