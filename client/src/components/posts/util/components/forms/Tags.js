import React, { useEffect } from 'react';
import MatchedTagResults from './Matched_Tag_Results'
import PostUpdateUtil from '../../functions/post_update_util.js'
import PostFormUtil from '../../functions/post_form_util.js'
const { pushTags } = PostUpdateUtil;
const { handleTagInput, handleFoundTag, removeTag } = PostFormUtil;

const Tags = ({
  post, tags, 
  setTags,
  tag, setTag
}) => {

  useEffect(() => {
    if (post) {
      pushTags(post.tags, tags, setTags)
    }  
    //eslint-disable-next-line
  }, [])


  return (
    <div>
      {tags.map((tag, i) => {
        return (
          <div 
            key={i}
          >
            {tag}
            <span
              className='removeTag'
              onClick={() => {
                removeTag(i, tags, setTags)
              }}
            >
              X
            </span>
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