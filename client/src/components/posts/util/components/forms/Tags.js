import React from 'react';
import PostCreateUtil from '../../functions/post_create_util.js'
import MatchedTagResults from './Matched_Tag_Results'
const { handleTagInput, handleFoundTag } = PostCreateUtil;

const Tags = ({
  tags, setTags,
  tag, setTag
}) => {

  return (
    <div
      
    >
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
          if (
            (e.key === 'Enter' && tag) || 
            (e.key === '#' && tag)
          ) {
            handleTagInput(
                tag, setTag,
                tags, setTags
              )
            }
          }
        }
        onClick={e => {
          if (tag) {
            handleTagInput(
              tag, setTag,
              tags, setTags
            )
          }
        }}
        onBlur={e => {
          if (!e.relatedTarget && tag) {
            handleTagInput(
              tag, setTag,
              tags, setTags
            )
          }
        }}
      />

      <div>
        <MatchedTagResults 
          query={tag}
          handleFoundTag={handleFoundTag}
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