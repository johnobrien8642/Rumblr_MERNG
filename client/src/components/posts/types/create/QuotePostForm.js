import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import QuotePostInput from '../../util/components/forms/inputTypes/Quote_Post_Input'
import TextAndImageInput from '../../util/components/forms/inputTypes/Text_And_Image_Input'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
const { updateCacheCreate, 
        updateCacheUpdate } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const QuotePostForm = ({
  post, update,
  setUpdate
}) => {
  let [quote, setQuote] = useState('');
  let [source, setSource] = useState('');

  let objsToClean = useRef([]);
  let [textAndImage, setTextAndImage] = useState('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let formId = 'quotePostForm';
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
    setQuote(quote = '');
    setSource(source = '');
    setTextAndImage(textAndImage = '');
    setTag(tag = '');
    setTags(tags = []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    var instanceData = {
      statics: { quote, source },
      body: textAndImage,
      user: Cookies.get('currentUser'),
      tags, kind: 'QuotePost',
      objsToClean: objsToClean.current,
      postId: post ? post._id : null
    };
    
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
      <h1>QuotePost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

      <QuotePostInput
        post={post}
        update={update}
        quote={quote}
        setQuote={setQuote}
        source={source}
        setSource={setSource}
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
        disabled={!quote}
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

export default QuotePostForm;