import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import UserResult from './types/User_Result';
import TagResult from './types/Tag_Result';

const { SEARCH_USERS_AND_TAGS } = Queries;

const Results = ({ input }) => {
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

  return (
    <div>
      <ul>
        {data.usersAndTags.map((res, i) => {
          console.log(res)
          switch(res.__typename) {
            case 'UserType':
              return(
                <li key={res._id}><UserResult user={res} /></li>
              )
              case 'TagType':
              return(
                <li key={res._id}><TagResult tag={res} /></li>
              )
            }
        })}
      </ul>
    </div>
  )
}

export default Results;