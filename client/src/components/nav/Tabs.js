import React, { useRef } from 'react';

const Tabs = ({
  tab, setTab, counts
}) => {
  let mentionsCount = useRef(counts.mentionsCount)
  let repostsCount = useRef(counts.repostsCount)
  let commentsCount = useRef(counts.commentsCount)
  
  return(
    <div>
      <div
        className={tab === 'all' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          setTab(tab = 'all')
        }}
      >
        All
      </div>
      <div
        className={tab === 'Mention' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          mentionsCount.current = 0
          setTab(tab = 'Mention')
        }}
      >
        Mentions
        <span>{mentionsCount.current ? mentionsCount.current : ''}</span>
      </div>
      <div
        className={tab === 'Repost' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          repostsCount.current = 0
          setTab(tab = 'Repost')
        }}
      >
        Reblogs
        <span>{repostsCount.current ? repostsCount.current : ''}</span>
      </div>
      <div
        className={tab === 'Comment' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          commentsCount.current = 0
          setTab(tab = 'Comment')
        }}
      >
        Replies
        <span>{commentsCount.current ? commentsCount.current : ''}</span>
      </div>
    </div>
  )
}

export default Tabs;