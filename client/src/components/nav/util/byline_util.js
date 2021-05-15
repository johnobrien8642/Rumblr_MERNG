const handleByline = (activity) => {
  var post
  if (activity.kind === 'Repost') {
    post = activity.post
  } else {
    post = activity
  }

  var words, descriptionsArr = [], allDescriptions
  
  if (post.kind === 'TextPost') {
    if (post.title) {
      words = post.title.split(' ')
      var titleArr = []
      if (words.length > 10) {
        titleArr = words.slice(0, 10)
      } else {
        titleArr = [...words]
      }
      
      return (
        <span className='byLine'>"{titleArr.join(' ') + '...'}"</span>
      )
    } else if (post.descriptions) {
      allDescriptions = post.descriptions.map(d => d.content).join(' ')
      words = allDescriptions.split(' ')
      descriptionsArr = []
      if (words.length > 10) {
        descriptionsArr = words.slice(0, 10)
      } else {
        descriptionsArr = [...words]
      }
      return (
        <span className='byLine'>"{descriptionsArr.join(' ') + '...'}"</span>
      )
    } else {
      return (
        <span></span>
      )
    }
  } else if (
    post.kind === 'PhotoPost' ||
    post.kind === 'LinkPost' ||
    post.kind === 'AudioPost' ||
    post.kind === 'VideoPost'
  ) {
    if (post.descriptions) {
      allDescriptions = post.descriptions.map(d => d.content).join(' ')
      words = allDescriptions.split(' ')
      descriptionsArr = []

      if (words.length > 10) {
        descriptionsArr = words.slice(0, 10)
      } else {
        descriptionsArr = [...words]
      }

      return (
        <span className='byLine'>"{descriptionsArr.join(' ') + '...'}"</span>
      )
    } else {
      return (
        <span></span>
      )
    }
  } else if (post.kind === 'QuotePost') {
    words = post.quote.split(' ')
    var quoteArr = []

    if (words.length > 10) {
      quoteArr = words.slice(0, 10)
    } else {
      quoteArr = [...words]
    }

    return (
      <span className='byLine'>"{quoteArr.join(' ') + '...'}"</span>
    )
  }
}

const BylineUtil = {
  handleByline
}

export default BylineUtil;