import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import AudioFileInput from '../../util/components/forms/inputTypes/Audio_File_Input';
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text';
import Tags from '../../util/components/forms/Tags';
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        audioPost, handleUploadedFiles,
        resetDisplayIdx, handleMentions, 
        discardMentions, handleAllTextAudioPost,
        allowScroll, preventScroll } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const AudioPostForm = ({
  user,
  post, 
  update,
  setUpdate,
  audioPostActive,
  setAudioPostActive,
  postFormModal,
  setPostFormModal
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
  let body = useRef([]);
  let allText = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  let [confirmClose, setConfirmClose] = useState(false);
  let [displayBodyImageAndTextInput, setDisplayBodyImageAndTextInput] = useState(false)
  const formId = 'audioPostForm';
  const formInputId = 'audioPostInput'
  
  useEffect(() => {

    preventScroll(audioPostActive, document)

  }, [audioPostActive])

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
        resetInputs()
        allowScroll(document)
        setAudioPostActive(audioPostActive = false)
        setPostFormModal(postFormModal = false)   
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    setTitle(title = '') 
    setArtist(artist = '') 
    setAlbum(album = '') 
    setSrc(src = '')
    setAudioFile(audioFile = '')
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    allText.current = '';
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
    setActive(active = false)
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

        var descriptions = stripAllImgs(body)

        handleAllTextAudioPost(allText, descriptions, title, artist, album)

        var instanceData = {
          variants: {
            audioFileId: audio[0] ? audio[0]._id : post.audioFile._id,
              audioMeta: {
                title, artist, album
              }
          },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'AudioPost',
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
    return !audioFile
  }

  if (audioPostActive) {
    return (
      <div
        className='postFormContainer'
      >

      <ProfilePic user={user} />

      <div
        className={audioPostActive ? 
          'postForm audioPostForm active' : 
          'postForm audioPostForm hidden'
        }
      >

        <h3>{user.blogName}</h3>

        <form
          id={formId}
          onSubmit={e => handleSubmit(e)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
          encType={'multipart/form-data'}
        >
      
        <AudioFileInput
          displayBodyImageAndTextInput={displayBodyImageAndTextInput}
          setDisplayBodyImageAndTextInput={setDisplayBodyImageAndTextInput}
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
          displayBodyImageAndTextInput={displayBodyImageAndTextInput}
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
                setAudioPostActive(audioPostActive = false)
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
            setFormActive={setAudioPostActive}
            formActive={audioPostActive}
            setPostFormModal={setPostFormModal}
            postFormModal={postFormModal}
          />

          <button
            className={disabledBool() ? 'formSubmitBtn disabled': 'formSubmitBtn'}
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

export default AudioPostForm;