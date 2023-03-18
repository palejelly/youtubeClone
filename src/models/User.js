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
});

userSchema.pre('save',async function(){
    console.log("users password:", this.password);
    this.password=await bcrypt.hash(this.password, 5);
    console.log("hash password: ", this.password);
});

const User = mongoose.model('User',userSchema);
export default User;

