const express = require("express");
const Comment = require("../schemas/comment");
const router = express.Router();

router.post("/getCommentList", async (req, res) => {
    try {
      const postId = req.body.postId;
      const comment = await Comment.find({ postId: postId })
      res.json({ list: comment });
    } catch (err) {
      console.log(err);
      res.json({ message: false });
    }
  });

router.post("/write", async (req, res) => {
    try {
      let obj;
  
      obj = {
        postId: req.body.postId,
        content: req.body.content
      };
  
      const comment = new Comment(obj);
      await comment.save();
      res.json({ message: "댓글이 업로드 되었습니다." });
    } catch (err) {
      console.log(err);
      res.json({ message: false });
    }
  });


module.exports = router;
