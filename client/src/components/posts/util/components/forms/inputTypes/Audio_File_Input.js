import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import * as mm from 'music-metadata-browser';
import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewAudio, removeAudioObj } = PostCreateUtil;

const AudioFileInput = ({
  formId, audioFile, 
  audioObj, active, setActive
}) => {

  if (active) {
    return (
      <div>
        <button
          type='button'
          onClick={() => removeAudioObj(
            audioObj, audioFile,
            active, setActive
          )}
        >
          X
        </button>
        <p>Title: {audioObj.current.title}</p>
        <p>Artist: {audioObj.current.artist}</p>
        <p>Album: {audioObj.current.album}</p>
        <AudioPlayer
          src={audioObj.current.src}
        />
      </div>
    )
  } else {
    return(
      <div>
        <h3>Upload audio file</h3>
        <input
          type='file'
          accept='.mp3, .mp4, .wav, .aiff'
          onChange={e => {
            previewAudio(
              e, mm, audioObj,
              audioFile, active,
              setActive
            )
            document.getElementById(`${formId}`).reset()
          }}
        />
      </div>
    )
  }
}

export default AudioFileInput;