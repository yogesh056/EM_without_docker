const router = require("express").Router();
class UsersRoutes {
  constructor(controller) {
    this.controller = controller;
    this.init();
  }

  init() {
    
      router.get("/test", async (req, res) => {
        try {   
          console.log(req.body,this.controller)

        const response = await this.controller.test();
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/signin", async (req, res) => {
        try {
          console.log(req.body)
        const response = await this.controller.signin(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/verify", async (req, res) => {
        try {
          console.log(req.body)
        const response = await this.controller.verifyEmail(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/login", async (req, res) => {
        try {
          console.log("login",req.body)
        const response = await this.controller.login(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/getEvents",  async (req, res) => {
        try {
          console.log(req.body)
        const response = await this.controller.getEvents(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/user",  async (req, res) => {
        try {
          console.log(req.body)
        const response = await this.controller.getUserDetails(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
    router.get("/allUsers",  async (req, res) => {
      try {
      const response = await this.controller.getAllUsers();
        res.json(response);
      } catch (err) {
        global.log.error(err);
        res.json({ code: 500, msg: "An error occurred !" });
      }

      res.end();
    });
  }
    getRouter() {
      return router;
    }
}
module.exports = controller => {
  return new UsersRoutes(controller);
};
