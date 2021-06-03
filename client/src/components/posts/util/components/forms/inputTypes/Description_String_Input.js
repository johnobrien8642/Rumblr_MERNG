import React from 'react';
import { useApolloClient } from '@apollo/client';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import randomstring from 'randomstring';
import Queries from '../../../../../../graphql/queries.js'
import PostFormUtil from '../../../functions/post_form_util.js'
const { MentionCustomization } = PostFormUtil;
const { FETCH_USERS_FOR_MENTIONS } = Queries;


const DescriptionStringInput = ({
  body, 
  setDescription, 
  description,
  update
}) => {
  const client = useApolloClient();

  const editorConfiguration = {
    extraPlugins: [MentionCustomization],
    placeholder: 'Your text here',
    balloonToolbar: [
      'bold',
      'italic',
      'underline',
      'link',
      'blockQuote',
      'undo',
      'redo'
    ],
    mention: {
      feeds: [
        {
          marker: '@',
          feed: query => {
            return client.query({
              query: FETCH_USERS_FOR_MENTIONS,
              variables: {
                filter: query
              }
            }).then(res => {
              return res.data.fetchUsersForMentions.map(u => ({
                id: '@' + u.blogName,
                actualId: randomstring.generate({
                  length: 12,
                  charset: 'alphabetic'
                })
              }))
            })
          },
          minimumCharacters: 1
        }
      ]
    }
  }

  return (
    <React.Fragment>
      <CKEditor
        editor={ Editor }
        config={
          editorConfiguration 
        }
        onChange={(e, editor) => {
          setDescription(description = editor.getData())
        }}
        onReady={(editor, description) => {
          editor.editing.view.document.on('keydown', (evt, data) => {
            if (data.domEvent.key === 'Enter' && editor.getData()) {
              var textObj = {
                kind: 'text',
                srcType: 'text',
                content: editor.getData(),
                displayIdx: body.current.length,
                uniqId: randomstring.generate({
                  length: 12,
                  charset: 'alphabetic'
                })
              }
              
              body.current.push(textObj)
              editor.setData('<p class="ck-placeholder" data-placeholder="Your text here"><br data-cke-filler="true"></p>')
            }
          })
        }}
      />
    </React.Fragment>
  )
}

export default DescriptionStringInput;