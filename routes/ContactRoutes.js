import Router from "express";
import verifytoken from "../middlewares/AuthMiddleware.js";
import { searchcontact, getContactsForDmList , getAllcontact } from "../controllers/contactcontroller.js";


const contactRoutes = Router();

contactRoutes.post("/search",verifytoken, searchcontact);
contactRoutes.get("/get-contact-dm",verifytoken, getContactsForDmList); //
contactRoutes.get('/get-all-contacts',verifytoken,getAllcontact)

export default contactRoutes;