import './startConversation.css'
import { axios, handleImg, removeUnicode } from "utilities"
import useSWR from 'swr'
import { fetcher } from 'utilities/swr'

export default function StartConversation({ search, isAddNew, setIsAddNew, setCurrentChat, setConversations, inputRef }) {
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
      inputRef.current.focus()
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
            !removeUnicode(user?.username)?.includes(search) ? null :
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
