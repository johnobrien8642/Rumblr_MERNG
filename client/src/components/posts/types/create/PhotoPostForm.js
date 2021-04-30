import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
import PhotoPostInput from '../../util/components/forms/inputTypes/Photo_Post_Input'
import TextAndImageInput from '../../util/components/forms/inputTypes/Text_And_Image_Input'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
const { updateCacheCreate,
        updateCacheUpdate } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const PhotoPostForm = ({
  post, update,
  setUpdate
}) => {
  let [main, setMain] = useState('');

  let objsToClean = useRef([]);
  let [textAndImage, setTextAndImage] = useState('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  const formId = 'photoPostForm'
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
    setMain(main = '');
    setTextAndImage(textAndImage = '');
    setTag(tag = '');
    setTags(tags = []);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    var instanceData = {
      statics: { mainImages: main },
      body: textAndImage,
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
      
        {/* <PhotoPostInput
          
        /> */}

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
          disabled={!main}
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