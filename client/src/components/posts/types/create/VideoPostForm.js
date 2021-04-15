import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import VideoInput from '../../util/components/forms/inputTypes/Video_Input';
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text';
import Tags from '../../util/components/forms/Tags';
import PostCreateUtil from '../../util/functions/post_create_util.js';
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;
const { bodyPost, videoPost, 
        updateCacheCreate } = PostCreateUtil;

const VideoPostForm = () => {
  let videoFile = useRef('');
  let videoObj = useRef('');
  let [active, setActive] = useState(false)
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'videoPostForm';
  const formInputId = 'videoPostInput'
  let history = useHistory();

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
    videoObj.current = '';
    videoFile.current = '';
    setActive(active = false);
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
    body.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var videoFileFormData = new FormData();
    var bodyImagesFormData = new FormData();

    if (videoFile.current) {
      videoFileFormData.append('video', videoFile.current)
    }

    for (var i2 = 0; i2 < bodyImageFiles.length; i2++) {
      var file2 = bodyImageFiles[i2];
      bodyImagesFormData.append('images', file2);
    }

    Promise.all([
      bodyPost(bodyImagesFormData),
      videoPost(videoFileFormData, videoObj)
    ]).then(
      ([bodyObjs, video]) => {
        let cleanedBody = bodyObjs.map((obj) => {
          delete obj.__v
          return obj
        })

        var instanceData = {};
        instanceData.videoLink = video[0]._id
        instanceData.descriptions = body.current.filter(obj => obj.kind !== 'img')
        instanceData.descriptionImages = cleanedBody;
        instanceData.tags = tags;
        instanceData.user = Cookies.get('currentUser');
        instanceData.kind = 'VideoPost';
        
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
      <h1>VideoPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >
      
      <VideoInput
        formId={formId}
        active={active}
        setActive={setActive}
        videoObj={videoObj}
        videoFile={videoFile}
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
        disabled={!videoObj.current}
      >
        Post
      </button>
      </form>
    </div>
  )
}

export default VideoPostForm;