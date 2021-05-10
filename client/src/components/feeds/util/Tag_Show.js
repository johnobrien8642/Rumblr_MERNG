import React from 'react';
import FollowButton from '../../posts/util/components/social/Follow_Button';

const TagShow = ({
  tag
}) => {

  return (
    <div>
      <h1>{tag.title}</h1>
      <span>{tag.followerCount} followers</span>
      <span>/</span>
      <span>{tag.postHeatLastWeek} recent posts</span>
      <FollowButton tag={tag} />
    </div>
  )
}

export default TagShow;