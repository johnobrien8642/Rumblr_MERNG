import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import PhotoPostForm from '../posts/types/create/PhotoPostForm'
import TextPostForm from '../posts/types/create/TextPostForm'
import QuotePostForm from '../posts/types/create/QuotePostForm'
import LinkPostForm from '../posts/types/create/LinkPostForm'
import ChatPostForm from '../posts/types/create/ChatPostForm'
import AudioPostForm from '../posts/types/create/AudioPostForm'
import VideoPostForm from '../posts/types/create/VideoPostForm'

const PostNav = ({ props }) => {
  return(
    <div
      className='postsNav'
    >
      <Link
        to={`/dashboard/new/text`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/ios-filled/50/000000/sentence-case.png"
            alt=''
          />
          Text
        </div>
      </Link>

      <Link
        to={`/dashboard/new/photo`}
      >
        <div
          className='postIcon'
        >
          <img
            className='postIcon'
            src="https://img.icons8.com/fluent/48/000000/camera.png"
            alt=''
          />
          Photo
        </div>
      </Link>

      <Link
        to={`/dashboard/new/quote`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/fluent/48/000000/quote-left.png"
            alt=''
          />
          Quote
        </div>
      </Link>

      <Link
        to={`/dashboard/new/link`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/flat-round/64/000000/link--v1.png"
            alt=''
          />
          Link
        </div>
      </Link>

      <Link
        to={`/dashboard/new/chat`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/fluent/48/000000/speech-bubble-with-dots.png"
            alt=''
          />
          Chat
        </div>
      </Link>

      <Link
        to={`/dashboard/new/audio`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/nolan/64/headphones.png"
            alt=''
          />
          Audio
        </div>
      </Link>
      
      <Link
        to={`/dashboard/new/video`}
      >
        <div
          className='postIcon'
        >
          <img
            src="https://img.icons8.com/nolan/64/camcorder-pro.png"
            alt=''
          />
          Video
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
  )
}

export default PostNav;