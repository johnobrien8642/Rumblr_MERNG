import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import PhotoPostShow from '../../../feed/types/PhotoPostShow'
import Mutations from '../../../../graphql/mutations'
import Queries from '../../../../graphql/queries'
const { REPOST_PHOTO_POST } = Mutations;
const { FETCH_POST, FETCH_FEED } = Queries;

const PhotoPostRepost = () => {
  let [repostCaption, setRepostCaption] = useState('');
  let { postId, typename } = useParams();
  let history = useHistory();
  let [repostPhotoPost] = useMutation(REPOST_PHOTO_POST, {
    update(client, { data }) {
      const { repostPhotoPost } = data;

      var readFeed = client.readQuery({
        query: FETCH_FEED,
        variables: {
          blogName: Cookies.get('currentUser')
        }
      })

      var { fetchUserFeed } = readFeed;

      var newPostArr = [repostPhotoPost, ...fetchUserFeed]

      client.writeQuery({
        query: FETCH_FEED,
        variables: {
          blogName: Cookies.get('currentUser')
        },
        data: {
          fetchUserFeed: newPostArr
        }
      })
    },
    onCompleted(data) {
      resetInputs();
      history.push('/dashboard')
    }
  })
  
  let { loading, error, data } = useQuery(FETCH_POST, {
    variables: {
      postId: postId,
      typename: typename
    }
  })

  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`
  
  const { post } = data;

  const resetInputs = () => {
    setRepostCaption(repostCaption = '');
  }

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          repostPhotoPost({
            variables: {
              user: post.user.blogName,
              mainImages: post.mainImages.map((img, i) => {
                var cleanedImg = {};
                cleanedImg._id = img._id
                cleanedImg.url = img.url
                cleanedImg.createdAt = img.createdAt
                return cleanedImg
              }),
              description: post.description,
              descriptionImages: post.descriptionImages.map((img, i) => {
                var cleanedImg = {};
                cleanedImg._id = img._id
                cleanedImg.url = img.url
                cleanedImg.createdAt = img.createdAt
                return cleanedImg
              }),
              tags: post.tags.map((t, i) => (t._id)),
              reposter: Cookies.get('currentUser'),
              repostCaption: repostCaption
            }
          })
        }}
      >
        <PhotoPostShow 
          post={post}
          reposter={Cookies.get('currentUser')} 
        />

        <textarea
          type='text'
          value={repostCaption}
          placeholder={'Enter a caption'}
          onChange={e => setRepostCaption(repostCaption = e.target.value)}
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

export default PhotoPostRepost;