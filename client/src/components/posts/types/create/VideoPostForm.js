import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import VideoInput from '../../util/components/forms/inputTypes/Video_Input';
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text';
import Tags from '../../util/components/forms/Tags';
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, videoPost, handleFormData, 
        stripAllImgs, handleUploadedFiles, 
        resetDisplayIdx, handleMentions, 
        discardMentions, handleAllTextVideoPost  } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const VideoPostForm = ({
  user,
  post, 
  update,
  setUpdate,
  videoPostActive,
  setVideoPostActive,
  postFormModal,
  setPostFormModal
}) => {
  let [videoFile, setVideoFile] = useState('');
  let [videoObj, setVideoObj] = useState('');
  let [isLink, setIsLink] = useState(false)
  
  let [active, setActive] = useState(false)
  let [uploading, setUploading] = useState(false)
  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'videoPostForm';
  const formInputId = 'videoPostInput'
  let history = useHistory();

  useEffect(() => {
    var el = document.querySelector('.videoPostForm')

    if (el) {
      el.focus()
    }

  }, [videoPostActive])

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
    setVideoObj(videoObj = '');
    setVideoFile(videoFile = '');
    setActive(active = false);
    setUploading(uploading = false);
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    allText.current = '';
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (videoFile) {
      var videoFileFormData = new FormData();
      videoFileFormData.append('video', videoFile)
    }

    var bodyImagesFormData = handleFormData(bodyImageFiles)

    Promise.all([
      bodyPost(bodyImagesFormData),
      videoPost(videoFileFormData, isLink, videoObj)
    ]).then(
      ([bodyUploads, video]) => {

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)

        var descriptions = stripAllImgs(body)

        handleAllTextVideoPost(allText, descriptions)

        var instanceData = {
          variants: {
            videoLink: video[0]._id
          },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'VideoPost',
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

  if (videoPostActive) {
    return (
    <div
      className='postFormContainer'
    >

      <ProfilePic user={user} />

      <div>
        <div
          className={videoPostActive ? 
            'postForm videoPostForm active' : 
            'postForm videoPostForm active'
          }
          tabIndex={-1}
          onBlur={() => {
            setVideoPostActive(videoPostActive = false)
            setPostFormModal(postFormModal = false)
          }}
        >
          <h1>VideoPost</h1>
          <form
            id={formId}
            onSubmit={e => {
              setUploading(uploading = true)
              handleSubmit(e)
            }}
            onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
            encType={'multipart/form-data'}
          >

          <p>{uploading ? 'Uploading, please wait...': ''}</p>
          
          <VideoInput
            post={post}
            update={update}
            formId={formId}
            active={active}
            objsToClean={objsToClean}
            setActive={setActive}
            videoObj={videoObj}
            setVideoObj={setVideoObj}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            isLink={isLink}
            setIsLink={setIsLink}
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
            disabled={!videoObj && !uploading}
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

export default VideoPostForm;