import React, { useState, useRef, useEffect } from 'react';
import Tabs from './Tabs';
import Content from './Content';

const Activity = ({
  navActive, setNavActive, 
  activityClose, closeActivity,
  mentionsCount, repostsCount,
  commentsCount
}) => {
  let timeAgoRef = useRef([]);
  let totalCountRef = useRef(0)
  let cursorId = useRef(new Date().getTime())
  let [active, setActive] = useState(false)
  let [tab, setTab] = useState('all');
  // let tabRef = useRef('all')

  useEffect(() => {
    if (activityClose) {
      //eslint-disable-next-line
      setActive(active = false)
      //eslint-disable-next-line
      closeActivity(activityClose = false)
    }

  }, [activityClose])

  const accumulateCounts = (
    mentionsCount, 
    repostsCount, 
    commentsCount,
    totalCountRef
  ) => {
    totalCountRef.current = totalCountRef.current + mentionsCount + repostsCount + commentsCount
  }

  const renderTotalCount = (totalCountRef) => {
    if (totalCountRef.current > 0 && totalCountRef.current <= 99) {
      return (
        <div
          className='countAlertWrapperDiv'
        >
          <div>
            <span
              className={
                totalCountRef.current < 10 ? 
                'oneThroughTen' : 
                'elevenThroughNinetyNine'
              }
            >
              {totalCountRef.current}
            </span>
          </div>
        </div>
      )
    } else if (totalCountRef.current > 99) {
      return (
        <div
          className='countAlertWrapperDiv'
        >
          <div>
            <span
              className={'greaterThanNinetyNine'}
            >
              99+
            </span>
          </div>
        </div>
      )
    }
  }
  
  if (active) {

    accumulateCounts(
      mentionsCount,
      repostsCount,
      commentsCount,
      totalCountRef
    )

    return(
      <div
        className='activityIcon'
        onClick={() => {
          setActive(active = true)
        }}
      >
        <img 
         src="https://img.icons8.com/fluent-systems-filled/48/ffffff/lightning-bolt.png"
         alt=''
        />
        
        <div
          className='activity'
          tabIndex={0}
          onBlur={e => {
            if (!e.relatedTarget) {
              var date = new Date()
              cursorId.current = date.getTime()
              timeAgoRef.current = []
              setTab(tab = 'all')
              setActive(active = false)
            }
          }}
        >
          <Tabs
            tab={tab}
            setTab={setTab}
            cursorId={cursorId}
            timeAgoRef={timeAgoRef}
          />
          <Content
            tab={tab}
            active={active}
            setActive={setActive}
            activityCursorId={cursorId}
            navActive={navActive}
            setNavActive={setNavActive}
            timeAgoRef={timeAgoRef}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='activityIcon'
        onClick={() => {
          totalCountRef.current = 0
          setActive(active = true)
        }}
      >
        <img 
          src="https://img.icons8.com/fluent-systems-filled/48/ffffff/lightning-bolt.png"
          alt=''
        />
        {renderTotalCount(totalCountRef)}
      </div>
    )
  }
}

export default Activity;