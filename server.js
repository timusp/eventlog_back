// Create express app
var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./db.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST']
  }));


// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

app.get("/api/users", (req, res, next) => {
    var sql = "select * from user_details"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

app.get("/api/allevents", (req, res, next) => {
  var sql = "select * from event_details"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/allevents/:id", (req, res, next) => {
  var sql = "select * from event_details where event_id = ?"
  var params = [req.params.id]
  
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});


app.get("/api/getclubs", (req, res, next) => {
  var sql = "select club_id,club_name from club_details"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/myevents", (req, res, next) => {
  var sql = "SELECT * FROM event_details WHERE club_id in (SELECT club_id FROM interested_club WHERE user_id in ("+req.query.user+")) and event_date >= date(\'now\')";
  var params = [];
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/regevents", (req, res, next) => {
  //console.log(req.query.user);
  var sql = "SELECT * FROM event_details WHERE event_id in (SELECT event_id FROM user_register_event_details WHERE user_id in ("+req.query.user+")) and event_date>= date(\'now\')";
  //console.log(sql)
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});


app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from user where userid = ?"
    var params = [req.params.id]
    
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

app.get("/api/org_flag/:id", (req, res, next) => {
  var sql = "select * from user where userid = ?"
  var params = [req.params.id]
  
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

app.post("/api/user/", (req, res, next) => {
  var errors=[]

  //console.log(req.body);
  if (!req.body.name){
    errors.push("No name specified");
  }
  if (!req.body.email){
    errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email
  }
  //console.log(data.name);
  var sql ='INSERT INTO user (name, mailId) VALUES (?,?)'
  var params =[data.name, data.email]
  
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
  
})


app.post("/api/submitclub/", (req, res, next) => {
  var errors=[]

  console.log(req.body);
  /*if (!req.body.name){
    errors.push("No name specified");
  }
  if (!req.body.email){
    errors.push("No email specified");
  }*/
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = req.body;
  
  /*data.map((item)=>{
    var sql ='INSERT INTO interested_club (user_id, club_id) VALUES (?,?)'
    var params =[item.cur_user, item.club_id]
*/
   /* db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            console.log("error"+ err.message);
            return;
        }
        
    });
    
  })
  res.json({
    "message": "success",
    "data": data,
    "id" : this.lastID
  })
    */
  
})





// Default response for any other request
app.use(function(req, res){
    res.status(404);
});