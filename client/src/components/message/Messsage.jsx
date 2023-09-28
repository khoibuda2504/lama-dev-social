import './message.css'
import { format } from 'timeago.js'
export default function Message({ own, message }) {
  return (
    <div className={`message ${own ? 'own' : ''}`}>
      <div className="messageTop">
        <img
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
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
