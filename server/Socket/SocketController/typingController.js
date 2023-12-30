import BaseController from "./BaseController.js"
export default class TypingClass extends BaseController{
  
    
  typingStopController = ({ roomId }) => {
   console.log("ty-stop");
  let skt = this.socket.broadcast;
  skt = roomId ? skt.to(roomId) : skt;
    skt.emit("typing-stoped-from-server");
    
}
  typingStart = ({ roomId }) => {
  
    let skt = this.socket.broadcast;
    skt = roomId ? skt.to(roomId) : skt;
    skt.emit("typing-started-from-server");
    
}
}


