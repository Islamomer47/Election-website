const { getAdminData } = require("../controllers/adminController");
const expressRouter = require("express").Router();
expressRouter.get("/admin", getAdminData);

module.exports = expressRouter;
