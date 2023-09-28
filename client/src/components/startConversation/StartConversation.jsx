import { useEffect, useState } from 'react'
import './startConversation.css'
import {axios} from "utilities"

export default function StartConversation({ isAddNew, setIsAddNew }) {
  const [users, setUsers] = useState([])
  useEffect(() => {
    (async () => {
     try {
      const res = await axios.get("/users/all")
      setUsers(res?.data)
     } catch (error) {
      console.log(error)
     }
    })()
  }, []) 
  return (
    <div className="startConversationWrapper">
      <div className="startConversation" onClick={() => setIsAddNew(prev => !prev)}>
        {isAddNew ? 'Close finding' : "Start a new conversation"}
      </div>
      {isAddNew &&
        <div className="startConversationDropdown">
          hehe
        </div>
      }
    </div>
  )
}
