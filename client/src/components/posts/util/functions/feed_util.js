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

const infiniteScroll = (
  client, 
  updateCacheFunc, 
  query, gqlQuery, 
  cursorId, 
  fetchMoreDiv,
  fetchMoreDivId
) => {

  return document.addEventListener('scroll', function(event) {
    fetchMoreDiv.current = document.querySelector(fetchMoreDivId.current)
      if (fetchMoreDiv.current) {
        var el = fetchMoreDiv.current.getBoundingClientRect()
        var elTop = el.top
        var elBottom = el.bottom
        var innerHeight = window.innerHeight
        
        if (elTop >= 0 && elBottom <= innerHeight) {
          //gqlQuery may need to be different?
          client.query({
            query: gqlQuery.current,
            variables: {
              query: query.current,
              cursorId: cursorId.current
            },
            fetchPolicy: 'no-cache'
            
          }).then(res => {
            if (res.loading) return 'Loading...';
              //this may need to be a more specific func
              updateCacheFunc(
                res, client, query.current,
                gqlQuery.current, cursorId
              )
          })
        }
      }
    })
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
    var { fetchTagFeed, fetchUserFeed, 
          fetchAllUserActivity } = readFeed;
  }
  
  var newData
  var oldArr
  var newArr
  if (fetchTagFeed) {
    oldArr = fetchTagFeed
    newData = res.data.fetchTagFeed
    newArr = [...oldArr, ...newData]

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
    oldArr = fetchUserFeed
    newData = res.data.fetchUserFeed
    newArr = [...oldArr, ...newData]

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
  } else if (fetchAllUserActivity) {
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchAllUserActivity: newArr
      }
    })
  } else if (fetchAllUserActivity) {
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchAllUserActivity: newArr
      }
    })
  }
  
  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const updateCacheInfScrollActivity = (
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
    var { fetchAllUserActivity } = readFeed;
  }

  var oldArr
  var newData
  
  if (fetchAllUserActivity) {
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity
  }

  var newArr = [...oldArr, ...newData]
  
  if (fetchAllUserActivity) {
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchAllUserActivity: newArr
      }
    })
  }
  
  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const updateCacheInfScrollUserFollowers = (
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
    var { fetchUserFollowers } = readFeed;
  }

  var oldArr
  var newData
  var newArr
  if (fetchUserFollowers) {
    oldArr = fetchUserFollowers
    newData = res.data.fetchUserFollowers
    newArr = [...oldArr, ...newData]
    
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchUserFollowers: newArr
      }
    })
  }

  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const handleData = (data, feedArr, cursorId, endOfPosts) => {
  const { fetchUserFeed, fetchTagFeed, 
          fetchAllUserActivity, fetchUserFollowers } = data

  if (fetchUserFeed) {
    feedArr.current = fetchUserFeed
  } else if (fetchTagFeed) {
    feedArr.current = fetchTagFeed
  } else if (fetchAllUserActivity) {
    feedArr.current = fetchAllUserActivity
  } else if (fetchUserFollowers) {
    feedArr.current = fetchUserFollowers
  }
  
  endOfPosts.current = feedArr.current.length === 0 ? true : false
  if (feedArr.current.length > 0) {
    cursorId.current = feedArr.current[feedArr.current.length - 1]._id
  }
}

const setgqlQueryAndQuery = (
  tag, user, 
  gqlQuery, query, 
  FETCH_TAG_FEED
) => {
  if (tag) {
    query.current = tag.title.slice(1)
    gqlQuery.current = FETCH_TAG_FEED
  } else if (user) {
    query.current = user.blogName
  }
}

const FeedUtil = { 
  header, updateCacheInfScroll,
  infiniteScroll,
  updateCacheInfScrollActivity,
  updateCacheInfScrollUserFollowers,
  handleData, setgqlQueryAndQuery
}

export default FeedUtil;