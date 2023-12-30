import mongoose from "mongoose";
import bcrypt from "bcrypt"
const UserSchema=mongoose.Schema({
   
    email:{
        type:String,
        required:true,
        unique: true ,
        lowercase:true,
               
      },
  
  
    userName:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
    },
  
   
    
  
    createdOn: {
        type: Date,
        default:new Date()
    },
})
UserSchema.pre("save",async function(next){
    const salt= await bcrypt.genSalt();
    this.password=  await bcrypt.hash(this.password,salt);
    next()

})

const AdminModel = mongoose.model('UserModel',UserSchema);
 export default AdminModel;