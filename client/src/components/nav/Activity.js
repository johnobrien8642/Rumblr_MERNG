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
  
  if (active) {
    const { fetchActivityCounts } = data;
    refetch()

    return(
      <div
        className='activity'
        tabIndex={0}
        onBlur={() => {
          var date = new Date()
          cursorId.current = date.getTime()
          setActive(active = false)
        }}
      >
        <Tabs
          tab={tab}
          setTab={setTab}
          counts={fetchActivityCounts}
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