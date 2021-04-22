import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
import PhotoPostInput from '../../util/components/forms/inputTypes/Photo_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
const { bodyPost, mainPost, 
        updateCacheCreate,
        updateCacheUpdate,
        handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const PhotoPostForm = ({
  post, update,
  setUpdate
}) => {
  let [mainImageFiles, setMainImageFiles] = useState([]);
  let main = useRef([]);

  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0)
  const formId = 'photoPostForm'
  const formInputId = 'photoPostInput'
  let history = useHistory();

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
    setMainImageFiles(mainImageFiles = []);
    setBodyImageFiles(bodyImageFiles = []);
    setDescription(description = '');
    body.current = [];
    main.current = [];
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

        var instanceData = {
          statics: { mainImages: handleUploadedFiles(main, mainUploads) },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
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

  return (
    <div
      className={post ? '' : 'postForm'}
    >
      <h1>PhotoPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
        encType={'multipart/form-data'}
      >
      
        <PhotoPostInput
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
          disabled={
            main.current.length === 0 &&
            mainImageFiles.length === 0 && 
            bodyImageFiles.length === 0
          }
        >
          {post ? 'update': 'post'}
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

export default PhotoPostForm;