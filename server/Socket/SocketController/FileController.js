import BaseController from "./BaseController.js";
  
  export default class FilesController extends BaseController {
    sendAndStoreFile = ({arr, roomID, userName}) => {
     
      const data = arr
      let skt = this.socket.broadcast;
      skt = roomID ? skt.to(roomID) : skt;
      skt.emit('files-uploaded-from-server', { message: data, type: "image", userName: userName });
      console.log(arr);
    
 
    };
  }
  
  
