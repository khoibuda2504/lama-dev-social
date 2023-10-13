import "./avatar.css";
import React from 'react'
import { handleImg } from 'utilities'
export default function Avatar({ user }) {
  return (
    <div className='avatar'>
      <img className="conversationImg"
        src={handleImg(user?.profilePicture)}
        alt="avt"
      />
      {user?.online &&
        <div className="chatOnlineBadge"></div>
      }
    </div>
  )
}