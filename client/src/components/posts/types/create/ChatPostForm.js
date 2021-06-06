import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import ChatPostInput from '../../util/components/forms/inputTypes/Chat_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx,
        handleMentions, discardMentions,
        handleAllTextChatPost, preventScroll,
        allowScroll } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const ChatPostForm = ({
  user,
  post, 
  update,
  setUpdate,
  chatPostActive,
  setChatPostActive,
  postFormModal,
  setPostFormModal
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
  let [confirmClose, setConfirmClose] = useState(false);
  const formId = 'chatPostForm';
  const formInputId = 'chatPostInput';

  useEffect(() => {
  
    preventScroll(chatPostActive, document)

  }, [chatPostActive])

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
        allowScroll(document)
        setChatPostActive(chatPostActive = false)
        setPostFormModal(postFormModal = false)
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

  const disabledBool = () => {
    return !chat.current &&
    body.current.length === 0 &&
    !description
  }
  
  if (chatPostActive) {
    return (
      <div
        className='postFormContainer'
      >

      <ProfilePic user={user} />

      <div
        className={chatPostActive ? 
        'postForm chatPostForm active' : 
        'postForm chatPostForm hidden'
        }
      >
        <form
          id={formId}
          onSubmit={e => handleSubmit(e)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
          encType={'multipart/form-data'}
        >

        <h3>{user.blogName}</h3>
  
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
        <div
          className='closeOrPostContainer'
        >
          <div
            className='closeBtn'
            onClick={() => {
              if (disabledBool()) {
                  resetInputs()
                  allowScroll(document)
                  setChatPostActive(chatPostActive = false)
                  setPostFormModal(postFormModal = false)
                } else {
                  setConfirmClose(confirmClose = true)
                }
            }}
          >
            Close
          </div>

          <ConfirmClose
            confirmClose={confirmClose}
            setConfirmClose={setConfirmClose}
            allowScroll={allowScroll}
            resetInputs={resetInputs}
            setFormActive={setChatPostActive}
            formActive={chatPostActive}
            setPostFormModal={setPostFormModal}
            postFormModal={postFormModal}
          />

          <button
            className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
            type='submit'
            disabled={disabledBool()}
          >
            {post ? 'Update' : 'Post'}
          </button>
        </div>
        </form>
      </div>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default ChatPostForm;