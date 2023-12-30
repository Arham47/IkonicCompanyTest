import BaseController from "./BaseController.js"


export default class RoomController extends BaseController{

    joinRoom = ({ roomId }) => {
        this.socket.join(roomId)
        this.socket.broadcast.to(roomId).emit("message-from-server-new-user-joined", { roomId });
        
     
        console.log("room joined")
       

    }
    
    newRoomCreated = ({ roomId }) => {
        this.socket.broadcast.emit("new-room-created", { roomId });
       

        
    }
}