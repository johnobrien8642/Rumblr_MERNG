import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import VideoInput from '../../util/components/forms/inputTypes/Video_Input';
import TextAndImageInput from '../../util/components/forms/inputTypes/Text_And_Image_Input';
import Tags from '../../util/components/forms/Tags';
import PostFormUtil from '../../util/functions/post_form_util.js';
const { updateCacheCreate,
        updateCacheUpdate,
        videoPost } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const VideoPostForm = ({
  post, update,
  setUpdate
}) => {
  let [videoFile, setVideoFile] = useState('');
  let [videoObj, setVideoObj] = useState('');
  let [isLink, setIsLink] = useState(false)
  
  let [active, setActive] = useState(false)
  let objsToClean = useRef([]);
  let [textAndImage, setTextAndImage] = useState('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  const formId = 'videoPostForm';
  let history = useHistory();

  let [createOrUpdatePost] = useMutation(CREATE_OR_UPDATE_POST, {
    update(client, { data }){
      const { createOrUpdatePost } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED
      
      if (post) {
        updateCacheUpdate(client, createOrUpdatePost, currentUser, query)
      } else {
        updateCacheCreate(client, createOrUpdatePost, currentUser, query)
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
    setTextAndImage(textAndImage = '');
    setTag(tag = '');
    setTags(tags = []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var videoFileFormData = new FormData();
    
    if (videoFile) {
      videoFileFormData.append('video', videoFile)
    }

    Promise.all([
      videoPost(videoFileFormData, videoObj, isLink)
    ]).then(
      ([video]) => {

        var instanceData = {
          statics: { 
            videoLink: video[0]._id 
          },
          body: textAndImage,
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

  return (
    <div
      className={post ? '' : 'postForm'}
    >
      <h1>VideoPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >
      
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
    
      <TextAndImageInput 
        textAndImage={textAndImage}
        setTextAndImage={setTextAndImage}
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
        disabled={!videoObj}
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

export default VideoPostForm;