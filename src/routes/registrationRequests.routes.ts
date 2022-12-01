import {Router} from "express";
import {RegistrationRequestController} from "../controllers/RegistrationRequestController";
import {onlyAdmin} from "../middlewares";


export const registrationRequestsRouter = Router();

registrationRequestsRouter.post("/register", async (req, res) => {
    await RegistrationRequestController.sendRequestToRegister(req, res);
});

registrationRequestsRouter.get("/verify-email/:token", async (req, res) => {
    await RegistrationRequestController.verifyEmail(req, res);
});

registrationRequestsRouter.get("/get", ...onlyAdmin(), async (req, res) => {
    await RegistrationRequestController.getRegistrationRequests(req, res);
});

registrationRequestsRouter.post("/resend-verify-email", async (req, res) => {
    await RegistrationRequestController.resendVerifyEmail(req, res);
});

registrationRequestsRouter.put("/accept/:id", ...onlyAdmin(), async (req, res) => {
    await RegistrationRequestController.acceptRequest(req, res);
});

registrationRequestsRouter.delete("/reject/:id", ...onlyAdmin(), async (req, res) => {
    await RegistrationRequestController.rejectRequest(req, res);
});

registrationRequestsRouter.put("/update", ...onlyAdmin(), async (req, res) => {
    await RegistrationRequestController.updateRegistrationRequest(req, res);
});

registrationRequestsRouter.delete("/delete/:id", ...onlyAdmin(), async (req, res) => {
    await RegistrationRequestController.deleteRegistrationRequest(req, res);
});
