import express from "express";
import homePageController from "../controllers/homePageController";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";
import userProfileController from "../controllers/userProfileController";
import companyController from "../controllers/companyController";
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
  router.get(
    "/",
    loginController.checkLoggedIn,
    homePageController.handleHelloWorld
  );
  router.get(
    "/login",
    loginController.checkLoggedOut,
    loginController.getPageLogin
  );
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      successFlash: true,
      failureFlash: true,
    })
  );

  router.get("/register", registerController.getPageRegister);
  router.post(
    "/register",
    auth.validateRegister,
    registerController.createNewUser
  );
  router.post("/logout", loginController.postLogOut);

  //User Routes
  router.get("/user", userProfileController.getUserSettings);
  router.post("/update", userProfileController.updateSettings);

  //Copmany Routes
  router.get("/company", companyController.viewCompanyPage);
  //router.post("/generate", companyController.handleFileUpload);
  router.post(
    "/generate",
    upload.single("image"),
    companyController.handleFileUpload
  );
  return app.use("/", router);
};
module.exports = initWebRoutes;
