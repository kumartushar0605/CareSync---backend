import jwt from "jsonwebtoken"
//////Teacherrrrrrr
export const sendCookie = (Userr,res,message,statusCode)=>{
    const tokenn = jwt.sign({_id:Userr._id},"tdsfadsfasfadsfasdfb")
     console.log("hitushar")
   
    res.status(statusCode).cookie("tokenn",tokenn,{
      httpOnly:true,
      maxAge:90*60*1000, // 15 min m cookie expire hogaye ga
    //   sameSite:process.env.NODE_ENV==="DEVELOPMENT"?"lax":"none", //backend kisi or url pr rhe ga or fronend kisi or url pr 
    //   secure:process.env.NODE_ENV==="DEVELOPMENT"?false:true

    sameSite: "none",  // Change to "none" if frontend and backend have different origins
    secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true
    }).json({
      success:true,
      message,
      tokenn,
      Userr
      
    
    })
}