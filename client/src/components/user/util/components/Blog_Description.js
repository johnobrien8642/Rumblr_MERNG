import React, { useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import UserSettingsUtil from '../functions/user_settings_util.js'
import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USER_BLOG_DESCRIPTION } = Mutations;
const { blogDescriptionCache } = UserSettingsUtil;

const BlogDescription = ({
  mobile,
  userBlogDescription
}) => {
  let blogDescriptionRef = useRef(userBlogDescription)
  let [active, setActive] = useState(false);
  let [blogDescription, setBlogDescription] = useState(userBlogDescription);
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState(null);

  let [updateUserBlogDescription] = useMutation(UPDATE_USER_BLOG_DESCRIPTION, {
    update(client, { data }) {
      const { updateUserBlogDescription } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      blogDescriptionCache(client, updateUserBlogDescription, currentUser, query)
    },
    onCompleted(data) {
      console.log(data)
      blogDescriptionRef.current = data.updateUserBlogDescription.blogDescription
      resetInputs()
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setBlogDescription(blogDescription = '')
    setPassword(password = '')
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()

            updateUserBlogDescription({
              variables: {
                blogDescription: blogDescription,
                password: password,
                user: Cookies.get('currentUser')
              }
            })
          }}
        >
          <textarea
            type='text'
            value={blogDescription}
            onChange={e => {
              if (blogDescription.length < 150) {
                setBlogDescription(blogDescription = e.target.value)
              }
            }}
          />
          <span>{150 - blogDescription.length} characters left</span>
          
          <p>{errorMessage ? `${errorMessage}` : ''}</p>
          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(password = e.target.value)
            }}
          />
          <div>
            <button
              type='button'
              onClick={() => {
                resetInputs()
                setActive(active = false)
              }}
            >Cancel</button>
            <button
              type='submit'
            >Save</button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <p>{blogDescriptionRef.current}</p>
        <img
          className='editPostBtn'
          src="https://img.icons8.com/windows/32/000000/edit--v1.png"
          alt=''
          onClick={() => {
            setActive(active = true)
          }}
        />
      </div>
    )
  }
}

export default BlogDescription;