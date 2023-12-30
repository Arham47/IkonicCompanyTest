import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
  chatName: {
    type: String,
    required: true,
  },

 createdOn: {
        type: Date,
        default:new Date()
    }
});

const ChatModel = mongoose.model('ChatModel', ChatSchema);
export default ChatModel;
