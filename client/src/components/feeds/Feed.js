import React, { useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { Link } from 'react-router-dom';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import FeedUtil from '../posts/util/functions/feed_util.js';
import ProfilePic from '../user/util/components/Profile_Pic';
import PostLoading from '../nav/Post_Loading';
import PostShowUtil from '../posts/util/functions/post_show_util.js';
const { FETCH_USER_FEED, FETCH_TAG_FEED } = Queries;
const { infiniteScroll, updateCacheInfScroll,
        handleData, setgqlQueryAndQuery } = FeedUtil;
const { handlePostClassName } = PostShowUtil;

const Feed = ({
  user, 
  tag,
  currentUser,
  uploading,
  setUploading
}) => {
  let feedArr = useRef([])
  let fetchMoreDiv = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFeed');
  let cursorId = useRef(null);
  let query = useRef(Cookies.get('currentUser'))
  let gqlQuery = useRef(FETCH_USER_FEED)
  let endOfPosts = useRef(false)
  const client = useApolloClient();

  setgqlQueryAndQuery(
    tag, user, gqlQuery,
    query, FETCH_TAG_FEED,
    Cookies.get('currentUser')
  )
  
  useEffect(() => {
    
    var scroll = infiniteScroll(
      client, updateCacheInfScroll,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )
    
    return () => {
      document.removeEventListener('scroll', scroll)
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data } = useQuery(gqlQuery.current, {
    variables: {
      query: query.current,
      cursorId: null
    },
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)
  
  return(
    <div
      className='userOrTagFeed'
    >
      <PostLoading 
        uploading={uploading}
      />
      {feedArr.current.map((obj, i) => {
        if (obj.kind === 'Repost') {
          return (
            <div
              className={handlePostClassName(obj)}
              key={obj._id}
            >
              
              <div
                className='userRepostShowHeader'
              >
                <ProfilePic
                  user={obj.post.user}
                />
                <span
                  className='repostHeaderContainer'
                >
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
                    to={`/view/blog/${obj.user.blogName}`}
                  >
                    {obj.user.blogName}
                  </Link>
                </span>
              </div>

              <PostUpdateOrShow
                post={obj}
                repostFormBool={false}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          )
        } else {
          return (
            <div
              className={handlePostClassName(obj)}
              key={obj._id}
            >
              <PostUpdateOrShow
                post={obj}
                currentUser={currentUser}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          )
        }
      })}
      <div
        id='fetchMoreFeed'
      >
        {endOfPosts.current ? "You're all caught up" : ""}
      </div>
    </div>
  )
}

export default Feed;