import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Queries from '../../graphql/queries';
import UserResult from './resultTypes/User_Result';
import TagResult from './resultTypes/Tag_Result';

const { SEARCH_USERS_AND_TAGS } = Queries;

const Results = ({ input, active }) => {

  let { loading, error, data } = useQuery(SEARCH_USERS_AND_TAGS,
      { variables: {
        filter: { OR: [
            {blogName_contains: input },
            {tag_title_contains: input }
          ]
        }
      }
    }
  );
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;
  
  const { usersAndTags } = data;

  if (active) {
    return (
      <div>
        <ul>
          {usersAndTags.map((res, i) => {
            switch(res.__typename) {
              case 'UserType':
                console.log(res)
                return(
                  <li key={res._id}><UserResult user={res} /></li>
                )
              case 'TagType':
                return(
                  <li key={res._id}><TagResult tag={res} /></li>
                )
              default:
                return (
                  <li></li>
                )
              }
          })}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }

}

export default Results;