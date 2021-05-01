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
        updateCacheUpdate,
        handleFormData, stripAllImgs,
        audioPost, handleUploadedFiles,
        resetDisplayIdx, handleMentions, 
        discardMentions  } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const AudioPostForm = ({
  post, update,
  setUpdate
}) => {
  // let audioFile = useRef({});
  let [audioFile, setAudioFile] = useState('');
  // let audioObj = useRef({});
  let [title, setTitle] = useState('');
  let [artist, setArtist] = useState('');
  let [album, setAlbum] = useState('');
  let [src, setSrc] = useState('');


  let [active, setActive] = useState(false)

  let objsToClean = useRef([]);
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
    audioFile.current = {};
    setTitle(title = '') 
    setArtist(artist = '') 
    setAlbum(album = '') 
    setSrc(src = '')
    setAudioFile(audioFile = '')
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (audioFile) {
      var audioFileFormData = new FormData();
      audioFileFormData.append('audio', audioFile)
    }
  
    var bodyImagesFormData = handleFormData(bodyImageFiles)
  
    Promise.all([
      bodyPost(bodyImagesFormData),
      audioPost(audioFileFormData)
    ]).then(
      ([bodyUploads, audio]) => {

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)

        var instanceData = {
          statics: {
            audioFileId: audio[0] ? audio[0]._id : post.audioFile._id,
              audioMeta: {
                title, artist, album
              }
          },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'AudioPost',
          objsToClean: objsToClean.current,
          post: post ? post : null
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
      <h1>AudioPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >
    
      <AudioFileInput
        post={post}
        update={update}
        formId={formId}
        objsToClean={objsToClean}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        title={title}
        setTitle={setTitle}
        artist={artist}
        setArtist={setArtist}
        album={album}
        setAlbum={setAlbum}
        src={src}
        setSrc={setSrc}
        active={active}
        setActive={setActive}
        render={render}
        setRender={setRender}
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
        disabled={!audioFile}
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

export default AudioPostForm;