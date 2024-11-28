// const express = require("express");
// const next = require("next");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const expressSession = require("express-session");
// const dotenv = require("dotenv");

// const dev = process.env.NODE_ENV !== "production";
// const prod = process.env.NODE_ENV === "production";

// dotenv.config();

// const app = next({ dev }); // next 모듈을 사용
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express(); // back 서버에서의 const app = express()

//   server.use(morgan("dev"));
//   server.use(express.json());
//   server.use(express.urlencoded({ extended: true }));
//   server.use(cookieParser(process.env.COOKIE_SECRET));
//   server.use(
//     expressSession({
//       resave: false,
//       saveUninitialized: false,
//       secret: process.env.COOKIE_SECRET, // backend 서버와 같은 키를 써야한다.
//       cookie: {
//         httpOnly: true,
//         secure: false,
//       },
//     })
//   );

//   server.get("/hashtag/:tag", (req: any, res: any) => {
//     res.send("welcome!");
//     console.log("hi");
//     // return app.render(req, res, "/hashtag", { tag: req.params.tag });
//   });

//   // server.get("/user/:id", (req, res) => {
//   //   return app.render(req, res, "/user", { id: req.params.id });
//   // });

//   // server.get("*", (req, res) => {
//   //   // 모든 get 요청 처리
//   //   return handle(req, res); // next의 get 요청 처리기
//   // });

//   server.listen(8080, () => {
//     console.log("next+expresss running on port 3060");
//   });
// });

const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(cors());

app.get("/api/getdata", (req: any, res: any) => {
  return res.send("Responding from server!");
});

app.listen(port, () => {
  console.log(`succeed`);
});
