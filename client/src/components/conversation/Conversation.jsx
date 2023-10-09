import { useEffect, useRef, useState } from "react"
import "./conversation.css"
import { handleImg, axios,removeUnicode } from 'utilities'
import DeleteIcon from '@material-ui/icons/Delete';

export default function Conversation({ search, conversation, currentUser, currentChatId, handleDeleteConversation }) {
  const [user, setUser] = useState(null)
  const socket = useRef()
  useEffect(() => {
    socket?.current?.on("getUsers", async (users) => {
      const usersId = users.map(user => user.userId)
      if (usersId.includes(user?._id)) {
        setUser(prev => ({
          ...prev,
          online: true
        }))
      }
    })
  }, [user?._id])
  useEffect(() => {
    if (!currentUser?._id) return
    const friendId = conversation?.members?.find(m => m !== currentUser?._id)

    const getUser = async () => {
      const res = await axios.get(`/users?userId=${friendId}`)
      setUser(res)
    }
    getUser()
  }, [conversation?.members, currentUser?._id])
  if (!removeUnicode(user?.username)?.includes(search)) {
    return null
  }
  return (
    <div className={`conversation ${currentChatId === conversation?._id ? "selected" : ''} `}>
      <img className="conversationImg"
        src={handleImg(user?.profilePicture)}
        alt="avt" />
      <span className="conversationName">{user?.username} {user?.online}</span>
      <DeleteIcon onClick={() => handleDeleteConversation(conversation?._id)} />
    </div>
  )
}
