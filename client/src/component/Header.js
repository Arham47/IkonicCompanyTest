import { Box, Button, Card } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import URL from "../URL";
function Header({ socket }) {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const createNewRoom = () => {
  
    axios.post(`${URL}/chat/create`,{chatName:"example"}).then((data) => {
      console.log(data);
      const roomId = data.data.data._id
      navigate(`/room/${roomId}`);
      socket.emit("new-room-created", { roomId });
      setRooms((prev) => [...prev, roomId]);
    })

  };
  useEffect(() => {
 if (!socket) return;

   socket.on("new-room-created", (data) => {
      // Assuming 'roomId' is part of the data received
      const { roomId } = data;
      setRooms((prev) => [...prev, roomId]);
   });

   // Clean up the socket listener when the component unmounts
   return () => {
      socket.off("new-room-created");
   };
  }, [socket]);
  useEffect(() => {
    axios.get(`${URL}/chat/getchat`).then((data) => {
      console.log(data.data)
      setRooms(data.data.data)
    })
  },[])
  return (
    <Card sx={{ marginTop: 5, backgroundColor: "gray" }} raised>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Link style={{ textDecoration: "none" }} to={"/"}>
            <Button sx={{ color: "white" }}>home</Button>
          </Link>
          <Link style={{ textDecoration: "none" }} to={"/chats"}>
            <Button sx={{ color: "white" }}>chat</Button>
          </Link>

          {rooms.map((roomId,i) => {
            return (
              <Link style={{ textDecoration: "none" }} to={`/room/${roomId._id}`}>
                <Button sx={{ color: "white" }}>Room{i+1 }</Button>
            </Link>
            )
          })}
        </Box>
        <Box>
          <Button sx={{ color: "white" }} onClick={createNewRoom}>
            New Room
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default Header;
