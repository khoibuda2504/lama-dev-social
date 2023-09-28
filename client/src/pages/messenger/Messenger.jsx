import { useContext, useEffect, useRef, useState } from "react"
import Conversation from "components/conversation/Conversation"
import Message from "components/message/Messsage"
import "./messenger.css"
import { AuthContext } from "context/AuthContext"
import { io } from 'socket.io-client'
import { handleImg, axios } from "utilities"
import { Logout } from "context/AuthActions"
import { useHistory } from "react-router";
import { ExitToApp } from '@material-ui/icons';
import StartConversation from "components/startConversation/StartConversation"


export default function Messenger() {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isAddNew, setIsAddNew] = useState(false)
  const socket = useRef()
  const { user, dispatch } = useContext(AuthContext)
  const scrollRef = useRef()
  const history = useHistory();
  useEffect(() => {
    socket.current = io("ws://localhost:8900")
    socket.current.on("getMessage", data => {
      setMessages(prev => [...prev, {
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      }])
    })
  }, [])
  useEffect(() => {
    socket.current.emit("addUser", user._id)
  }, [user])

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversation/" + user._id)
        setConversations(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getConversations()
  }, [user._id])
  useEffect(() => {
    if (!currentChat?._id) return
    const getMessages = async () => {
      try {
        const res = await axios.get("/message/" + currentChat?._id)
        setMessages(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getMessages()
  }, [currentChat?._id])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = {
      conversationId: currentChat?._id,
      sender: user._id,
      text: newMessage
    }
    const receiverId = currentChat.members.find(member => member !== user._id)
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage
    })
    try {
      const res = await axios.post("/message", message)
      setMessages(prev => [...prev, res.data])
      setNewMessage("")
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatHeader">
              <div className="chatHeaderOwn">
                <img className="conversationImg"
                  src={handleImg(user?.profilePicture)}
                  alt="avt"
                />
                <span>{user?.username}</span>
              </div>
              <div className="chatLogOut" onClick={() => {
                dispatch(Logout())
                history.push('/login')
              }}>
                <ExitToApp />
              </div>
            </div>
            <input type="text" placeholder="🔍 Search for friends" className="chatMenuInput" />
            <StartConversation isAddNew={isAddNew} setIsAddNew={setIsAddNew} />
            {conversations.map(c => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation currentChatId={currentChat?._id} conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? <>
              <div className="chatBoxTop">
                {messages.map(m => (
                  <div key={m._id} ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput" placeholder="write something..."
                  onChange={e => setNewMessage(e.target.value)}
                  value={newMessage}
                >
                </textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
              </div>
            </> : <span className="noConversationText">
              Open a conversation to start a chat
            </span>}
          </div>
        </div>
      </div>
    </>
  )
}
