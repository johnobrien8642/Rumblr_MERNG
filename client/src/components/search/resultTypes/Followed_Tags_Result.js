import React from 'react';
import { useQuery } from '@apollo/client';
import TagResult from '../resultTypes/Tag_Result';
import Queries from '../../../graphql/queries.js';
import Cookies from 'js-cookie';
const { FETCH_USER } = Queries

const FollowedTags = ({
  user,
  followedActive,
  setFollowedActive,
  discover
}) => {

  if (followedActive) {
    return (
      <React.Fragment>
        <div
          className='followedTagsHeader'
        >
          {discover ? 'Following': 'Tags you follow'}
        </div>

        <ul
          className='followedTags'
        >
          {user.tagFollows.slice(0, 10).map((tag, i) => {
            return (
              <li 
                key={tag._id}
              >
                <div
                  className='tagResultContainer'
                >
                  <TagResult
                    currentUser={user}
                    tag={tag}
                  />
                </div>
                {/* <span
                  className='recentPostsCount'
                >{tag.postHeatLastWeek} recent posts</span> */}
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default FollowedTags;