import {Router} from "express";
import {RegistrationRequestController} from "../controllers/RegistrationRequestController";


export const registrationRequestsRouter = Router();

registrationRequestsRouter.post("/register", async (req, res) => {
    await RegistrationRequestController.sendRequestToRegister(req, res);
});

registrationRequestsRouter.get("/verify-email/:token", async (req, res) => {
    await RegistrationRequestController.verifyEmail(req, res);
});

registrationRequestsRouter.get("/registration-requests", async (req, res) => {
    await RegistrationRequestController.getRegistrationRequests(req, res);
});

registrationRequestsRouter.post("/resend-verify-email", async (req, res) => {
    await RegistrationRequestController.resendVerifyEmail(req, res);
});

registrationRequestsRouter.put("/accept-registration-request/:id", async (req, res) => {
    await RegistrationRequestController.acceptRequest(req, res);
});

registrationRequestsRouter.delete("/reject-registration-request/:id", async (req, res) => {
    await RegistrationRequestController.rejectRequest(req, res);
});

registrationRequestsRouter.put("/update-registration-request", async (req, res) => {
    await RegistrationRequestController.updateRegistrationRequest(req, res);
});

registrationRequestsRouter.delete("/delete-registration-request/:id", async (req, res) => {
    await RegistrationRequestController.deleteRegistrationRequest(req, res);
});
