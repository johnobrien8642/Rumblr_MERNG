import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import LinkPreview from '../../util/components/forms/Link_Preview'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
const { bodyPost, updateCacheCreate,
        handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx, 
        fetchUrlMetadata } = PostFormUtil;
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const LinkPostForm = () => {
  let [link, setLink] = useState('');
  let [pastLink, setPastLink] = useState('')
  let [siteName, setSiteName] = useState('');
  let [imageUrl, setImageUrl] = useState('');
  let [title, setTitle] = useState('');
  let [linkDescription, setLinkDescription] = useState('');
  let [result, setResult] = useState('');
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  const formId = 'linkPostForm';
  const formInputId = 'linkPostInput';
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
    setLink(link = '');
    setPastLink(pastLink = '');
    setResult(result = '');
    setTitle(title = '');
    setSiteName(siteName = '');
    setImageUrl(imageUrl = '');
    setLinkDescription(linkDescription = '');
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
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
          
        var instanceData = {
          statics: {
            linkObj: {
              link, siteName, imageUrl,
              title, linkDescription
            }
          },
          descriptions: stripAllImgs(body),
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          user: Cookies.get('currentUser'),
          tags, kind: 'LinkPost'
        };
        
        createPost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }
  
  const handleLinkPreview = () => {
    if (link !== pastLink && link !== '') {
      setPastLink(pastLink = link)
      fetchUrlMetadata(link).then(res => {
        if (res.data.success === true) {
          if (res.data.hasOwnProperty('ogImage')) {
            setResult(result = res)
            setSiteName(siteName = res.data.ogSiteName || '')
            setImageUrl(imageUrl = res.data.ogImage.url)
          } else {
            setResult(result = res)
            setSiteName(siteName = res.data.ogSiteName || '')
            setImageUrl(imageUrl = '')
          }
          setTitle(title = res.data.ogTitle)
          setLinkDescription(linkDescription = res.data.ogDescription)
        }
      })
    }
  }

  const resetLink = () => {
    setLink(link = '')
    setPastLink(pastLink = '')
    setResult(result = '')
  }
  
  return (
    <div
      className='postForm'
    >
      <h1>LinkPost</h1>
      <form
        id={formId}
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
        encType={'multipart/form-data'}
      >

      {handleLinkPreview()}
      
      <LinkPreview
        link={link}
        setLink={setLink}
        pastLink={pastLink}
        setPastLink={setPastLink}
        result={result}
        siteName={siteName}
        setSiteName={setSiteName}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        title={title}
        setTitle={setTitle}
        linkDescription={linkDescription}
        setLinkDescription={setLinkDescription}
        resetLink={resetLink}
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
        disabled={!result}
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

export default LinkPostForm;