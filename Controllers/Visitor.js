import { HospitalSchema } from "../models/Hospital.js";
import {VisitorSchema} from "../models/Visitor.js"
import { sendCookie } from "../utils/features.js";

export const Visitorregister = async(req,res)=>{
    try {
        const { name, phone, password ,email} = req.body;
        console.log(email)

        // Check if hospital already exists
        const existingHospital = await VisitorSchema.findOne({ contactNumber:phone });
      
        if (existingHospital) {
          return res.status(400).json({ message: "Hospital already registered!" });
        }
    
       
       
    
        // Create new hospital
        const newHospital = new VisitorSchema({
         name,
          contactNumber:phone,
          password,
          email
        });
   
        await newHospital.save();
        sendCookie(newHospital,res,"Registerd succesfully",201);
    
      
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
};


export const VisitorLogin = async(req,res)=>{
    try {
        const { email, password } = req.body;
    
        // Check if hospital exists
        const hospital = await VisitorSchema.findOne({ email });
        if (!hospital) {
          return res.status(400).json({ message: "Invalid credentials!" });
        }
     
        if (password !==  hospital.password) {
          return res.status(400).json({ message: "Invalid credentials!" });
        }
    
        // Generate JWT token
        sendCookie(hospital,res,"Login succesfully",201);
    
       
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }

}

export const GetHospital = async (req, res) => {
    try {
      const {  location,  state   } = req.body;
      console.log(location + ""+ state);

      if (!location || !state) {
        return res.status(400).json({ message: "Pincode, state, and location are required" });
      }

  const hospitals = await HospitalSchema.find({ state, city:location});
        res.json(hospitals);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };