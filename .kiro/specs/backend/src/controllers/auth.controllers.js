// const validato = require("validator");
import jwt from "jsonwebtoken";
import validator from "validator";
import User  from "../Models/User.js";
import { upsertStreamUser } from "../lib/stream.js"

export async function signup(req ,res){

    try{
    const {fullName, email, password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        if(password.length2 <6){
            return res.status(400).json({message: "Password must have gratter than 6 latters"})
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Invalid email & password"})
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({message: "Password must have at least one uppercase letter, one lowercase letter, one number, and one symbol"})
        }

        if(!validator.isAlpha(fullName.replace(" ", ""))){
            return res.status(400).json({message: "Full name must contain only letters"})
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
        
        const idx = Math.floor(Math.random() * 100);
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser  =  await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        })
        console.log(newUser);

        try{
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "", 
            });
            
            // console.log(`stream user is created for ${newUser.fullName}`)
        }catch(error){
            console.error("error in stream userData creatation: ",error)
        }



        const token = jwt.sign({userId : newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });


        res.status(201).json({success: true, user: newUser})
        }catch(error){
            console.error("Error during signup:", error);
            res.status(500).json({message: "Internal server error"});
        }   


}
export async function login(req ,res){
  try{  
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({message : "All feilds are required"})
    }

    const user =  await User.findOne({ email })
    if(!user){
        return res.status(400).json({message : "Invalid email and password"})
    }

     const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

     const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });

    res.status(200).json({success: true, user})
  }catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export function logout(req ,res){
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
}
export async function onboard(req,res){
    try{
    const userId = req.user._id;

    const {fullName, bio, nativeLanguage, learningLanguage ,location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
        return res.status(401).
        json({message : "All fileds required",
            messingFileds :[!fullName && "fullName",
                            !bio && "bio",
                            !nativeLanguage && "nativeLanguage",
                            !learningLanguage && "learningLanguage",
                            !location && "location"
            ].filter(Boolean)
        })
    }


    const updatedUser = await User.findByIdAndUpdate(
        userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    )
    
    if(!updatedUser) return res.status(401).json({message : "user not found"});
    
     try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });


    }catch(error){
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}