import {Router} from "express";

export const routers = Router();


routers.get("/test", (req, res) => {
    return res.status(200).send({"title": "Thank you for the all"});
});