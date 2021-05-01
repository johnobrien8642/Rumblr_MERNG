import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import TextPostInput from '../../util/components/forms/inputTypes/Text_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js';
const { bodyPost, updateCacheCreate,
        updateCacheUpdate, handleFormData, 
        stripAllImgs, handleUploadedFiles, 
        resetDisplayIdx, handleTagInput } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const TextPostForm = ({
  post, update,
  setUpdate
}) => {
  let [title, setTitle] = useState('');
  let [main, setMain] = useState('');

  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'textPostForm'
  const formInputId = 'textPostInput'
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
      if (post) {
        setUpdate(update = false)
        resetInputs();
      } else {
        resetInputs();
        history.push('/dashboard');
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    objsToClean.current = [];
    setTitle(title = '');
    setMain(main = '');
    body.current = []
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

        var descContent = stripAllImgs(body).map(d => d.content)
        var mentions = descContent.reduce((array, string) => {
          var regexMention = new RegExp(/@\w+/, 'gm')
          return array.concat(string.match(regexMention))
        }, [])
        
        var instanceData = {
          statics: { title, main },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: Array.from(new Set(mentions)),
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

  return (
    <div
      className={post ? '' : 'postForm'}
    >
      <h1>TextPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

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
        disabled={!title && body.current.length === 0 && !description}
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

export default TextPostForm;