import React, { useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import * as mm from 'music-metadata-browser';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewAudio, removeAudioObj } = PostFormUtil;

const AudioFileInput = ({
  post, update, formId, 
  audioFile, 
  setAudioFile,
  title, 
  setTitle, 
  artist, 
  setArtist, 
  album,
  setAlbum,
  src,
  setSrc,
  audioObj, setAudioObj, 
  active, setActive,
  objsToClean,
  render, setRender
}) => {

  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setTitle(title = post.audioMeta.title)
      //eslint-disable-next-line
      setArtist(artist = post.audioMeta.artist) 
      //eslint-disable-next-line
      setAlbum(album = post.audioMeta.album) 
      //eslint-disable-next-line
      setSrc(src = post.audioFile.url) 
      //eslint-disable-next-line
      setActive(active = true)
    }

    //eslint-disable-next-line
  }, [])

  const renderUpdateFileInput = () => {
    if (update) {
      return (
        <div>
        <h3>Upload audio file</h3>
        <input
          id='audioFileInput'
          type='file'
          accept='.mp3, .mp4, .wav, .aiff'
          onChange={e => {
            previewAudio(
              e, 
              mm, 
              audioFile, 
              setAudioFile,
              title, 
              setTitle, 
              artist,
              setArtist, 
              album,
              setAlbum,
              src,
              setSrc,
              active,
              setActive,
              objsToClean,
              post,
            )

            document.getElementById('audioFileInput').value = ''
          }}
        />
        </div>
      )
    }
  }

  if (active) {
    return (
      <div>
        <button
          type='button'
          disabled={update ? true : false}
          onClick={() =>  {
            removeAudioObj(
              audioObj, audioFile,
              active, setActive
            )
          }}
        >
          X
        </button>
        <p>Title:
          <input 
            type='text'
            value={title}
            onChange={e => {
              setTitle(title = e.target.value)
            }}
          /> 
        </p>
        <p>Artist: 
          <input 
            type='text'
            value={artist}
            onChange={e => {
              setArtist(artist = e.target.value) 
            }}
          />
        </p>
        <p>Album: 
          <input 
            type='text'
            value={album}
            onChange={e => {
              setAlbum(album = e.target.value) 
            }}
          />
        </p>
        <AudioPlayer
          src={src}
        />
        {renderUpdateFileInput()}
      </div>
    )
  } else {
    return(
      <div>
        <h3>Upload audio file</h3>
        <input
          id='audioFileInput'
          type='file'
          accept='.mp3, .mp4, .wav, .aiff'
          onChange={e => {
            previewAudio(
              e, 
              mm, 
              audioFile, 
              setAudioFile,
              title, 
              setTitle, 
              artist,
              setArtist, 
              album,
              setAlbum,
              src,
              setSrc,
              active,
              setActive,
              objsToClean,
              post,
            )

            document.getElementById('audioFileInput').value = ''
          }}
        />
      </div>
    )
  }
}

export default AudioFileInput;