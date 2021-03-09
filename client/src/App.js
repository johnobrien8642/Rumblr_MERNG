import React from 'react';
import { gql, useQuery } from '@apollo/client';

const FETCH_USERS = gql`
  {
    users {
      _id
      username
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(FETCH_USERS);

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  return (
    <div className="App">
      <ul>
        {data.users.map((user, i) => (
          <li key={i}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
