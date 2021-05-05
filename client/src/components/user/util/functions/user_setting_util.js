
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


const blogDescriptionCache = (
  client, updateUserBlogDescription,
  currentUser, query
) => {
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      user: {
        blogDescription: updateUserBlogDescription.blogDescription
      }
    }
  })
}

const UserSettingUtil = {
  updateCacheUpdateEmail,
  blogDescriptionCache
}

export default UserSettingUtil;