import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import AudioFileInput from '../../util/components/forms/inputTypes/Audio_File_Input';
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text';
import Tags from '../../util/components/forms/Tags';
import PostFormUtil from '../../util/functions/post_form_util.js';
const { bodyPost, updateCacheCreate,
        handleFormData, stripAllImgs,
        audioPost, handleUploadedFiles, 
        resetDisplayIdx } = PostFormUtil;
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const AudioPostForm = () => {
  let audioFile = useRef({});
  let audioObj = useRef({})
  let [active, setActive] = useState(false)
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'audioPostForm';
  const formInputId = 'audioPostInput'
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
    audioFile.current = {};
    audioObj.current = {};
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var audioFileFormData = new FormData();
    audioFileFormData.append('audio', audioFile.current)
    
    var bodyImagesFormData = handleFormData(bodyImageFiles)
  
    Promise.all([
      bodyPost(bodyImagesFormData),
      audioPost(audioFileFormData)
    ]).then(
      ([bodyUploads, audio]) => {
        var { title, artist, album } = audioObj.current

        var instanceData = {
          statics: {
            audioFileId: audio[0]._id,
              audioMeta: {
                title, artist, album
              }
          },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          user: Cookies.get('currentUser'),
          tags, kind: 'AudioPost'
        };
        
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
      <h1>AudioPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >
    
      <AudioFileInput
        formId={formId}
        audioFile={audioFile}
        audioObj={audioObj}
        active={active}
        setActive={setActive}
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
        disabled={!audioFile.current}
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

export default AudioPostForm;