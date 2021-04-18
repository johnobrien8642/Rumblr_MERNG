import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import TextPostInput from '../../util/components/forms/inputTypes/Text_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostCreateUtil from '../../util/functions/post_create_util.js';
const { bodyPost, updateCacheCreate } = PostCreateUtil;
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
  const formId = 'textPostForm'
  const formInputId = 'textPostInput'
  let history = useHistory();

  useEffect(() => {
    body.current.forEach((obj, i) => {
      obj.displayIdx = i
    })
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
      bodyImagesFormData.append('images', file2);
    }
  
    Promise.all([
      bodyPost(bodyImagesFormData)
    ]).then(
      ([bodyUploads]) => {

        var textOnly = body.current.filter(obj => obj.srcType === 'text')

        //reinsert mainUpload files
        //at index and reset displayIdx
        var i1 = 0
        body.current.forEach((obj, i) => {
          var bodyUpload = bodyUploads[i1]

          if (obj.srcType === 'newImgFile') {
            bodyUpload.displayIdx = i
            body.current.splice(i, 1, bodyUpload)
            i1++
          }
        })
        
        var instanceData = {};
        instanceData.title = title;
        instanceData.main = main;
        instanceData.descriptions = textOnly
        instanceData.descriptionImages = body.current.filter(obj => obj.srcType !== 'text');
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
        id={formId}
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
    </div>
  )
}

export default TextPostForm;