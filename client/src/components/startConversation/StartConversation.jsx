import './startConversation.css'
import { axios, handleImg } from "utilities"
import useSWR from 'swr'
import { fetcher } from 'utilities/swr'

export default function StartConversation({ isAddNew, setIsAddNew, setCurrentChat, setConversations }) {
  const { data: users } = useSWR(isAddNew ? '/users/all' : null, fetcher)
  const handleCreateConversation = async userId => {
    try {
      const res = await axios.post(`/conversation/create/${userId}`)
      if (res.isCreated) {
        setCurrentChat(res.conversation)
      } else {
        setConversations(prev => [...prev, res.conversation])
        setCurrentChat(res.conversation)
      }
      setIsAddNew(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="startConversationWrapper">
      <div className="startConversation" onClick={() => setIsAddNew(prev => !prev)}>
        {isAddNew ? 'Close finding' : "Start a new conversation"}
      </div>
      {isAddNew &&
        <div className="startConversationDropdown">
          {users?.map(user => (
            <div className="conversation" key={user._id} onClick={() => handleCreateConversation(user._id)}>
              <img className="conversationImg"
                src={handleImg(user?.profilePicture)}
                alt="avt" />
              <span className="conversationName">{user?.username} {user?.online}</span>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
