import {Router} from "express";
import {RegistrationRequestController} from "../controllers/RegistrationRequestController";


export const clientRouter = Router();

clientRouter.post("/register", async (req, res) => {
    await RegistrationRequestController.sendRequestToRegister(req, res);
});

clientRouter.get("/verify-email/:token", async (req, res) => {
    await RegistrationRequestController.verifyEmail(req, res);
});

clientRouter.get("/registration-requests", async (req, res) => {
    await RegistrationRequestController.getRegistrationRequests(req, res);
});

clientRouter.post("/resend-verify-email", async (req, res) => {
    await RegistrationRequestController.resendVerifyEmail(req, res);
});

clientRouter.put("/update-registration-request", async (req, res) => {
    await RegistrationRequestController.updateRegistrationRequest(req, res);
});

clientRouter.delete("/delete-registration-request", async (req, res) => {
    await RegistrationRequestController.deleteRegistrationRequest(req, res);
});
