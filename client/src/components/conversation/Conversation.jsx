import { useEffect, useRef, useState } from "react"
import "./conversation.css"
import { io } from 'socket.io-client'
import { handleImg, axios } from 'utilities'

export default function Conversation({ conversation, currentUser, currentChatId }) {
  const [user, setUser] = useState(null)
  const socket = useRef()
  useEffect(() => {
    socket.current = io("ws://localhost:8900")
    socket.current.on("getUsers", async (users) => {
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
      setUser(res.data)
    }
    getUser()
  }, [conversation?.members, currentUser?._id])
  return (
    <div className={`conversation ${currentChatId === conversation?._id ? "selected" : ''} `}>
      <img className="conversationImg"
        src={handleImg(user?.profilePicture)}
        alt="avt" />
      <span className="conversationName">{user?.username} {user?.online}</span>
    </div>
  )
}
