/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

const session = require("express-session");
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false }),
);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const multer = require("multer");

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      },
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", async function (request, response) {
  if (!request.session.user) {
    console.log("访问/user/list失败,用户未登录 ");
    response.status(401).send("用户未登录");
    return;
  }
  // const users = cs142models.userListModel();
  const users = await User.find(); // 查询 User 集合的所有文档
  let newUsers = [];
  for (const user of users) {
    const newUser = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    newUsers.push(newUser);
  }
  console.log("获取/user/list成功");
  // console.log(users);
  response.status(200).send(newUsers);
  // console.log(users);
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", async function (request, response) {
  if (!request.session.user) {
    console.log("访问/user/:id失败,用户未登录 ");
    response.status(401).send("用户未登录");
    return;
  }

  const id = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).send("无效的用户 ID");
    return;
  }

  try {
    const user = await User.findById(id);

    if (user === null) {
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    const newUser = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    };
    response.status(200).send(newUser);
    console.log("获取" + user.first_name + "信息成功");
  } catch (err) {
    // Mongoose 查询异常，比如 ID 格式不正确
    console.error("查询用户时出错:", err.message);
    response.status(500).send("服务器查询错误");
  }
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", async function (request, response) {
  if (!request.session.user) {
    console.log("访问/photosOfUser/:id失败,用户未登录 ");
    response.status(401).send("用户未登录");
    return;
  }
  const id = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).send("无效的用户 ID");
    return;
  }

  let photos = await Photo.find({ user_id: id }).lean();

  if (photos.length === 0) {
    console.log("Photos for user with _id:" + id + " not found.");
    response.status(400).send("Not found");
    return;
  }

  for (const photo of photos) {
    const newComments = []; // 用来存储修改后的 comment

    for (const comment of photo.comments) {
      const user = await User.findById(comment.user_id).lean(); // 获取 user
      // 构造你想要的新 comment 对象
      const newUser = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      const newComment = {
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user: newUser, // 新增属性
      };
      newComments.push(newComment);
    }

    // 用新数组替换原有 comments
    delete photo.__v;
    photo.comments = newComments;
  }
  console.log("获取photo" + id + "信息成功");

  response.status(200).send(photos);
});

/**
 * URL /admin/login.
 */
app.post("/admin/login", async function (request, response) {
  // const users = cs142models.userListModel();
  const login_name = request.body.login_name;
  const user = await User.findOne({ login_name: login_name }); // 查询 User 集合的所有文档
  if (!user) {
    console.log(login_name + "未找到，登录失败");
    response.status(400).send("Login name not found");
    return;
  }
  request.session.user = { login_name };
  console.log({ login_name } + "login in");
  const newUser = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  // console.log(users);
  response.status(200).send(newUser);
  console.log(login_name + "登录成功");
});

/**
 * URL /admin/logout.
 */
app.post("/admin/logout", async (req, res) => {
  try {
    if (!req.session) {
      // 没有 session 直接返回成功
      return res.status(200).json({ message: "未登录或已登出", success: true });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("登出失败:", err);
        return res.status(500).json({ message: "登出失败", success: false });
      }
      console.log("登出成功");
      // 返回给前端成功信息
      res.status(200).json({ message: "已登出", success: true });
    });
  } catch (error) {
    console.error("登出接口异常:", error);
    res.status(500).json({ message: "服务器异常，登出失败", success: false });
  }
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname,
  );
});
