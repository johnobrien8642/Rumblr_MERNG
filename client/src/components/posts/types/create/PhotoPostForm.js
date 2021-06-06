import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
import PhotoPostOrRegisterPhotoInput from '../../util/components/forms/inputTypes/Photo_Post_Or_Register_Photo_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, mainPost,
        handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx,
        handleMentions, discardMentions,
        handleAllTextPhotoPost, allowScroll,
        preventScroll  } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const PhotoPostForm = ({
  user,
  post, 
  update,
  setUpdate,
  photoPostActive,
  setPhotoPostActive,
  postFormModal,
  setPostFormModal
}) => {
  let [mainImageFiles, setMainImageFiles] = useState([]);
  let main = useRef([]);

  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0)
  let [confirmClose, setConfirmClose] = useState(false)
  const formId = 'photoPostForm'
  const formInputId = 'photoPostInput'

  useEffect(() => {
    
    preventScroll(photoPostActive, document)
    
  }, [photoPostActive])

  useEffect(() => {
    resetDisplayIdx(main)
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
        setPhotoPostActive(photoPostActive = false)
        setPostFormModal(postFormModal = false)
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    setMainImageFiles(mainImageFiles = []);
    setBodyImageFiles(bodyImageFiles = []);
    setDescription(description = '');
    body.current = [];
    main.current = [];
    allText.current = '';
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var mainImagesFormData = handleFormData(mainImageFiles)
    var bodyImagesFormData = handleFormData(bodyImageFiles)

    Promise.all([
      mainPost(mainImagesFormData), 
      bodyPost(bodyImagesFormData)
    ]).then(
      ([mainUploads, bodyUploads]) => {

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)

        var descriptions = stripAllImgs(body)

        handleAllTextPhotoPost(allText, descriptions)

        var instanceData = {
          variants: { mainImages: handleUploadedFiles(main, mainUploads) },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'PhotoPost',
          objsToClean: objsToClean.current,
          postId: post ? post._id : null
        }
        
        createOrUpdatePost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }

  const disabledBool = () => {
    return main.current.length === 0 && 
    body.current.length === 0 && 
    !description
  }

  if (photoPostActive) {
    return (
    <div
      className='postFormContainer'
    >

      <ProfilePic user={user} />
      
      <div
        className={photoPostActive ? 
          'postForm photoPostForm active' : 
          'postForm photoPostForm hidden'
        }
      >
        <form
          id={formId}
          onSubmit={e => handleSubmit(e)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
          encType={'multipart/form-data'}
        >

          <h3>{user.blogName}</h3>
        
          <PhotoPostOrRegisterPhotoInput
            post={post}
            update={update}
            formId={formId}
            formInputId={formInputId}
            objsToClean={objsToClean}
            main={main}
            mainImageFiles={mainImageFiles}
            setMainImageFiles={setMainImageFiles}
            render={render}
            setRender={setRender}
            errMessage={errMessage}
            setErrMessage={setErrMessage}
          />
  
          <BodyImageAndText
            displayBodyImageAndTextInput={true}
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
                allowScroll(document)
                resetInputs()
                setPhotoPostActive(photoPostActive = false)
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
            setFormActive={setPhotoPostActive}
            formActive={photoPostActive}
            setPostFormModal={setPostFormModal}
            postFormModal={postFormModal}
          />
  
          <button
            className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
            type='submit'
            disabled={disabledBool()}
          >
            {post ? 'Update': 'Post'}
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

export default PhotoPostForm;