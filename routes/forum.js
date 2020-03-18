const router = require("express").Router();
class ForumRoutes {
  constructor(controller) {
    this.controller = controller;
    this.init();
  }

  init() {
      router.post("/addQuestion", async (req, res) => {
        try {
          console.log(req.body)
          console.log("hdfjdhf",this.controller)
        const response = await this.controller.add(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.get("/getQuestions", async (req, res) => {
        try {
        const response = await this.controller.getAll();
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/vote", async (req, res) => {
        try {
          console.log(req.body,this.controller)
        const response = await this.controller.vote(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/addAnswer", async (req, res) => {
        try {
          console.log(req.body,this.controller)
        const response = await this.controller.answer(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/analyze", async (req, res) => {
        try {
          console.log(req.body)
        const response = await this.controller.analysis(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/getQuestion", async (req, res) => {
        try {
          console.log(req.body,this.controller)
        const response = await this.controller.getQuestionDetails(req.body);
          res.json(response);
        } catch (err) {
          global.log.error(err);
          res.json({ code: 500, msg: "An error occurred !" });
        }
  
        res.end();
      });
      router.post("/deleteAnswer", async (req, res) => {
        try {
          console.log(req.body,this.controller)
        const response = await this.controller.deleteComment(req.body);
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
  return new ForumRoutes(controller);
};
