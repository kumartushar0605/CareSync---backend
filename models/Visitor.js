import mongoose from "mongoose";


const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type :String ,required :true},
  contactNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


export const VisitorSchema  = mongoose.model("VisitorRegistration",visitorSchema);