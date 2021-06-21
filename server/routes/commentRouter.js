const express = require("express");
const Comment = require("../schemas/comment");
const router = express.Router();
const path = require("path");
const { execSync } = require("child_process");
const pyApp = require("child_process");
const fs = require('fs');
const { title } = require("process");

var command = 'python';
var args = ['./korean-hate-speech-koelectra/main.py', '--model_name_or_path', './korean-hate-speech-koelectra/model', '--model_dir', './korean-hate-speech-koelectra/model', '--sQ_tfile', './temp/tfile.txt', '--sQuare', '--dev_file', './korean-hate-speech-koelectra/data/validate.txt'];

function getContentBuffer(content) {
  var contentLines = []
  content = content.replaceAll('<p>', "");
  content.replaceAll('</p>', "").split('\n').forEach(element => { contentLines.push(element); });

  return contentLines;
}

function getSchoolViolent(contentLines) {
  var result = [];
  var tmpFile = [];
  var content = "Contents\n";
  contentLines.forEach(element => {
    if(element != ""){
      //tmpFile.push('"' + title + '"\t' + element + '\n');
      
      tmpFile.push(element + '\n');
      content = content + tmpFile[tmpFile.length - 1];
    }
  });

  console.log(content);
  
  fs.writeFileSync('./temp/tfile.txt', content, 'utf-8', function (err) {
    if (err)
      return console.log(err);
  });

  var results = pyApp.execFileSync(command, args) + '';
  if (results != null) {
    results = results.replaceAll('\r', '')
    result = results.split('\n');

    console.log(result);
  }

  return result;
}

function isSchoolViolence(obj) {
  var tContent = obj.content.substring(0, obj.content.length);
  var contentLines = getContentBuffer(tContent);
  var check = getSchoolViolent(contentLines);
  var ret = "주의! 스퀘어봇이 학교폭력을 감지했어요.\n\n"
  var checked = false;
  console.log(contentLines);

  for (var i = 0; i < check.length - 1; i += 2) {
    console.log(check[i]);
    if (check[i] == "none,none") continue;
    if (!checked) checked = true;

    var violence = "\n사유: ".concat(check[i]);
    violence = violence.replace(",offensive", "을 매개로 불쾌감을 줄 수 있는 표현\n");
    violence = violence.replace(",hate", "을 매개로 한 혐오 표현\n\n");

    violence = violence.replace("none", "언어표현");
    violence = violence.replace("gender", "성별");
    violence = violence.replace("appearance", "외모");
    violence = violence.replace("grade", "노력");
    violence = violence.replace("personality", "성격");
    violence = violence.replace("sexual", "성");

    contentLines[i] = contentLines[i] + violence;
    ret = ret.concat(contentLines[i]);
  }

  if(!checked) return '';
  
  ret = ret.concat("정말 게시하시겠습니까?");
  return ret;
}

router.post("/save", async (req, res) => {
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
  
      var ret = isSchoolViolence(obj);
      if(ret != '') res.json({ isViolence: true, message: ret });
      else res.json({ isViolence: false, message: '' });
    } catch (err) {
      console.log(err);
      res.json({ message: false });
    }
  });


module.exports = router;
