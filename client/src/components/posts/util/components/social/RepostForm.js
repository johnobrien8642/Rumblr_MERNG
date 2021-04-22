import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import PostShow from '../../../types/showOrUpdate/PostShow'
import Mutations from '../../../../../graphql/mutations'
import Queries from '../../../../../graphql/queries'
const { CREATE_REPOST } = Mutations;
const { FETCH_POST, FETCH_USER_FEED } = Queries;

const RepostForm = () => {
  let [repostCaption, setRepostCaption] = useState('');
  let { postId, typename } = useParams();
  let history = useHistory();
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
      
      var newPostArr = [repost, ...fetchUserFeed]

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
      history.push('/dashboard')
    },
    onError(error) {
      console.log(error)
    }
  })
  
  let { loading, error, data } = useQuery(FETCH_POST, {
    variables: {
      postId: postId,
      type: typename
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`
  
  const { post } = data;

  const resetInputs = () => {
    setRepostCaption(repostCaption = '');
  }

  const handleSubmit = () => {
    var repostObj = {}

    if (post.kind === 'Repost') {
      repostObj.postId = post.post._id
      repostObj.postKind = post.post.kind
    } else {
      repostObj.postId = post._id
      repostObj.postKind = post.kind
    }

    repostObj.repostCaption = repostCaption
    repostObj.user = Cookies.get('currentUser')
    repostObj.repostedFrom = post.user.blogName

    repost({
      variables: {
        repostData: repostObj
      }
    })
  }

  return (
    <div>
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
          onClick={() => history.goBack()}  
        >
          Close
        </button>

        <button 
          type='submit'
        >
          Repost
        </button>
      </form>
    </div>
  )
}

export default RepostForm;