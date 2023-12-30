import ChatModel from "../Models/ChatModel.js";
import MessageModel from "../Models/MessageModel.js";
    
export const createChat = async (req, res) => {
  try {
    
      const newChat = new ChatModel(req.body);
      const savedChat = await newChat.save();
      res.json(savedChat);
    } catch (error) {
      res.status(500).json({ error: "Error creating chat" ,error});
    }
};
export const getChats = async (req, res) => {
  try {
    const chats = await ChatModel.find();

    res.status(200).json({
      message: 'All chats fetched successfully',
      status: 200,
      data: chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', status: 500 });
  }
};
export const createMessage = async (req, res) => {

  try {
    const { message, chatID, userID, userName } = req.body;

   
    console.log(req.files);
    const filePath = req?.files?.image.map(file => file.filename) || [];

    const newMessage = new MessageModel({
      message,
      chatID,
      userID,
      userName,
      filePath,
    });

    const savedMessage = await newMessage.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};


export const getAllMessages = async (req, res) => {
  const {chatID}=req.body
  try {
    
    const messages = await MessageModel.find({chatID})
    .populate({path:'chatID',select:"chatName"}).populate({path:"adminID",select:"firstName lastName _id"}).populate({path:"teamMemberID",select:"_id"}).populate({path:"clientID",select:"_id clientName"})
    
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const toggleMessageDelete = async (req, res) => {
  try {
    const { messageId } = req.params; 


    const message = await MessageModel.findById(messageId);

   
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }


    message.delete = message.delete === 0 ? 1 : 0;

   
    const updatedMessage = await message.save();

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getLatestChats = async (req, res) => {
  const { chatID} = req.query;

  try {
    const latestChats = await MessageModel
      .find({ chatID })
      .populate("chatID")
      .sort({ createdOn: -1 })
      .limit(10);

    if (!latestChats || latestChats.length === 0) {
      return res.status(202).json({
        status: 202,
        message: "No chats found ",
        data:[]
      });
    }

    res.status(200).json({
      status: 200,
      data: latestChats,
      message: "Latest 10 chats fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};