import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import PhotoPostForm from '../posts/types/create/PhotoPostForm'
import TextPostForm from '../posts/types/create/TextPostForm'
import QuotePostForm from '../posts/types/create/QuotePostForm'
import LinkPostForm from '../posts/types/create/LinkPostForm'
import ChatPostForm from '../posts/types/create/ChatPostForm'
import AudioPostForm from '../posts/types/create/AudioPostForm'
import VideoPostForm from '../posts/types/create/VideoPostForm'

const PostsNav = ({ 
  props,
  mobile
}) => {
  let [open, setOpen] = useState(false);
  let history = useHistory();
  
  useEffect(() => {
    var el = document.querySelector('.mobilePostsNav.open')

    if (el) {
      el.focus()
    }
  })

  if (mobile) {
    setTimeout(() => {
      setOpen(open = true)
    }, 100)
  }

  const handleMobilePostsNavModalClass = (mobile, open) => {
    if (mobile && !open) {
      return 'mobilePostsNavModal'
    } else if (mobile && open) {
      return 'mobilePostsNavModal open'
    }
  }
  
  const handleMobilePostsNavClass = (mobile, open) => {
    if (mobile && !open) {
      return 'mobilePostsNav'
    } else if (mobile && open) {
      return 'mobilePostsNav open'
    } else {
      return 'postsNav'
    }
  }

  return (
    <div
      className={handleMobilePostsNavModalClass(mobile, open)}
    >
    <div
      className={handleMobilePostsNavClass(mobile, open)}
      tabIndex={-1}
      onBlur={() => {
        if (mobile) {
          Promise.all([
            setOpen(open = false)
          ]).then(() => {
            setTimeout(() => {
              history.push('/dashboard')
            }, 100)
          })
        }
      }}
    >
      <Link
        className='text'
        to={`/dashboard/new/text`}
      > 
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/ios-filled/64/000000/sentence-case.png"
            alt=''
          />
          <span>Text</span>
        </div>
      </Link>

      <Link
        className='photo'
        to={`/dashboard/new/photo`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/ios-glyphs/64/000000/camera.png"
            alt=''
          />
          <span>Photo</span>
        </div>
      </Link>

      <Link
        className='quote'
        to={`/dashboard/new/quote`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/fluent-systems-filled/64/000000/quote-left.png"
            alt=''
          />
          <span>Quote</span>
        </div>
      </Link>

      <Link
        className='link'
        to={`/dashboard/new/link`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/metro/64/000000/link.png"
            alt=''
          />
          <span>Link</span>
        </div>
      </Link>

      <Link
        className='chat'
        to={`/dashboard/new/chat`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/fluent-systems-filled/64/000000/speech-bubble-with-dots.png"
            alt=''
          />
          <span>Chat</span>
        </div>
      </Link>

      <Link
        className='audio'
        to={`/dashboard/new/audio`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/fluent-systems-filled/64/000000/headphones.png"
            alt=''
          />
          <span>Audio</span>
        </div>
      </Link>
      
      <Link
        className='video'
        to={`/dashboard/new/video`}
      >
        <div>
          <img
            className='postIcon'
            src="https://img.icons8.com/material-rounded/64/000000/camcorder-pro.png"
            alt=''
          />
          <span>Video</span>
        </div>
      </Link>

      <Switch>
        <Route 
          exact path={`${props.match.path}/new/text`} 
          component={TextPostForm} 
        />
        <Route 
          exact path={`${props.match.path}/new/photo`} 
          component={PhotoPostForm} 
        />
        <Route 
          exact path={`${props.match.path}/new/quote`} 
          component={QuotePostForm} 
        />
        <Route 
          exact path={`${props.match.path}/new/link`} 
          component={LinkPostForm} 
        />
        <Route 
          exact path={`${props.match.path}/new/chat`} 
          component={ChatPostForm} 
        />
        <Route
          exact path={`${props.match.path}/new/audio`} 
          component={AudioPostForm}
        />
        <Route 
          exact path={`${props.match.path}/new/video`} 
          component={VideoPostForm}
        />
      </Switch>
    </div>
    </div>
  )
}

export default PostsNav;