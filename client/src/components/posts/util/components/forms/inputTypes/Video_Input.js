import React from 'react';
import ReactPlayer from 'react-player';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewVideoFile, previewVideoLink, 
        removeVideoObj } = PostCreateUtil;

const VideoInput = ({
  formId, videoFile, 
  videoObj, active, setActive
}) => {
  if (active) {
    return (
      <div>
        <button
          type='button'
          onClick={() => removeVideoObj(
            videoObj, videoFile,
            active, setActive
          )}
        >
          X
        </button>
        <ReactPlayer
          url={videoObj.current}
          controls
        />
      </div>
    )
  } else {
    return(
      <div>
        <h3>Upload video file</h3>
        <input
          type='file'
          accept='.MOV, .mp3, .wav'
          onChange={e => {
            previewVideoFile(
              e, videoObj,
              videoFile, active,
              setActive
            )
            document.getElementById(`${formId}`).reset()
          }}
        />
        <h3>Upload video link</h3>
        <textarea
          onChange={e => {
            previewVideoLink(
              e, videoObj,
              active, setActive
            )
          }}
        ></textarea>
      </div>
    )
  }
}

export default VideoInput;