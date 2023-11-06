const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const { Op } = require("sequelize");
const cookieParser = require("cookie-parser");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = process.env.PORT || 8080;
const USER_COOKIE_KEY = "USER";

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다");
    });
});

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ],
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Product.create({ description, price, seller, imageUrl, name })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다");
    });
});

app.post("/signin", (req, res) => {
  const body = req.body;
  const { userID, userPW, username, usermail } = body;
  if (!userID || !userPW || !username || !usermail) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Idlist.create({ userID, userPW, username, usermail })
    .then((result) => {
      console.log("회원가입 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("회원가입에 문제가 발생했습니다");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

app.get("/check-username", async (req, res) => {
  const username = req.query.username;

  try {
    const user = await models.Idlist.findOne({
      where: {
        userID: username,
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

app.post("/login", (req, res) => {
  const { userID, userPW } = req.body;

  try {
    models.Idlist.findOne({
      where: {
        [Op.and]: [{ userID: userID }, { userPW: userPW }],
      },
    })
      .then((user) => {
        if (user) {
          // 인증 성공
          res.status(200).json({ message: "로그인 성공" });
        } else {
          // 인증 실패
          res.status(401).json({ error: "로그인 실패" });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러ㅠ");
      process.exit();
    });
});
