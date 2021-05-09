import React, { useState, useRef } from 'react';
import Tabs from './Tabs';
import Content from './Content';
import { useLazyQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
import Cookies from 'js-cookie';
const { FETCH_ACTIVITY_COUNTS } = Queries;

const Activity = ({
  navActive, setNavActive
}) => {
  let mentionsCount = useRef(0)
  let repostsCount = useRef(0)
  let commentsCount = useRef(0)
  let cursorId = useRef(new Date().getTime())
  let [active, setActive] = useState(false)
  let [tab, setTab] = useState('all');

  const [fetchActivityCountsCB, { called, loading, data, refetch }] = useLazyQuery(FETCH_ACTIVITY_COUNTS, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: cursorId.current.toString()
    }
  })
  
  if (called && loading) return <p>Loading ...</p>

  if (!called) {
    fetchActivityCountsCB()
  }

  const accumulateCounts = (data) => {
    mentionsCount.current = mentionsCount.current + data.mentionsCount
    repostsCount.current = repostsCount.current + data.repostsCount
    commentsCount.current = commentsCount.current + data.commentsCount
  }
  
  if (active) {
    const { fetchActivityCounts } = data;
    refetch()
    accumulateCounts(fetchActivityCounts)

    return(
      <div
        className='activity'
        tabIndex={0}
        onBlur={e => {
          if (!e.relatedTarget) {
            var date = new Date()
            cursorId.current = date.getTime()
            setTab(tab = 'all')
            setActive(active = false)
          }
        }}
      >
        <Tabs
          tab={tab}
          setTab={setTab}
          cursorId={cursorId}
          mentionsCount={mentionsCount}
          repostsCount={repostsCount}
          commentsCount={commentsCount}
        />
        <Content
          tab={tab}
          active={active}
          setActive={setActive}
          activityCursorId={cursorId}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      </div>
    )
  } else {
    return (
      <div>
        <button
          type='button'
          onClick={() => {
            setActive(active = true)
          }}
        >
          Activity
        </button>
      </div>
    )
  }
}

export default Activity;