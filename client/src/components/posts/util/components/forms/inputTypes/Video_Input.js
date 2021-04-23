import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewVideoFile, previewVideoLink, 
        removeVideoObj } = PostFormUtil;

const VideoInput = ({
  formId, 
  post,
  update,
  videoFile,
  setVideoFile,
  videoObj, setVideoObj,
  objsToClean,
  active, setActive,
  isLink, setIsLink
}) => {

  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setVideoObj(videoObj = post.videoLink.url)
      //eslint-disable-next-line
      setActive(active = true)
    }
  }, [])

  const renderUpdateFileInput = () => {
    if (update) {
      return (
        <div>
          <h3>Upload video file</h3>
          <input
            id='videoFileInput'
            type='file'
            accept='.MOV, .mp3, .wav'
            onChange={e => {
              previewVideoFile(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active, 
                setActive,
                objsToClean
              )

              document.getElementById('videoFileInput').value = ''
            }}
          />
          <h3>Upload video link</h3>
          <textarea
            onChange={e => {
              previewVideoLink(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active, 
                setActive,
                objsToClean
              )

              setIsLink(isLink = true)
            }}
          ></textarea>
        </div>
      )
    }
  }

  if (active) {
    return (
      <div>
        <button
          type='button'
          onClick={() => removeVideoObj(
            post,
            videoObj,
            setVideoObj,
            videoFile,
            setVideoFile,
            active,
            setActive,
            isLink,
            setIsLink,
            objsToClean
          )}
        >
          X
        </button>
        <ReactPlayer
          url={videoObj}
          controls
        />
        
        {renderUpdateFileInput()}
      </div>
    )
  } else {
    return(
      <div>
        <h3>Upload video file</h3>
        <input
          id='videoFileInput'
          type='file'
          accept='.MOV, .mp3, .wav'
          onChange={e => {
            previewVideoFile(
              e,
              post,
              videoObj,
              setVideoObj,
              videoFile,
              setVideoFile,
              active, 
              setActive,
              objsToClean
            )

            document.getElementById('videoFileInput').value = ''
          }}
        />
        <h3>Upload video link</h3>
        <textarea
          onChange={e => {
            previewVideoLink(
              e,
              post,
              videoObj,
              setVideoObj,
              videoFile,
              setVideoFile,
              active,
              setActive,
              objsToClean
            )

            setIsLink(isLink = true)
          }}
        ></textarea>
      </div>
    )
  }
}

export default VideoInput;