import React from 'react';
import TagResult from '../../../search/resultTypes/Tag_Result';
import UserResult from '../../../search/resultTypes/User_Result';

const header = (user, tag) => {
  if (user) {
    return (
      <UserResult user={user} />
    )
  } else if (tag) {
    return (
      <TagResult tag={tag} />
    )
  }
}

const updateCacheInfScroll = (
  res, 
  client,
  query, 
  gqlQuery, 
  cursorId
) => {
  
  var readFeed  = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query,
      cursorId: cursorId.current
    },
  })

  if (readFeed) {
    var { fetchTagFeed, fetchUserFeed, fetchUserBlog } = readFeed;
    var newData
    var oldArr
    if (fetchTagFeed) {
      newData = res.data.fetchTagFeed
      oldArr = fetchTagFeed
    } else if (fetchUserFeed) {
      newData = res.data.fetchUserFeed
      oldArr = fetchUserFeed
    } else if (fetchUserBlog) {
      newData = res.data.fetchUserBlog
      oldArr = fetchUserBlog
    }
  
    var newArr = [...oldArr, ...newData]
    
    if (fetchTagFeed) {
      client.writeQuery({
        query: gqlQuery,
        variables: {
          query: query,
          cursorId: cursorId.current
        },
        data: {
          fetchTagFeed: newArr
        }
      })
    } else if (fetchUserFeed) {
      client.writeQuery({
        query: gqlQuery,
        variables: {
          query: query,
          cursorId: cursorId.current
        },
        data: {
          fetchUserFeed: newArr
        }
      })
    } else if (fetchUserBlog) {
      client.writeQuery({
        query: gqlQuery,
        variables: {
          query: query,
          cursorId: cursorId.current
        },
        data: {
          fetchUserBlog: newArr
        }
      })
    }
    
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const handleData = (data, feedArr, cursorId, endOfPosts) => {

  if (data) {
    const { fetchUserFeed, fetchTagFeed, fetchUserBlog } = data
    if (fetchUserFeed) {
      feedArr.current = fetchUserFeed
    } else if (fetchTagFeed) {
      feedArr.current = fetchTagFeed
    } else if (fetchUserBlog) {
      feedArr.current = fetchUserBlog
    }
    
    endOfPosts.current = feedArr.current.length === 0 ? true : false
    if (feedArr.current.length > 0) {
      cursorId.current = feedArr.current[feedArr.current.length - 1]._id
    }
  }
}

const setQuery = (
  currentUser, user, tag,
  query, gqlQuery, Queries
) => {
  const { FETCH_USER_FEED, FETCH_TAG_FEED, FETCH_USER_BLOG } = Queries;

  if (currentUser) {
    query.current = currentUser
    gqlQuery.current = FETCH_USER_FEED
  } else if (tag) {
    query.current = tag.title.slice(1)
    gqlQuery.current = FETCH_TAG_FEED
  } else if (user) {
    query.current = user.blogName
    gqlQuery.current = FETCH_USER_BLOG
  }

}

const FeedUtil = { header, updateCacheInfScroll, handleData, setQuery }

export default FeedUtil;