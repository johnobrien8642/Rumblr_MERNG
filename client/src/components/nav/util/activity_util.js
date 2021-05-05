import MentionActivityShow from '../MentionActivityShow'
import RepostActivityShow from '../RepostActivityShow'
import CommentActivityShow from '../CommentActivityShow'
import FollowerActivityShow from '../FollowerActivityShow'


const handleActivity = (activity, navActive, setNavActive, tab) => {

  if (tab === 'all') {
    if (activity.kind === 'Mention') {
      return (
        <div>
          <MentionActivityShow 
            mention={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    } else if (activity.kind === 'Repost') {
      return (
        <div>
          <RepostActivityShow 
            repost={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    } else if (activity.kind === 'Comment') {
      return (
        <div>
          <CommentActivityShow 
            comment={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    } else if (activity.kind === 'Follow') {
      return (
        <div>
          <FollowerActivityShow 
            follow={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    }
  } else if (tab === 'Mention') {
    if (activity.kind === 'Mention') {
      return (
        <div>
          <MentionActivityShow 
            mention={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    }
  } else if (tab === 'Repost') {
    if (activity.kind === 'Repost') {
      return (
        <div>
          <RepostActivityShow 
            repost={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    }
  } else if (tab === 'Comment') {
    if (activity.kind === 'Comment') {
      return (
        <div>
          <CommentActivityShow
            comment={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    }
  } else if (tab === 'Follow') {
    if (activity.kind === 'Follow') {
      return (
        <div>
          <FollowerActivityShow
            follow={activity}
            navActive={navActive}
            setNavActive={setNavActive}
          />
        </div>
      )
    }
  }
}

const ActivityUtil = { 
  handleActivity 
}

export default ActivityUtil