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
  var sql = "select * from event"
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
app.get("/api/getclubname", (req, res, next) => {
  var sql = "select club_name from club where club_id="+req.body.club_id
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

app.get("/api/regs", (req, res, next) => {
  var count=0;
  var sql = "select * from registration where event_id="+req.query.event_id
  db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      rows.map(item=>{count=count+1})
      res.json({
          "message":"success",
          "count":count
      })
    });
});

app.get("/api/allevents/:id", (req, res, next) => {
  var sql = "select * from event where event_id = ?"
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
  var sql = "select club_id,club_name from club"
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

app.get("/api/eventdelete", (req, res, next) => {
  var sql = "UPDATE event SET is_deleted = true where event_id="+req.query.event_id
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

app.get("/api/getclublogo", (req, res, next) => {
  var sql = "select club_logo from club where club_id="+req.query.club_id
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
  var sql = "select * from (select event_id from registration where user_id = "+req.body.user_id+") where event_id = "+req.body.event_id
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
  var sql = 'INSERT INTO registration (user_id,event_id) VALUES ('+req.body.user_id+','+req.body.event_id+')'
  db.all(sql, (err, rows) => {
      if (err) {
        console.log(err.message)
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
  var sql = 'delete from registration where user_id='+req.body.user_id+' and event_id='+req.body.event_id
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
  var sql = "SELECT * FROM event WHERE club_id in (SELECT club_id FROM interested_club WHERE user_id in ("+req.query.user_id+")) and start_date >= date(\'now\')";
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
  var sql = "SELECT * FROM event WHERE added_by ="+req.query.user_id;
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
  var sql = "SELECT * FROM event WHERE event_id in (SELECT event_id FROM registration WHERE user_id in ("+req.query.user_id+"))";
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        console.log(err.message)
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
    var sql = "select * from user where user_id = ?"
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
  var sql ='INSERT INTO user (user_name, user_mail) VALUES (?,?)'
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
  
  var sql ='select * from user where user_mail=\''+req.body.user_mail+'\''
  response={user_id:0,is_new:false,is_org:false}
  
  db.get(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      if(result!=undefined){
        response.user_id=result.user_id
        if(result.is_organizer===0){response.is_org=false}
        else{response.is_org=true}
        db.get("select user_id from interested_club where user_id = "+result.user_id, (err, row) => {
          if (err) {
            res.status(400).json({"error":err.message});
            return;
          }
          if(row===undefined){
            response.is_new=true
            db.get('INSERT INTO user (user_name, user_mail, is_organizer) VALUES ('+req.body.name+','+req.body.email+',0)', (err, row) => {
              if (err) {
                //res.status(400).json({"error":err.message});
                return;
              }
            });

          }
          res.json({
            "message": "success",
            "id" : response.user_id,
            "is_new" : response.is_new,
            "is_org" : response.is_org,
          })        
        });
      }
      else{
        response.is_new=true
        response.is_org=false
        var sql='INSERT INTO user (user_name, user_mail, is_organizer) VALUES (\''+req.body.name+'\',\''+req.body.user_mail+'\',0)';
        db.all(sql, (err, row) => {
          if (err) {
            res.status(400).json({"error":err.message});
            return;
          }else{
            
          }
        });
        var sql2='select * from user where user_mail=\''+req.body.user_mail+'\''
        db.get(sql2,function (err, result){
          if (err){
            res.status(400).json({"error": err.message})
            return;
          }
          else{
            response.user_id=result.user_id
            res.json({
              "message": "success",
              "id" : response.user_id,
              "is_new" : response.is_new,
              "is_org" : response.is_org,
            }) 
          }
        });
        
      }
      
  });
  
  
  
})




app.post("/api/submitevent/", (req, res, next) => {
  console.log(req.body)
  db.run('delete from event where event_name=\''+req.body.event_name+'\'',function (err, result) {
  
  })

  var sql="INSERT INTO event (start_date,club_id,event_name,start_date,end_date,event_time,event_venue,event_type,event_desc,event_poster,event_link,event_paid,event_deadline,added_by,modification_date,is_deleted,is_modified,event_seat) VALUES ('15/4/2020',"+req.body.club_id+",\""+req.body.event_name+"\",\""+req.body.start_date+"\",\""+req.body.end_date+"\",\""+req.body.event_time+"\",\""+req.body.event_venue+"\",\""+req.body.event_type+"\",\""+req.body.event_desc+"\",\""+req.body.event_poster+"\",\""+req.body.event_link+"\","+req.body.event_paid+",\""+req.body.event_deadline+"\","+req.body.added_by+","+'15/4/2020'+","+req.body.is_deleted+","+true+","+req.body.event_seats+")"
  console.log(sql)
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
  var sql ='delete from interested_club where user_id='+req.body[0].user_id
  db.run(sql,function (err, result) {
    if(err){
          //res.status(400).json({"error": err.message})
          console.log("error"+ err.message);
          return;
        }
        
  });

  req.body.map((item)=>{
    var sql ='INSERT INTO interested_club (user_id, club_id) VALUES ('+item.user_id+','+item.club_id+')'
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