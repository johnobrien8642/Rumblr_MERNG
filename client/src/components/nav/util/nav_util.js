const accumulateCounts = (
  commentsCount,
  likesCount,
  mentionsCount,
  repostsCount
) => {
  let count = 0

  count += mentionsCount +
  repostsCount +
  likesCount +
  commentsCount
  
  return count
}

const renderTotalCount = (totalActivityCountRef, activityCounts, activityOpen) => {
    const { fetchActivityCounts } = activityCounts;
    const { mentionsCount, repostsCount, likesCount, commentsCount } = fetchActivityCounts;

    if (!activityOpen) {
      totalActivityCountRef.current = totalActivityCountRef.current +
        mentionsCount +
        repostsCount + 
        likesCount + 
        commentsCount
    }

    if (totalActivityCountRef.current > 0 && totalActivityCountRef.current <= 99) {
      return (
        <div
          className='countAlertWrapperDiv'
          key={totalActivityCountRef.current}
        >
          <div>
            <span
              className={
                totalActivityCountRef.current < 10 ? 
                'oneThroughTen' : 
                'elevenThroughNinetyNine'
              }
            >
              {totalActivityCountRef.current}
            </span>
          </div>
        </div>
      )
    } else if (totalActivityCountRef.current > 99) {
      return (
        <div
          className='countAlertWrapperDiv'
          key={totalActivityCountRef.current}
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

const NavUtil = {
  accumulateCounts,
  renderTotalCount
}

export default NavUtil;