const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const path = require("path");
const { execSync } = require("child_process");
const pyApp = require("child_process");
const fs = require('fs');
const { title } = require("process");

//var Iconv = require('iconv').Iconv; // euc-kr을 utf-8로 변환 설정
//var encode = new Iconv('utf-8', 'cp949');

//const types = ['gender', 'offensive', 'hate']

//const PythonShell = require("python-shell");

/*
var options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: './korean-hate-speech-koelectra',
  args: ['--model_name_or_path', './korean-hate-speech-koelectra/model', '--model_dir', './korean-hate-speech-koelectra/model', '--sQuare']
};
*/
//'--model_type', 'koelectra-base-v2', '--model_name_or_path', 'D:/JNUCST/2021-1/proj/sQuare-main/server/korean-hate-speech-koelectra/model',

var command = 'python';
var args = ['./korean-hate-speech-koelectra/main.py', '--model_name_or_path', './korean-hate-speech-koelectra/model', '--model_dir', './korean-hate-speech-koelectra/model', '--sQ_tfile', './temp/tfile.txt', '--sQuare'];

function getContentBuffer(title, content) {
  var contentLines = [];
  contentLines.push(title);
  content = content.replaceAll('<p>', "");
  content.replaceAll('</p>', "").split('\n').forEach(element => { contentLines.push(element); });

  return contentLines;
}

function isSchoolViolent(title, contentLines) {
  var result = [];
  var tmpFile = [];
  var content = "Contents";
  tmpFile.push(title);
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

//  var tbuf = new Buffer(title, 'binary');
//  var cbuf = new Buffer(content, 'binary');

//  args.push('--sQ_title');
  //args.push(title);
  //args.push(tbuf);
//  args.push(encode.convert(tbuf));
//  args.push('--sQ_content');
  //args.push(content)
  //args.push(cbuf);
 // args.push(encode.convert(cbuf));

  //console.log(args);
  var results = pyApp.execFileSync(command, args) + '';
//  PythonShell.PythonShell.run('main.py', options, function (err, results) {
//    if (err) throw err;
  if (results != null) {
    results = results.replaceAll('\r', '')
    result = results.split('\n');

    console.log(result);
  }

  //args.pop();
  //args.pop();
  //args.pop();
  //args.pop();

  return result;
}

router.post("/save", async (req, res) => {
  try {
    let obj;

    obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content
    };

    const board = new Board(obj);
    await board.save();
    res.json({ message: "게시글이 등록되었습니다." })
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/delete", async (req, res) => {
  try {
    await Board.remove({
      _id: req.body._id
    });
    res.json({ message: true });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/update", async (req, res) => {
  try {
    await Board.update(
      { _id: req.body._id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content
        }
      }
    );
    res.json({ message: "게시글이 수정 되었습니다." });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/write", async (req, res) => {
  try {
    let obj;

    obj = {
      writer: req.body._id,
      title: req.body.title,
      content: req.body.content
    };

    var tcontent = obj.content.substring(0, obj.content.length - 1);
    var contentLines = getContentBuffer(obj.title, tcontent);
    var check = isSchoolViolent(obj.title, contentLines);
    var ret = "주의! 스퀘어봇이 학교폭력을 감지했어요.\n\n"
    var checked = false;

    for(var i = 0; i < check.length; i++) {
      if (check[i] == "none,none" || check[i] == '') continue;
      if (!checked) checked = true;
      
      if (i == 0) ret = ret.concat("제목에 문제가 있습니다.\n");
      var violence = "\n사유: ".concat(check[i]);
      violence = violence.replace(",offensive", "에게 불쾌감을 줄 수 있는 표현\n\n");
      violence = violence.replace(",hate", "에 대한 혐오 표현\n\n");

      violence = violence.replace("gender", "성별");
      violence = violence.replace("none", "타인");
      violence = violence.replace("others", "타인");

      contentLines[i] = contentLines[i].concat(violence);
      ret = ret.concat(contentLines[i]);
    }

    ret = ret.concat("정말 게시하시겠습니까?");

    if(checked) res.json({ isViolence: true, message: ret });
    else res.json({ isViolence: false, message: '' });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/getBoardList", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ writer: _id }, null, {
      sort: { createdAt: -1 }
    });
    res.json({ list: board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

router.post("/detail", async (req, res) => {
  try {
    const _id = req.body._id;
    const board = await Board.find({ _id });
    res.json({ board });
  } catch (err) {
    console.log(err);
    res.json({ message: false });
  }
});

module.exports = router;
