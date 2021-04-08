import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import FollowButton from '../../posts/util/components/social/Follow_Button'
import Queries from '../../../graphql/queries';
import Cookies from 'js-cookie';
const { DOES_USER_FOLLOW_TAG } = Queries;

const TagResult = ({ tag, activate }) => {
  let { loading, error, data, refetch } = useQuery(DOES_USER_FOLLOW_TAG, {
    variables: {
      user: Cookies.get('currentUser'),
      tagId: tag._id
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { doesUserFollowTag } = data;
  
  var cleanedTag = tag.title.slice(1)

  return (
    <React.Fragment>
      <Link 
        to={`/view/tag/${cleanedTag}`}
        onClick={activate}
      >
        {tag.title}
      </Link>
      <FollowButton
        tag={tag} 
        follow={doesUserFollowTag}
      />
    </React.Fragment>
  )
}

export default TagResult;