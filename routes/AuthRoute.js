import Router from "express";
import {
  login,
  signup,
  getuserinfo,
  updateprofile,
  updateprofileimage,
  deleteprofileimage,
  handleLogout,
} from "../controllers/usercontroller.js";
import verifytoken from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/profiles"});

const authroute = Router();

authroute.post("/signup", signup);
authroute.post("/login", login);
authroute.get("/user-info", verifytoken, getuserinfo);
authroute.post("/update-profile", verifytoken, updateprofile);
authroute.post(
  "/add-profile-image",
  verifytoken,
  upload.single("profile-image"),
  updateprofileimage
);
authroute.delete("/remove-profile-image", verifytoken, deleteprofileimage);
authroute.post("/logout", verifytoken, handleLogout);

export default authroute;
