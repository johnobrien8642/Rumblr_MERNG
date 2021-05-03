import React from 'react';
import FilterTagInput from './Filter_Tag_Input';
import FilterPostContentInput from './Filter_Post_Content_Input';

const Filtering = ({
  user
}) => {

  return (
    <div>
      <h3>Filtered Tags</h3>
      <FilterTagInput user={user} />
      <h3>Filtered Post Content</h3>
      <FilterPostContentInput user={user} />
    </div>
  )
}

export default Filtering;