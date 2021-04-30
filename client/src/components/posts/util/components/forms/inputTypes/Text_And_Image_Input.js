import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useApolloClient } from '@apollo/client';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Queries from '../../../../../../graphql/queries.js';
const { FETCH_USERS_FOR_MENTIONS } = Queries;

const TextAndImageInput = ({
  post, textAndImage, setTextAndImage
}) => {
  const client = useApolloClient();
  
  useEffect(() => {
    var button = document.querySelector('.ck-block-toolbar-button .ck-button__icon')
    button.innerHTML = ''

    var paste = document.addEventListener('paste', function(event) {
      if (!event.data.dataValue) {
        event.cancel()
      }
    })
  })

  const editorConfiguration = {
    placeholder: 'Write a description...',
    blockToolbar: [
      'imageInsert',
      'mediaEmbed',
    ],
    balloonToolbar: [
      'bold',
      'italic',
      'underline',
      'link',
      'imageStyle',
      'imageToolbar'
    ]
  }

  return (
    <React.Fragment>
      <CKEditor
        editor={ Editor }
        config={ editorConfiguration }
        data={post ? post.body : ''}
        onChange={(e, editor) => {
          setTextAndImage(textAndImage = editor.getData())
        }}
      />
    </React.Fragment>
  )
}

export default TextAndImageInput;