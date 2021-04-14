import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import ChatPostInput from '../../util/components/forms/inputTypes/Chat_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostCreateUtil from '../../util/functions/post_create_util.js';
const { bodyPost, updateCache } = PostCreateUtil;
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const ChatPostForm = () => {
  let chat = useRef('')
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'chatPostForm';
  const formInputId = 'chatPostInput';
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
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED
        
      updateCache(client, createPost, currentUser, query)
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
    // setChat(chat = '')
    chat.current = '';
    setDescription(description = '')
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

    Promise.all([
      bodyPost(bodyImagesFormData)
    ]).then(
      ([bodyObjs]) => {
        console.log(bodyObjs)
        let cleanedBody = bodyObjs.map((obj) => {
          delete obj.__v
          return obj
        })
        
        var instanceData = {};
        instanceData.chat = chat.current;
        instanceData.descriptions = body.current.filter(obj =>
          obj.kind !== 'img'
        )
        instanceData.descriptionImages = cleanedBody;
        instanceData.user = Cookies.get('currentUser');
        instanceData.tags = tags;
        instanceData.kind = 'ChatPost'
        
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
      <h1>ChatPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

      <ChatPostInput
        chat={chat}
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
        disabled={!chat}
      >
        Post
      </button>
      </form>
    </div>
  )
}

export default ChatPostForm;