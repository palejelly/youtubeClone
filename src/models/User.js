import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { boolean } from "webidl-conversions";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    socialOnly:{type: Boolean, default:false},
    username: {type: String, required:true, unique: true },
    password: {type:String},
    name: {type: String, required: true},
    avatarUrl : {type: String},
    location: String, 
    videos: [{type: mongoose.Schema.Types.ObjectId, ref:"Video"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}],
});

userSchema.pre('save',async function(){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model('User',userSchema);
export default User;


