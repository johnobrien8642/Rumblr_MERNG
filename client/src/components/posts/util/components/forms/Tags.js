import React from 'react';
import PostCreateUtil from '../../functions/post_create_util.js'
import MatchedTagResults from './Matched_Tag_Results'
const { handleEnterTagInput, handleClickTagInput } = PostCreateUtil;

const Tags = ({
  tags, setTags,
  tag, setTag
}) => {

  return (
    <div>
      {tags.map((tag, i) => {
        return (
          <div key={i}>
            {tag}
          </div>
        )
      })}

      <input
        type='text'
        value={tag}
        placeholder='#tags'
        onChange={e => setTag(tag = e.target.value)}
        onKeyDown={e => {
          handleEnterTagInput(
              e, tag, setTags,
              tags, setTag
            )
          }
        }
      />

      <div>
        <MatchedTagResults 
          query={tag}
          handleClickTagInput={handleClickTagInput}
          tags={tags}
          setTags={setTags}
          tag={tag}
          setTag={setTag}
        />
      </div>
    </div>
  )

}

export default Tags;