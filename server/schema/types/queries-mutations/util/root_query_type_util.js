
const handleFilterTagRegex = (user) => {
  var regexStr
  if (user.filteredTags.length > 1) {
    regexStr = user.filteredTags.join('|')
    return new RegExp(regexStr, 'gm')
  } else if (user.filteredTags.length === 1) {
    return new RegExp(user.filteredTags[0], 'gm')
  }
}

const handleFilterPostContentRegex = (user) => {
  var regexStr
  if (user.filteredPostContent.length > 1) {
    regexStr = user.filteredPostContent.join('|')
    return new RegExp(regexStr, 'gm')
  } else if (user.filteredPostContent.length === 1) {
    return new RegExp(user.filteredPostContent[0], 'gm')
  }
}

const RootQueryTypeUtil = {
  handleFilterTagRegex,
  handleFilterPostContentRegex
}

export default RootQueryTypeUtil;