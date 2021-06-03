const accumulateCounts = (
  data1,
  totalCountRef
) => {
  if (data1) {
    totalCountRef.current =
    totalCountRef.current +
    data1.mentionsCount +
    data1.repostsCount +
    data1.commentsCount
  }
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

const NavUtil = {
  accumulateCounts,
  renderTotalCount
}

export default NavUtil;