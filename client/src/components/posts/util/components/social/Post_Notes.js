import React from 'react';
import { Link } from 'react-router-dom';

const PostNotes = ({
  notes
}) => {

  return (
    <ul>
      {notes.map((n, i) => {
        var note = n.kind === 'Repost' ? 'Repost' : 'Like'
        return (
          <li
            key={n._id}
          >
            <span>{note}</span>
            <Link
              to={`/view/blog/${n.user.blogName}`}
            >
              {n.user.blogName}
            </Link>
          </li>
        )
      })}
    </ul>
  )

}

export default PostNotes;