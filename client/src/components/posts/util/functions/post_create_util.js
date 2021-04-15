//preview files
/* eslint-disable no-loop-func */
import axios from 'axios';
import Validator from 'validator';

const previewMainImages = (
  e, main,
  mainImageFiles, 
  setMainImageFiles,
  setErrMessage,
  errMessage,
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

const previewBodyImages = (
    e, body, bodyImageFiles,
    setBodyImageFiles,
    setErrMessage, errMessage,
  ) => {

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

const previewAudio = (
  e, mm, audioObj, 
  audioFile, 
  active, setActive
) => {
  const file = e.currentTarget.files[0]

  var reader = new FileReader();

  reader.onloadend = () => {
    // console.log(file)
    mm.parseBlob(file).then(meta => {
      const { common } = meta;
      audioObj.current.src = reader.result
      audioObj.current.album = common.album || ''
      audioObj.current.artist = common.artist || ''
      audioObj.current.title = common.title || ''
      audioObj.current.kind = 'audioObj'
      audioFile.current = file
      setActive(active = true)
    })
  }

  reader.readAsDataURL(file)
}

const previewVideoFile = (
  e, videoObj, 
  videoFile,
  active, setActive
) => {
  const file = e.currentTarget.files[0]
  const videoPath = URL.createObjectURL(file)

  videoFile.current = file
  videoObj.current = videoPath
  setActive(active = true)
}

const previewVideoLink = (
  e, videoObj,
  active, setActive
) => {
  if (Validator.isURL(e.target.value)) {
    var matched = new RegExp(/youtube|vimeo|twitch|dailymotion/)

    if (matched) {
      videoObj.current = e.target.value
      setActive(active = true)
    }
  }
}

//remove objs

const removeMainObj = (
    i, kind, main, 
    setMainImageFiles, 
    mainImageFiles
  ) => {
    main.current.splice(i, 1)

  if (mainImageFiles.length === 1) {

    setMainImageFiles(mainImageFiles = [])

  } else {

    setMainImageFiles(mainImageFiles.splice(i, 1))

  }
}

const removeBodyObj = (
    i, kind, body, 
    setBodyImageFiles, 
    bodyImageFiles
  ) => {
  body.current.splice(i, 1)

  if (kind === 'img' && bodyImageFiles.length === 1) {

    setBodyImageFiles(bodyImageFiles = [])

  } else {

    setBodyImageFiles(bodyImageFiles.splice(i, 1))

  }
}

const removeLinkSiteNameAndImage = (
  siteName, setSitename,
  imageUrl, setImageUrl,
  showNameAndUrl,
  setShowNameAndUrl,
) => {
  setSitename(siteName = '')
  setImageUrl(imageUrl = '')
  setShowNameAndUrl(showNameAndUrl = false)
}

const removeLinkTitleAndDesc = (
  title, setTitle, 
  setLinkDescription, 
  linkDescription,
  showTitleAndLinkDescription,
  setShowTitleAndLinkDescription,
) => {
  setTitle(title = '')
  setLinkDescription(linkDescription = '')
  setShowTitleAndLinkDescription(showTitleAndLinkDescription = false)
}

const removeAudioObj = (
  audioObj, audioFile,
  active, setActive
) => {
  audioObj.current = {}
  audioFile.current = {}
  setActive(active = false)
}

const removeVideoObj = (
  videoObj, videoFile,
  active, setActive
) => {
  videoObj.current = {}
  videoFile.current = {}
  setActive(active = false)
}

//handle tags

const handleTagInput = (
    tag, setTag,
    tags, setTags
  ) => {
  //eslint-disable-next-line
  var trimmedTag = tag.trim()
    
  var noSingleHash = new RegExp(/^#$/, 'g')
  var validText = trimmedTag.match(noSingleHash)
  
  if (!validText) {
    //eslint-disable-next-line
    var matchText = new RegExp(/[\w+\s+.,!@$%&*()_+=?<>;:-]*/, 'g')
    var cleanedText = tag.match(matchText)
    if (cleanedText) {
      var cleanedArr = cleanedText.filter(str => str !== '')
      cleanedArr[0].trim()
      setTags(tags.concat(`#${cleanedArr[0]}`))
      setTag(tag = '')
    }
  } else {
    setTag(tag = '')
  }
}

const handleFoundTag = (
    title, setTags, 
    tags, setTag, 
    tag
  ) => {
  setTags(tags.concat(title))
  setTag(tag = '')
}

//drag and drop

const drag = (e, i, obj) => {
  e.dataTransfer.setData('oldIndex', i)
  e.dataTransfer.setData('obj', obj)
}

const onDropBody = (
  e, i, body, bodyImageFiles
) => {
  let oldIdx = e.dataTransfer.getData('oldIndex')
  let obj = e.dataTransfer.getData('obj')
  let parsedObj = JSON.parse(obj)
  
  if (parsedObj.kind === 'img') {

    body.current.splice(oldIdx, 1)
    body.current.splice(i, 0, parsedObj)

    let sortedArrBody = [];
    let filteredBody = body.current.filter(obj => obj.kind === 'img');

    bodyImageFiles.forEach((file) => {
      filteredBody.forEach((obj, i) => {
        if (file.arrPos === obj.arrPos) {
          sortedArrBody.splice(i, 0, file)
        }
      })
    })
    
    return sortedArrBody

  } else if (parsedObj.kind === 'text') {
    body.current.splice(oldIdx, 1)
    body.current.splice(i, 0, parsedObj)
    
    return [...bodyImageFiles]
  }
}

const onDropMain = (
  e, i, main,
  mainImageFiles,
) => {
  var oldIdx = e.dataTransfer.getData('oldIndex')
  var obj = e.dataTransfer.getData('obj')
  var parsedObj = JSON.parse(obj)

  if (parsedObj.kind === 'img') {

    main.current.splice(oldIdx, 1)
    main.current.splice(i, 0, parsedObj)
  
    let sortedArrMain = [];
    let filteredMain = main.current.filter(obj => obj.kind === 'img');
    
    mainImageFiles.forEach((file) => {
      filteredMain.forEach((obj, i) => {
        if (file.arrPos === obj.arrPos) {
          sortedArrMain.splice(i, 0, file)
        }
      })
    })

    return sortedArrMain

  }
}

const allowDrop = (e) => {
  e.preventDefault();
}

//async link preview

const fetchUrlMetadata = (link) => {
  return axios.post('/api/posts/metadata', {
    params: {
      url: link
    }
  })
}

//async file upload

const mainPost = (
  mainImagesFormData
) => {
  return axios.post('/api/posts/images', mainImagesFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(mainRes => {
    let mainImgObj = mainRes.data;
    return mainImgObj
  })
}

const bodyPost = (
  bodyImagesFormData
) => {
  return axios.post('/api/posts/images', bodyImagesFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(bodyRes => {
    let bodyImgObj = bodyRes.data;
    return bodyImgObj
  })
}

const audioPost = (
  audioFileFormData
) => {
  return axios.post('/api/posts/audio', audioFileFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(audioRes => {
    let audioObj = audioRes.data
    return audioObj
  })
}

const videoPost = (
  videoFileFormData,
  videoObj
) => {
  if (videoObj.current) {
    return axios.post('/api/posts/video', {
      params: {
        url: videoObj.current
      }
    }).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  } else {
    return axios.post('/api/posts/video', videoFileFormData, {
      headers: {
        'Content-Type': 'undefined'
      }
    }).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  }
}

//apollo cache

const updateCacheCreate = (
  client, createPost,
  currentUser, query
) => {
  var readQuery = client.readQuery({
    query: query,
    variables: {
      query: currentUser
    }
  })
  
  var { fetchUserFeed } = readQuery;
  
  var newPostArr = [createPost, ...fetchUserFeed]
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      fetchUserFeed: newPostArr
    }
  })
}

const updateCacheDelete = (
  client, deletePost,
  currentUser, query
) => {
  var readFeed = client.readQuery({
    query: query,
    variables: {
      query: currentUser
    }
  })

  var { fetchUserFeed } = readFeed;

  var newPostArr = fetchUserFeed.filter(post => {
      if (post._id !== deletePost._id) {
        return false
      } else {
        return true
      }
    }
  )

  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      fetchUserFeed: newPostArr
    }
  })
}

const PostCreateUtil = { 
  previewMainImages, previewBodyImages, 
  previewAudio, previewVideoFile, 
  previewVideoLink, removeMainObj,
  removeBodyObj, removeAudioObj,
  removeVideoObj, handleTagInput, handleFoundTag, 
  drag, onDropBody, onDropMain, allowDrop, 
  removeLinkSiteNameAndImage,
  removeLinkTitleAndDesc,
  fetchUrlMetadata, mainPost, bodyPost,
  audioPost, videoPost, updateCacheCreate,
  updateCacheDelete
};

export default PostCreateUtil;