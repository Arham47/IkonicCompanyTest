import MessageController from "../SocketController/MessageController.js";
import typingController from "../SocketController/typingController.js";
import RoomController from "../SocketController/RoomController.js";
import FilesController from "../SocketController/FileController.js";



const socket = (socket) => {
  const typingSocket = new typingController(socket);
  const messageController = new MessageController(socket);
   const roomController = new RoomController(socket);
   const fileController=new FilesController(socket)

  socket.on("send-message", messageController.sendMessage);
  socket.on("typing-started", typingSocket.typingStart);
  socket.on("typing-stoped", typingSocket.typingStopController);
  socket.on("join-room", roomController.joinRoom);
  socket.on("new-room-created", roomController.newRoomCreated);

  socket.on('files-upload',fileController.sendAndStoreFile)
}

export default socket;
