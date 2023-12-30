import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import OutlinedInput from "@mui/material/OutlinedInput";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { useOutletContext, useParams } from "react-router-dom";
import URL from "../URL";
import axios from "axios";

function ChatWindow() {
 const {socket}= useOutletContext()
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typingTimout, setTypingTimeout] = useState(null);
  const { roomId } = useParams()
  const [formData, setFormData] = useState({
    message: "",
    userID:roomId,
    chatID: roomId,
  
  });
  const fileRef=useRef(null)
  const handleForm = (e) => {
    e.preventDefault();
    socket.emit("send-message", { message, roomId });
    axios.post(`${URL}/chat/messages`, formData, false).then((data) => {
      // console.log(data);
    });
    setChat((prev) => [...prev, { message: message, recieved: false }]);

    setMessage("");
  };
  
  const handleInput = (e) => {
    setMessage(e.target.value);
    setFormData({ ...formData, message: e.target.value,filePath:[] });
    socket.emit("typing-started",{roomId});
    if (typingTimout) clearTimeout(typing);
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("typing-stoped",{roomId});
      }, 2000)
    );
  };

  const selectFile = ()=>{

    fileRef.current.click();
  }
 

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        // console.log('called: ', reader);
        resolve(reader.result);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const fileSelected = async (e) => {
    const arr = [];
    var filePath=[]
    const file = e.target.files;
    if (!file) return;
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("image", file[i]);
      var d = convertToBase64(file[i]).then((x) => {
        
        filePath.push(x)
      })
        .catch((error) => {
        console.error('Error converting to base64:', error);
      });
    }
    formData.append("userID", roomId);
    formData.append("message", "");
    formData.append("chatID", roomId);
    formData.append("userType", 0);
    formData.append("userName", "arham");
    
    axios.post(`${URL}/chat/messages`, formData, false).then((data) => {
      console.log(data);
    });
    const readFile = (fileData) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileData);

        reader.onload = () => {
          const data = reader.result;
          resolve(data);
        };

        reader.onerror = (error) => {
          reject(error);
        };
      });
    };

    for (const fileData of file) {
      try {
        const data = await readFile(fileData);
        arr.push(data);
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    socket.emit("files-upload", { arr, roomID:roomId,userName: "arham",  });
    

    setChat((prev) => [...prev, { message:message , recieved: true, userID:{roomId}, filePath, userName:"arham"}]);

  };

  useEffect(() => {
    if (!socket) return;
    if (socket) {
      socket.on("message-from-server", (data) => {
        setChat((prev) => [...prev, { message: data.message, recieved: true }]);
      });
      socket.on("typing-started-from-server", () => {
        setTyping(true);
      });
      socket.on("typing-stoped-from-server", () => {
        setTyping(false);
      });
      socket.on("message-from-server-new-user-joined", () => {
        setChat((prev) => [...prev, { message: "new user joined", recieved: true ,userJoined: true }]);
      });
      
    socket.on("files-uploaded-from-server", (data) => {
      var filePath = []
      console.log(data);
        data.message.forEach((x) => {
          filePath.push(x)
          
        });
        // console.log(filePath);
        setChat((prev) => [...prev, { message:message ,recieved: true,type:"image",  filePath, userName:data.userName}]);
    });
    }
  }, [socket]);
  useEffect(() => {
    axios.get(`${URL}/chat/get-latest-chat?chatID=${roomId}`).then((data) => {
      setChat(data.data.data);
    })
  }, [])
  useEffect(() => {
    axios.get(`${URL}/chat/get-latest-chat?chatID=${roomId}`).then((data) => {
      setChat(data.data.data);
    })
  }, [roomId])
  
  return (
    
      <Card
        sx={{
          padding: 2,
          marginTop: 10,
          width: "60%",
          background: "gray",
          color: "white",
        }}
      >
        {" "}
      <Box sx={{ marginBottom: 5 }}>
      {roomId &&  <Typography> this is our room ID {roomId}</Typography>}
      
        {chat.map((msg) => {
          console.log(msg);
            const textAlign=msg.recieved?"right":msg.userJoined&&"center"
            return (
              msg?.filePath.length?msg.filePath.map((x)=>{return<img src={`${URL}/uploads/${msg.message}`} width={200} alt="imge"/> }):
              <Typography
                key={msg.message}
                  sx={{ textAlign: textAlign}}
              >
                {msg.message}
              </Typography>
            );
          })}
        </Box>
        <Box component="form" onSubmit={handleForm}>
          {typing && (
            <InputLabel
              sx={{ color: "white" }}
              shrink
              htmlFor="bootstrap-input"
            >
              Typing
            </InputLabel>
          )}
          <OutlinedInput
            sx={{ backgroundColor: "white", width: "100%" }}
            size="small"
            placeholder="write your message"
            value={message}
            onChange={handleInput}
            endAdornment={
              <InputAdornment position="end">
                <input
                  onChange={fileSelected}
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                />
                <IconButton
                  type="button"
                  edge="end"
                  sx={{ marginRight: 1 }}
                  onClick={selectFile}
                >
                  <AttachFileIcon />
                </IconButton>
                <IconButton type="submit" edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </Card>
    
  );
}

export default ChatWindow;
