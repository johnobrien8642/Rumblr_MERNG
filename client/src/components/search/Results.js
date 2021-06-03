import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries';
import UserResult from './resultTypes/User_Result';
import TagResult from './resultTypes/Tag_Result';

const { SEARCH_USERS_AND_TAGS } = Queries;

const Results = ({
  user,
  input, 
  active, 
  setActive 
}) => {
  
  let { loading, error, data } = useQuery(SEARCH_USERS_AND_TAGS,
      { variables: {
        filter: { OR: [
            { blogName_contains: input },
            { tag_title_contains: input }
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
      <ul
        className='results'
        tabIndex='0'
      >
        {usersAndTags.map((res, i) => {
          switch(res.__typename) {
            case 'UserType':
              return(
                <li 
                  key={res._id}
                >
                  <UserResult
                    currentUser={user}
                    user={res}
                    active={active}
                    setActive={setActive}
                  />
                </li>
              )
            case 'TagType':
              return(
                <li 
                  key={res._id}
                >
                  <TagResult
                    currentUser={user}
                    tag={res}
                    active={active}
                    setActive={setActive}
                  />
                </li>
              )
            default:
              return (
                <li></li>
              )
            }
        })}
      </ul>
    )
  } else {
    return (
      <div>
      </div>
    )
  }

}

export default Results;