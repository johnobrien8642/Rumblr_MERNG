import MentionActivityShow from '../MentionActivityShow';
import RepostActivityShow from '../RepostActivityShow';
import CommentActivityShow from '../CommentActivityShow';
import FollowerActivityShow from '../FollowerActivityShow';
import LikeActivityShow from '../LikeActivityShow';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')


const handleActivity = (activity, navActive, setNavActive, tab) => {

  if (tab === 'all') {
    if (activity.kind === 'Mention') {
      return (
        <MentionActivityShow
          mention={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    } else if (activity.kind === 'Repost') {
      return (   
        <RepostActivityShow 
          repost={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    } else if (activity.kind === 'Comment') {
      return (
        <CommentActivityShow 
          comment={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    } else if (activity.kind === 'Follow') {
      return (
        <FollowerActivityShow 
          follow={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    } else if (activity.kind === 'Like') {
      return (
        <LikeActivityShow 
          like={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    }
  } else if (tab === 'Mention') {
    if (activity.kind === 'Mention') {
      return (
        <MentionActivityShow 
          mention={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    }
  } else if (tab === 'Repost') {
    if (activity.kind === 'Repost') {
      return (
        <RepostActivityShow 
          repost={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    }
  } else if (tab === 'Comment') {
    if (activity.kind === 'Comment') {
      return (
        <CommentActivityShow
          comment={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    }
  } else if (tab === 'Follow') {
    if (activity.kind === 'Follow') {
      return (
        <FollowerActivityShow
          follow={activity}
          navActive={navActive}
          setNavActive={setNavActive}
        />
      )
    }
  }
}

const handleTimeAgo = (activity, timeAgoRef, tab) => {
  var timeAgoString = timeAgo.format(new Date(parseInt(activity.createdAt)))

  if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'all'
    ) {
      timeAgoRef.current.push(timeAgoString)

      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Mention' && activity.kind === 'Mention'
    ) {
      timeAgoRef.current.push(timeAgoString)

      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Repost' && activity.kind === 'Repost'
    ) {
      timeAgoRef.current.push(timeAgoString)
      
      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Comment' && activity.kind === 'Comment'
    ) {
      timeAgoRef.current.push(timeAgoString)
      
      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    }
}

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
        <span className='byLine'>{titleArr.join(' ') + '...'}</span>
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
        <span className='byLine'>{descriptionsArr.join(' ') + '...'}</span>
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

      if (words.length > 10) {
        descriptionsArr = words.slice(0, 10)
      } else {
        descriptionsArr = [...words]
      }

      return (
        <span className='byLine'>{descriptionsArr.join(' ') + '...'}</span>
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
      <span className='byLine'>{quoteArr.join(' ') + '...'}</span>
    )
  }
}

const ActivityUtil = { 
  handleByline,
  handleActivity,
  handleTimeAgo,
}

export default ActivityUtil