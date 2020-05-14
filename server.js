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

app.get("/api/getinterest", (req, res, next) => {
  var sql = "select club_id from interested_club where user_id="+req.query.user_id
  db.all(sql,(err, rows) => {
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

app.post("/api/getregs", (req, res, next) => {
  var sql = "select * from (select event_id from user_register_event_details where user_id = "+req.body.user_id+") where event_id = "+req.body.event_id
  var reg;
  db.all(sql, (err, rows) => {
      if(err){
        res.status(400).json({"error":err.message});
        return;
      }
      if(rows[0]!=undefined){reg=true}
      else{reg=false}
      res.json({"message":"success","reg":reg})

    });
});



app.post("/api/eventregister", (req, res, next) => {
  
  //console.log(req.body)

  var sql = 'INSERT INTO user_register_event_details (user_id,event_id) VALUES ('+req.body.user_id+','+req.body.event_id+')'
  console.log(sql)
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

app.post("/api/unregister", (req, res, next) => {
  
  //console.log(req.body)

  var sql = 'delete from user_register_event_details where user_id='+req.body.user_id+' and event_id='+req.body.event_id
  console.log(sql)
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
  var sql = "SELECT * FROM event_details WHERE club_id in (SELECT club_id FROM interested_club WHERE user_id in ("+req.query.user+")) and start_date >= date(\'now\')";
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

app.get("/api/addedevents", (req, res, next) => {
  var sql = "SELECT * FROM event_details WHERE added_by in (SELECT organizer_id FROM organizer_details WHERE user_id in ("+req.query.user+"))";
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
  var sql = "SELECT * FROM event_details WHERE event_id in (SELECT event_id FROM user_register_event_details WHERE user_id in ("+req.query.user+")) and start_date>= date(\'now\')";
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
  var sql ='INSERT INTO user_details (name, user_mail_id) VALUES (?,?)'
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



app.post("/api/userauth/", (req, res, next) => {
  
  var sql ='select * from user_details where user_mail=\''+req.body.email+'\''
  response={user_id:0,isNew:false,isOrg:false}
  
  db.get(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      if(result!=undefined){
        response.user_id=result.user_id
        if(result.isOrganizer===0){response.isOrg=false}
        else{response.isOrg=true}
        db.get("select user_id from interested_club where user_id = "+response.user_id, (err, row) => {
          if (err) {
            res.status(400).json({"error":err.message});
            return;
          }
          if(row===undefined){
            response.isNew=true
            var sql ='INSERT INTO interested_club (user_id, club_id) VALUES ('+item.cur_user+','+item.club_id+')'
            db.get('INSERT INTO user_details (user_name, user_mail, isOrganizer, logged) VALUES ('+req.body.name+','+req.body.email+',0,true)', (err, row) => {
              if (err) {
                res.status(400).json({"error":err.message});
                return;
              }
            });

          }
          res.json({
            "message": "success",
            "id" : response.user_id,
            "isNew" : response.isNew,
            "isOrg" : response.isOrg,
          })        
        });
      }
      
  });
  
  
  
})

app.post("/api/submitevent/", (req, res, next) => {
  var errors=[]
  //console.log(req.body)

  var sql="INSERT INTO event_details (club_id,event_name,start_date,end_date,event_time,event_venue,event_type,event_desc,event_poster,event_reg_link,event_paid,event_reg_deadline,added_by,is_deleted) VALUES ("+req.body.club+",\""+req.body.name+"\",\""+req.body.start_date+"\",\""+req.body.end_date+"\",\""+req.body.time+"\",\""+req.body.venue+"\",\""+req.body.type+"\",\""+req.body.desc+"\",\""+req.body.poster+"\",\""+req.body.link+"\","+req.body.paid+",\""+req.body.deadline+"\","+req.body.added_by+","+req.body.isDeleted+")"
  db.run(sql,function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          console.log("error"+ err.message);
          return;
      }
      res.json({
        "message": "success"
      })
    })
    
  
})

app.post("/api/submitclub/", (req, res, next) => {
  var sql ='delete from interested_club where user_id='+req.body[0].cur_user
  db.run(sql,function (err, result) {
    if(err){
          //res.status(400).json({"error": err.message})
          console.log("error"+ err.message);
          return;
        }
        
  });

  req.body.map((item)=>{
    var sql ='INSERT INTO interested_club (user_id, club_id) VALUES ('+item.cur_user+','+item.club_id+')'
    errflag=false
    db.run(sql,function (err, result) {
      if(err){
            //res.status(400).json({"error": err.message})
            //console.log("error"+ err.message);
            errflag=true
            return;
          }
          
    });
  })
  if(errflag){
    res.status(400).json({"error": err.message})
    console.log("error"+ err.message);
  }
  else{
    res.json({
      "message": "success",
    })
  }
})


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});