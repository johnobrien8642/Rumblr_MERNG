import React from 'react';

const Tabs = ({
  tab, setTab, 
  mentionsCount, 
  repostsCount, 
  commentsCount, 
  cursorId
}) => {

  return(
    <div>
      <div
        className={tab === 'all' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          cursorId.current = new Date().getTime()
          setTab(tab = 'all')
        }}
      >
        All
      </div>
      <div
        className={tab === 'Mention' ? 'activityTabSelected' : 'activityTab'}
        onClick={() => {
          cursorId.current = new Date().getTime()
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
          cursorId.current = new Date().getTime()
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
          cursorId.current = new Date().getTime()
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