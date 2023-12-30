import { Box, Container, Typography } from "@mui/material";
import ChatWindow from "./component/ChatWindow";
import { Outlet } from "react-router-dom";
import Header from "./component/Header";
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

useEffect(() => {
    setSocket(io("http://localhost:5000"));
  }, []);

  return (
    <div>
       <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Container>
        {/* <ChatWindow /> */}
       
          <Header socket={socket} />
       
        <Outlet context={{socket}} />
        
      </Container>
        </Box> 
    </div>
  );
}

export default App;
