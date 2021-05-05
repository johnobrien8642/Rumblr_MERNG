import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const InfiniteScroll = ({
  fetchMoreDiv,
  type
  // setQuery
}) => {
  let pastHistory = useRef(null)
  let history = useHistory();
    
  useEffect(() => {
    fetchMoreDiv.current = document.querySelector(type)
    
    if (history !== pastHistory.current) {
      // setQuery()
      pastHistory.current = history
    }

  })

  return (
    <React.Fragment />
  )
}

export default InfiniteScroll;