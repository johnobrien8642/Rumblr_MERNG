import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import TextPostInput from '../../util/components/forms/inputTypes/Text_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, 
        stripAllImgs, handleUploadedFiles, 
        resetDisplayIdx, handleTagInput,
        handleAllTextTextPost, handleMentions, 
        discardMentions, preventScroll, 
        allowScroll } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const TextPostForm = ({
  user,
  mobile,
  post, 
  update,
  setUpdate,
  textPostActive,
  setTextPostActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen
}) => {
  let [title, setTitle] = useState('');

  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  let [confirmClose, setConfirmClose] = useState(false);
  const formId = 'textPostForm'
  const formInputId = 'textPostInput'

  useEffect(() => {

    preventScroll(textPostActive, document)

  }, [textPostActive])
  
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
      if (post) {
        setUpdate(update = false)
        resetInputs();
      } else {
        resetInputs();
        allowScroll(document)
        setPostFormModal(postFormModal = false)
        setTextPostActive(textPostActive = false)
        
        if (mobile) {
          setPostFormOpen(postFormOpen = false)
        }
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    objsToClean.current = [];
    setTitle(title = '');
    body.current = []
    allText.current = '';
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

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)

        var descriptions = stripAllImgs(body)

        handleAllTextTextPost(allText, descriptions, title)

        var instanceData = {
          variants: {
            title 
          },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'TextPost',
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
    return !title && body.current.length === 0 && !description
  }

  if (textPostActive) {
    return (
    <div
      className='postFormContainer'
    >

      <ProfilePic user={user} />

      <div
        className={textPostActive ? 
          'postForm textPostForm active' :
          'postForm textPostForm hidden'
        }
      >
        <form
          id={formId}
          onSubmit={e => handleSubmit(e)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
          encType={'multipart/form-data'}
        >

        <h3>{user.blogName}</h3>
  
        <TextPostInput
          post={post}
          update={update}
          formInputId={formInputId}
          title={title}
          setTitle={setTitle}
          render={render}
          setRender={setRender}
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
                  setTextPostActive(textPostActive = false)
                  setPostFormModal(postFormModal = false)
                  if (mobile) {
                    setPostFormOpen(postFormOpen = false)
                  }
                } else  {
                  setConfirmClose(confirmClose = true)
                }
              }}
            >
              Close
            </div>

            <ConfirmClose
              mobile={mobile}
              confirmClose={confirmClose}
              setConfirmClose={setConfirmClose}
              allowScroll={allowScroll}
              resetInputs={resetInputs}
              setFormActive={setTextPostActive}
              formActive={textPostActive}
              setPostFormModal={setPostFormModal}
              postFormModal={postFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
            />
            
            <button
              className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
              type='submit'
              disabled={disabledBool()}
              onClick={() => {
                if (description) {
                  var textObj = {
                    kind: 'text',
                    srcType: 'text',
                    content: description,
                    displayIdx: body.current.length,
                    uniqId: randomstring.generate({
                      length: 12,
                      charset: 'alphabetic'
                    })
                  }

                  body.current.push(textObj)
                
                  setDescription(description = '')
                }
              
                if (tag) {
                  handleTagInput(
                    tag, setTag,
                    tags, setTags
                  )
                }
              }}
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

export default TextPostForm;