import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import PostShow from '../../../types/showOrUpdate/PostShow'
import ConfirmClose from '../../../../nav/Confirm_Close';
import DescriptionStringInput from '../forms/inputTypes/Description_String_Input';
import FollowButton from './Follow_Button';
import ProfilePic from '../../../../user/util/components/Profile_Pic';
import Mutations from '../../../../../graphql/mutations';
import Queries from '../../../../../graphql/queries';
import PostFormUtil from '../../functions/post_form_util.js';
import FeedUtil from '../../functions/feed_util.js';
const { CREATE_REPOST } = Mutations;
const { FETCH_USER_FEED } = Queries;
const { preventScroll, allowScroll } = PostFormUtil;
const { doesUserFollowUser } = FeedUtil;

const RepostForm = ({
  post,
  show,
  repostActive,
  setRepostActive,
  currentUser
}) => {
  let [repostCaption, setRepostCaption] = useState('');
  let [confirmClose, setConfirmClose] = useState(false);

  let doesUserFollowUserRef = useRef(false)

  doesUserFollowUser(doesUserFollowUserRef, currentUser, post.user)

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
  
  if (show) {
    return (
      <React.Fragment>
        <div
          className='userRepostShowHeader'
        >
          <ProfilePic
            user={post.post.user}
          />
          <span>
            <Link 
              className='user'
              to={`/view/blog/${Cookies.get('currentUser')}`}>
              {Cookies.get('currentUser')}
            </Link> 
            <img
              src="https://img.icons8.com/material-two-tone/24/ffffff/retweet.png"
              alt=''
            />
            <Link
              className='repostedFrom'
              to={`/view/blog/${post.user.blogName}`}
            >
              {post.user.blogName}
            </Link>
            <FollowButton
              feed={true}
              user={post.repostedFrom}
              followed={doesUserFollowUserRef.current}
            />
          </span>
        </div>
        
        {/* <PostShow
          post={post}
          repostFormBool={false}
        /> */}
      </React.Fragment>
    )
  } else {
    if (repostActive) {
      return (
        <React.Fragment>
          <div 
            className='repostModal'
          >
            <div
              className='repostForm'
            >
  
              <div
                className='userRepostFormHeader'
              >
                <span>
                  <Link 
                    className='user'
                    to={`/view/blog/${Cookies.get('currentUser')}`}>
                    {Cookies.get('currentUser')}
                  </Link> 
                  <img 
                    src="https://img.icons8.com/material-two-tone/24/ffffff/retweet.png"
                    alt=''
                  />
                  <Link
                    className='repostedFrom'
                    to={`/view/blog/${post.user.blogName}`}
                  >
                    {post.user.blogName}
                  </Link>
                </span>
              </div>
  
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit()
                }}
              >
              
                <PostShow
                  post={post}
                  repostFormBool={true}
                />
  
                <DescriptionStringInput
                  repost={true}
                  description={repostCaption}
                  setDescription={setRepostCaption}
                />
  
                <div
                  className='closeOrPostContainer'
                >
                  <button
                    className='closeBtn'
                    type='button'
                    onClick={() => {
                      if (repostCaption) {
                        setConfirmClose(confirmClose = true)
                      } else {
                        setRepostActive(repostActive = false)
                      }
                    }} 
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
                    className='formSubmitBtn'
                    type='submit'
                  >
                    Repost
                  </button>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default RepostForm;