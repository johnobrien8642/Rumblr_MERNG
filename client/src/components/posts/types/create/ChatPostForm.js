import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import ChatPostInput from '../../util/components/forms/inputTypes/Chat_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx,
        handleMentions, discardMentions,
        handleAllTextChatPost  } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const ChatPostForm = ({
  post, update,
  setUpdate
}) => {
  let chat = useRef('')

  let objsToClean = useRef([])
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'chatPostForm';
  const formInputId = 'chatPostInput';
  let history = useHistory();

  useEffect(() => {
    resetDisplayIdx(body)
  })

  let [createOrUpdatePost] = useMutation(CREATE_OR_UPDATE_POST, {
    update(client, { data }){
      const { createOrUpdatePost } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED
      
      if (post) {
        postUpdate(client, createOrUpdatePost, currentUser, query)
      } else {
        postCreate(client, createOrUpdatePost, currentUser, query)
      }
    },
    onCompleted() {
      resetInputs();
      if (post) {
        setUpdate(update = false)
      } else {
        history.push('/dashboard');
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    chat.current = '';
    setDescription(description = '');
    body.current = [];
    allText.current = '';
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
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

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)
        
        var descriptions = stripAllImgs(body)

        handleAllTextChatPost(allText, descriptions, chat)
        
        var instanceData = {
          variants: { chat: chat.current },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'ChatPost',
          objsToClean: objsToClean.current,
          postId: post ? post._id : null
        };
        
        createOrUpdatePost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }
  
  return (
    <div
      className={post ? '' : 'postForm'}
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
        post={post}
        update={update}
      />

      <BodyImageAndText
        post={post}
        update={update}
        formId={formId}
        formInputId={formInputId}
        objsToClean={objsToClean}
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
        post={post}
        tag={tag}
        setTag={setTag}
        tags={tags}
        setTags={setTags}
      />

      <button
        type='submit'
        disabled={!chat}
      >
        {post ? 'update' : 'post'}
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

export default ChatPostForm;