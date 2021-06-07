import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import PostShow from '../../../types/showOrUpdate/PostShow'
import ConfirmClose from '../../../../nav/Confirm_Close';
import Mutations from '../../../../../graphql/mutations'
import Queries from '../../../../../graphql/queries'
import PostFormUtil from '../../functions/post_form_util.js';
const { CREATE_REPOST } = Mutations;
const { FETCH_USER_FEED } = Queries;
const { preventScroll, allowScroll } = PostFormUtil;

const RepostForm = ({
  post,
  repostActive,
  setRepostActive
}) => {
  let [repostCaption, setRepostCaption] = useState('');
  let [confirmClose, setConfirmClose] = useState(false)

  useEffect(() => {

    if (repostActive) {
      preventScroll(repostActive, document)
    }

    return () => {
      allowScroll(document)
    }
  })

  let [repost] = useMutation(CREATE_REPOST, {
    update(client, { data }) {
      const { repost } = data;
      
      var readFeed = client.readQuery({
        query: FETCH_USER_FEED,
        variables: {
          query: Cookies.get('currentUser')
        }
      })
  
      var { fetchUserFeed } = readFeed;
      
      var newPostArr = [{ __typename: 'createPost'}, repost, ...fetchUserFeed]

      client.writeQuery({
        query: FETCH_USER_FEED,
        variables: {
          query: Cookies.get('currentUser')
        },
        data: {
          fetchUserFeed: newPostArr
        }
      })
    },
    onCompleted(data) {
      resetInputs();
      setRepostActive(repostActive = false)
    },
    onError(error) {
      console.log(error)
    }
  })
  
  // let { loading, error, data } = useQuery(FETCH_POST, {
  //   variables: {
  //     query: postId
  //   }
  // })

  // if (loading) return 'Loading...';
  // if (error) return `Error: ${error}`
  
  // const { post } = data;
  
  const resetInputs = () => {
    setRepostCaption(repostCaption = '');
  }

  const handleSubmit = () => {
    var repostObj = {}

    if (post.kind === 'Repost') {
      repostObj.repostedId = post._id
      repostObj.postId = post.post._id
      repostObj.postKind = post.post.kind
      repostObj.postAuthor = post.post.user._id
    } else {
      repostObj.repostedId = post._id
      repostObj.postId = post._id
      repostObj.postKind = post.kind
      repostObj.postAuthor = post.user._id
    }
    repostObj.previousReposter = post.kind === 'Repost' ? post.user : null
    repostObj.repostCaption = repostCaption
    repostObj.user = Cookies.get('currentUser')
    repostObj.repostedFrom = post.user.blogName

    repost({
      variables: {
        repostData: repostObj
      }
    })
  }

  if (repostActive) {
    return (
      <React.Fragment>
      <div className='repostModal'/>
        <div
          className='repostForm'
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit()
            }}
          >
  
            <PostShow 
              post={post}
            />
  
            <textarea
              type='text'
              value={repostCaption}
              placeholder={'Enter a caption'}
              onChange={e => {
                setRepostCaption(repostCaption = e.target.value)
              }}
            ></textarea>
  
            <button 
              type='button'
              onClick={() => setConfirmClose(confirmClose = true)}  
            >
              Close
            </button>
  
            <ConfirmClose
              confirmClose={confirmClose}
              setConfirmClose={setConfirmClose}
              allowScroll={allowScroll}
              resetInputs={resetInputs}
              setFormActive={setRepostActive}
              formActive={repostActive}
              repost={true}
            />
  
            <button 
              type='submit'
            >
              Repost
            </button>
          </form>
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div></div>
    )
  }

}

export default RepostForm;