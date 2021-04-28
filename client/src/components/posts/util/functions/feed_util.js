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
  
  var { fetchTagFeed, fetchUserFeed } = readFeed;
  
  var newData
  var oldArr
  if (fetchTagFeed) {
    newData = res.data.fetchTagFeed
    oldArr = fetchTagFeed
  } else if (fetchUserFeed) {
    newData = res.data.fetchUserFeed
    oldArr = fetchUserFeed
  }

  var newArr = [...oldArr, ...newData]
  
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
  
  cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
}

const handleData = (data, feedArr, cursorId, endOfPosts) => {
  const { fetchUserFeed, fetchTagFeed } = data

  if (fetchUserFeed) {
    feedArr.current = fetchUserFeed
  } else if (fetchTagFeed) {
    feedArr.current = fetchTagFeed
  }
  
  endOfPosts.current = feedArr.current.length === 0 ? true : false
  cursorId.current = feedArr.current[feedArr.current.length - 1]._id
}

const FeedUtil = { header, updateCacheInfScroll, handleData }

export default FeedUtil;