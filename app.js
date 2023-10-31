const express = require("express");
const app = express();
const models = require("./models");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/check-username", async (req, res) => {
  const body = req.body;
  const {userID,username} = body;

  try {
    const user = await models.Idlist.findOne({
      where: {
        userID: userID,
        username:username
      },
    });

    if (user) {
      res.json({ isDuplicate: true, message: "아이디가 이미 사용 중입니다." });
    } else {
      res.json({ isDuplicate: false, message: "아이디를 사용할 수 있습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
