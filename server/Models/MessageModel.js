import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({

    message: {
        type: String,
    },
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatModel',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    
    status: {
        type: Number,
        enum: [0, 1],
        default:0
      },
   
    delete: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    userName: {
        type: String,
        
      },
   
   
    filePath: {
        type:[String]
    },

    createdOn: {
        type: Date,
        default: new Date()
    }
});

const MessageModel = mongoose.model('MessageModel', MessageSchema);
export default MessageModel;