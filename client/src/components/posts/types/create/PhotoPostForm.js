import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import MatchedTagResults from '../../../tags/Matched_Tag_Results.js';
import Mutations from '../../../../graphql/mutations';
import Queries from '../../../../graphql/queries';
import Cookies from 'js-cookie';
const { CREATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const PhotoPostForm = () => {
  let [mainImageFiles, setMainImageFiles] = useState([]);
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let [description, setDescription] = useState('');
  let mainImages = useRef([]);
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let stringObjs = useRef([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0)
  let main = useRef([]);
  let body = useRef([]);
  let history = useHistory();

  useEffect(() => {
   body.current.forEach((obj, i) => {
     if (obj.kind === 'text') {
      obj.displayIdx = i
     }
   })
  })

  let [createPost] = useMutation(CREATE_POST, {
    update(client, { data }){
    try {
      const { createPost } = data;
        
        var readQuery = client.readQuery({
          query: FETCH_USER_FEED,
          variables: {
            query: Cookies.get('currentUser')
          }
        })
        
        var { fetchUserFeed } = readQuery;
        
        var newPostArr = [createPost, ...fetchUserFeed]
        
        client.writeQuery({
          query: FETCH_USER_FEED,
          variables: {
            query: Cookies.get('currentUser')
          },
          data: {
            fetchUserFeed: newPostArr
          }
        })
    } catch(err) {
      console.log(err)
    }
    },
    onCompleted() {
      resetInputs();
      history.push('/dashboard');
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    setMainImageFiles(mainImageFiles = []);
    setBodyImageFiles(bodyImageFiles = []);
    mainImages.current = [];
    bodyImages.current = [];
    stringObjs.current = [];
    body.current = [];
    main.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  const previewMainImages = (
    e, setMainImageFiles,
    mainImageFiles, 
    setErrMessage,
    errMessage,
    main
  ) => {
    const files = Object.values(e.currentTarget.files)

    if (mainImageFiles.length + 1 > 10) {
      setErrMessage(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    
    const readAndPreview = (file, i) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        var imgObj = {};
        imgObj.src = reader.result
        imgObj.alt = file.name
        imgObj.kind = 'img'
        imgObj.arrPos = i
        file.arrPos = i
        main.current.push(imgObj)
        setMainImageFiles(mainImageFiles = [...mainImageFiles, file])
      }
      reader.readAsDataURL(file);
    }

    if (files) {
      files.forEach((f, i) => {
        readAndPreview(f, i)
      });
    }
  }

  const previewBodyImages = (e) => {
    const files = Object.values(e.currentTarget.files)
    if (bodyImageFiles.length + 1 > 10) {
      setErrMessage(errMessage = 'Only 10 images can be uploaded here')
      return
    }
    
    const readAndPreview = (file, i) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        var imgObj = {};
        imgObj.src = reader.result
        imgObj.alt = file.name
        imgObj.kind = 'img'
        imgObj.arrPos = i
        file.arrPos = i
        body.current.push(imgObj)
        setBodyImageFiles(bodyImageFiles = [...bodyImageFiles, file])
      }
      reader.readAsDataURL(file);
    }

    if (files) {
      files.forEach((f, i) => {
        readAndPreview(f, i)
      });
    } 
  }

  const handleEnterTagInput = (e) => {
    if (e.key === 'Enter' && tag) {
      setTags(tags.concat(`#${tag}`))
      setTag(tag = '')
    }
  }

  const handleClickTagInput = (e, title) => {
    setTags(tags.concat(title))
    setTag(tag = '')
  }

  const removeMainObj = (i, kind) => {
    main.current.splice(i, 1)

    if (kind === 'img') {
      setMainImageFiles(mainImageFiles.splice(i, 1))
    }
  }

  const removeBodyObj = (i, kind) => {
    body.current.splice(i, 1)

    if (kind === 'img') {
      setBodyImageFiles(bodyImageFiles.splice(i, 1))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var mainImagesFormData = new FormData();
    var bodyImagesFormData = new FormData();

    for (var i = 0; i < mainImageFiles.length; i++) {
      var file = mainImageFiles[i];
      mainImagesFormData.append('photos', file);
    }

    for (var i2 = 0; i2 < bodyImageFiles.length; i2++) {
      var file2 = bodyImageFiles[i2];
      bodyImagesFormData.append('photos', file2);
    }

    function mainPost() {
      return axios.post('/api/posts/', mainImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(mainRes => {
        let mainImgObj = mainRes.data;
        return mainImgObj
      })
    }

    function bodyPost() {
      return axios.post('/api/posts/', bodyImagesFormData, {
        headers: {
          'Content-Type': 'undefined'
        }
      }).then(bodyRes => {
        let bodyImgObj = bodyRes.data;
        return bodyImgObj
      })
    }

    Promise.all([mainPost(), bodyPost()]).then(
      ([mainObjs, bodyObjs]) => {
        let cleanedMain = mainObjs.map((obj) => {
          delete obj.__v
          return obj
        })

        let cleanedBody = bodyObjs.map((obj) => {
          delete obj.__v
          return obj
        })

        var instanceData = {};
        instanceData.mainImages = cleanedMain;
        instanceData.descriptions = body.current.filter(obj => {
          if (obj.kind === 'img') {
            return false
          } else if (obj.kind === 'text') {
            return true
          }
        });
        instanceData.descriptionImages = cleanedBody;
        instanceData.tags = tags;
        instanceData.user = Cookies.get('currentUser');
        instanceData.kind = 'PhotoPost';
        
        createPost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }

  console.log(main.current)

  const drag = (e, i, obj) => {
    e.dataTransfer.setData('oldIndex', i)
    e.dataTransfer.setData('obj', obj)
  }

  const onDrop = (e, i, location) => {
    e.preventDefault();
    var oldIdx = e.dataTransfer.getData('oldIndex')
    var obj = e.dataTransfer.getData('obj')
    var parsedObj = JSON.parse(obj)
    console.log(oldIdx)
    console.log(parsedObj)
    if (location === 'main') {
      if (parsedObj.kind === 'img') {
        main.current.splice(oldIdx, 1)
        main.current.splice(i, 0, parsedObj)
        var sorted = false
        var sortedArr = [...mainImageFiles];
  
        while(!sorted) {
  
          main.current.forEach((obj, i) => {
            if (obj.kind === 'text') {
              obj.displayIdx = i
            }
            mainImageFiles.forEach((obj2, i2) => {
              if (obj.arrPos !== obj2.arrPos) {
                var plucked = sortedArr.splice(i2, 1)
                sortedArr.push(plucked[0])
                sorted = true
              }
            })
          })
        }
        setMainImageFiles(mainImageFiles = [...sortedArr])
      } else if (parsedObj.kind === 'text') {
        main.current.splice(oldIdx, 1)
        main.current.splice(i, 0, parsedObj)
  
        setRender(render + 1)
      }
    } else if (location === 'body') {
  
      if (parsedObj.kind === 'img') {
        body.current.splice(oldIdx, 1)
        body.current.splice(i, 0, parsedObj)
        var sorted = false
        var sortedArr = [...bodyImageFiles];
  
        while(!sorted) {
  
          body.current.forEach((obj, i) => {
            if (obj.kind === 'text') {
              obj.displayIdx = i
            }
            bodyImageFiles.forEach((obj2, i2) => {
              if (obj.arrPos !== obj2.arrPos) {
                var plucked = sortedArr.splice(i2, 1)
                sortedArr.push(plucked[0])
                sorted = true
              }
            })
          })
        }
        setBodyImageFiles(bodyImageFiles = [...sortedArr])
      } else if (parsedObj.kind === 'text') {
        body.current.splice(oldIdx, 1)
        body.current.splice(i, 0, parsedObj)
  
        setRender(render + 1)
      }
    }
  }
  
  const allowDrop = (e) => {
    e.preventDefault();
  }

  return (
    <div
      className='postForm'
    >
      <form
        id='photoPostForm'
        onSubmit={e => handleSubmit(e)}
        onKeyPress={e => { e.key === 'Enter' && e.preventDefault(); }}
        encType={'multipart/form-data'}
      >

        <div
          className={'mainPreview'}
        >
          {main.current.map((obj, i) => {
            if (obj.kind === 'img') {
              return (
                <div
                  key={i}
                  onDrop={e => onDrop(e, i, 'main')}
                  onDragOver={e => allowDrop(e)}
                >
                  <div
                    draggable='true'
                    onDragStart={e => drag(e, i, JSON.stringify(obj))}
                    className='draggable'
                  >
                    <button 
                      type='button' 
                      onClick={() => removeMainObj(i, obj.kind)}
                    >
                      X
                    </button>
                    <img src={obj.src} alt={obj.alt} />

                  </div>
                </div>
              )
            } else if (obj.kind === 'text') {
              return (
                <div
                  key={i}
                  onDrop={e => onDrop(e, i, 'main')}
                  onDragOver={e => allowDrop(e)}
                >
                  <div
                    draggable='true'
                    onDragStart={e => drag(e, i, JSON.stringify(obj))}
                    onDrop={e => onDrop(e, i, obj.kind)}
                    onDragOver={e => allowDrop(e)}
                    className='draggable'
                  >
                    <button 
                      type='button' 
                      onClick={() => removeMainObj(i, obj.kind)}
                    >
                      X
                    </button>
                    <p>{obj.content}</p>
                  </div>
                </div>
              )
            }
          })}

          <h2>Main Images</h2>
          <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewMainImages(e)
              document.getElementById('photoPostForm').reset()
            }}
          />
        </div>

        <div
          className={'bodyPreview'}
        >
          {body.current.map((obj, i) => {
            if (obj.kind === 'img') {
              return (
                <div
                  key={i}
                  onDrop={e => onDrop(e, i, 'body')}
                  onDragOver={e => allowDrop(e)}
                >
                  <div
                    draggable='true'
                    onDragStart={e => drag(e, i, JSON.stringify(obj))}
                    className='draggable'
                  >
                    <button 
                      type='button' 
                      onClick={() => removeBodyObj(i, obj.kind)}
                    >
                      X
                    </button>
                    <img src={obj.src} alt={obj.alt} />

                  </div>
                </div>
              )
            } else if (obj.kind === 'text') {
              return (
                <div
                  key={i}
                  onDrop={e => onDrop(e, i, 'body')}
                  onDragOver={e => allowDrop(e)}
                >
                  <div
                    draggable='true'
                    onDragStart={e => drag(e, i, JSON.stringify(obj))}
                    onDrop={e => onDrop(e, i, obj.kind)}
                    onDragOver={e => allowDrop(e)}
                    className='draggable'
                  >
                    <button 
                      type='button' 
                      onClick={() => removeBodyObj(i, obj.kind)}
                    >
                      X
                    </button>
                    <p>{obj.content}</p>
                  </div>
                </div>
              )
            }
          })}
          <div>
            <h2>Body Images</h2>
            <p>{errMessage}</p>
            <input
              type='file'
              multiple
              name='image'
              accept='.png, .jpg, jpeg'
              onChange={e => {
                previewBodyImages(e)
                document.getElementById('photoPostForm').reset()
              }}
            />
          </div>

        <textarea
          value={description}
          placeholder='Write a description...'
          onChange={e => setDescription(description = e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && description !== '') {
              var textObj = {
                kind: 'text',
                content: description, 
                displayIdx: body.current.length
              }
              body.current.push(textObj)
              setDescription(description = '')
            }
          }}
        ></textarea>
      </div>
      
        <div>
          {tags.map((tag, i) => {
            return (
              <div key={i}>
                {tag}
              </div>
            )
          })}

          <input
            type='text'
            value={tag}
            placeholder='#tags'
            onChange={e => setTag(tag = e.target.value)}
            onKeyDown={e => handleEnterTagInput(e)}
          />

          <div>
            <MatchedTagResults 
              query={tag} 
              handleClickTagInput={handleClickTagInput}
            />
          </div>
        </div>
        <button
          type='submit'
          disabled={
            mainImageFiles.length === 0 && 
            bodyImageFiles.length === 0
          }
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default PhotoPostForm;