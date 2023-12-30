import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom"
import ChatWindow from "../component/ChatWindow"
import { Typography } from "@mui/material";

function Room() {
    const params = useParams();
    const {socket}=useOutletContext()
    useEffect(() => {
        if(!socket) return
          socket.emit("join-room",{roomId:params.roomId})
    }, [socket])
  
  return (
    <div>
      <ChatWindow/>
    </div>
  )
}

export default Room