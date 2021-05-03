
const updateCacheUpdateEmail = (
  client, updateUserEmail,
  currentUser, query
) => {
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      user: {
        email: updateUserEmail.email
      }
    }
  })
}


const UserSettingUtil = {
  updateCacheUpdateEmail
}

export default UserSettingUtil;