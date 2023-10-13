import { handleImg } from 'utilities'
import './message.css'
import { format } from 'timeago.js'
export default function Message({ own, message }) {
  return (
    <div className={`message ${own ? 'own' : ''}`}>
      <div className="messageTop">
        <img
          src={handleImg(message?.sender?.profilePicture)}
          alt=""
          className='messageImg' />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        {format(message.createdAt)}
      </div>
    </div>
  )
}
