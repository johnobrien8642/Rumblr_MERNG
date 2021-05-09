import React from 'react';
import TagResult from '../search/resultTypes/Tag_Result';

const RecommendedTags = ({
  recTags, tag, setTag
}) => {

  return (
    <div>
      {recTags.map(tag => {
        return (
          <div
            key={tag._id}
          >
            <TagResult tag={tag} />
          </div>
        )
      })}
    </div>
  )
}

export default RecommendedTags;