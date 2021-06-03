import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import Mutations from '../../../../../graphql/mutations.js';
import Queries from '../../../../../graphql/queries.js';
import UpdateCacheUtil from '../../../util/functions/update_cache_util.js';
const { FOLLOW, UNFOLLOW } = Mutations;
const { FETCH_USER } = Queries;
const { followUpdate, unfollowUpdate } = UpdateCacheUtil;

const FollowButton = ({
  feed,
  user,
  tag, 
  followed 
}) => {
  var initial;
  var tagOrUser;
  var itemKind;
  
  if (user) {
    if (followed) {
      initial = true
    } else {
      initial = false
    }
    tagOrUser = user._id
    itemKind = user.kind
  } else if (tag) {
    if (followed) {
      initial = true
    } else {
      initial = false
    }
    tagOrUser = tag._id
    itemKind = tag.kind
  }

  let [status, setStatus] = useState(initial)

  let [follow] = useMutation(FOLLOW, {
    update(client, { data }) {
      var { follow } = data
      
      followUpdate(client, follow, FETCH_USER, Cookies.get('currentUser'), itemKind)
    },
    onError(error) {
      console.log(error.message)
    }
  });

  let [unfollow] = useMutation(UNFOLLOW, {
    update(client, { data }) {
      var { unfollow } = data
      
      unfollowUpdate(client, unfollow, FETCH_USER, Cookies.get('currentUser'), itemKind)
    },
    onError(error) {
      console.log(error.message)
    }
  });
  
  if (user) {
    if (
        (feed &&
        followed) || 
        (Cookies.get('currentUser') === 
        user.blogName)
      ) {
        return (
          <div>
          </div>
        )
    } else if (
      feed && 
      !followed && 
      Cookies.get('currentUser') === user.blogName
      ) {
        return (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault();
                follow({
                  variables: {
                    user: Cookies.get('currentUser'),
                    item: tagOrUser,
                    itemKind: itemKind
                  }
                })
                setStatus(status = true)
              }}
            >
              <button type='submit'>Follow</button>
            </form>
          </React.Fragment>
        )
      } else {
      if (status) {
        return (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault();
                unfollow({
                  variables: {
                    user: Cookies.get('currentUser'),
                    item: tagOrUser
                  }
                })
                setStatus(status = false)
              }}
            >
              <button type='submit'>Unfollow</button>
            </form>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault();
                follow({
                  variables: {
                    user: Cookies.get('currentUser'),
                    item: tagOrUser,
                    itemKind: itemKind
                  }
                })
                setStatus(status = true)
              }}
            >
              <button type='submit'>Follow</button>
            </form>
          </React.Fragment>
        )
      }
    }
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default FollowButton;