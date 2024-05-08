const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const mysql = require("mysql");
const ejs = require('ejs');
const bodyParser = require('body-parser');
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ayur",
});

const port = 3000;

app.use(
  session({
    secret: "e240cb53fc40db7e259ad5990a2c28d5b5705a50ba8d516145cbb9bac3a04973",
    resave: true,
    saveUninitialized: true,
    cookie:{secure:false}
  })
);

app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/")));
app.set('view engine', 'ejs');
const multer = require('multer');
const { error } = require("console");
const upload = multer();
app.use(upload.none());

const memberStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'images', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});


const pdfupload = multer({
  storage: memberStorage,
  limits: {
    fileSize: 1000000 * 10 // 10 MB
  },
  fileFilter: (req, file, callback) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const extname = path.extname(file.originalname);
    if (allowedExtensions.includes(extname.toLowerCase())) {
      callback(null, true);
    } else {
      callback(new Error('Only JPG, PNG, and PDF files are allowed'));
    }
  }
})



app.get("/", (req, res) => {
  res.render(__dirname + "/ayurweb");
});

app.get("/auth",(req,res)=>{
    res.render(__dirname+"/demo")
})

app.get("/signup",(req,res)=>{
    res.render(__dirname+"/registration")
})

app.get('/admin',(req,res)=>{
  console.log("admin",req.query)
  res.render(__dirname+"/admin")
})

app.post("/signup",(req,res)=>{
    name=req.body.name
    password=req.body.password
    email=req.body.email
    phone=req.body.phone
    if (name && password) {
        connection.query(
          "insert into Account(name,password,email,phone) value(?,?,?,?)",
          [name, password,email,phone],
          function (error, results, fields) {
            if (error) throw error;
            if (results.insertId> 0) {
              req.session.loggedin = true;
              req.session.username = name;
              req.session.userid=results.insertId
              console.log("userid",req.session.userid)
              res.redirect("/home");
            } else {
              res.send("error in creating Account");
            }
            res.end();
          }
        );
      } else {
        res.send("Please enter Username and Password!");
        res.end();
      }
})

const uploadI = multer().single('images')

app.post('/insertDoctor',uploadI ,(req,res)=>{
  console.log(req.body,req.file)
  res.end()
})

app.get('/insertProduct',(req,res)=>{
  console.log(req.query)
  res.end()
})

app.get('insertTreatment',(req,res)=>{
  console.log(req.query)
  res.end()
})

app.post("/auth", function (request, response) {
  let username = request.body.name;
  let password = request.body.password;
  console.log(username,password)
  if (username && password) {
    connection.query(
      "SELECT * FROM Account WHERE name = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          request.session.userid=results[0].id
          console.log("userid",request.session.userid)
          response.send(results)
         // response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});


app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.render(__dirname+"/ayur",{
        user:request.session.username
    })
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/login.css");
});
app.get("/profile", (req, res) => {
  
  res.render(__dirname+"/profile")
});

app.get("/ourdoctors", (req, res) => {
    connection.query(
        "SELECT * FROM doctors",
        function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                results.forEach(doctor => {
                    if (doctor.dimage) {
                        const imageData = doctor.dimage.toString('base64'); // Assuming dimage is a Buffer
                        doctor.dimageBase64 = `data:image/jpeg;base64,${imageData}`; // Prepend data URI
                    }
                });

                res.render(__dirname + "/doctors", {
                    data: results
                });
            } else {
                res.send("No doctors found!");
            }
            res.end();
        }
    );
});
app.get('/ayurvedatreatments',(req,res)=>{
  connection.query('select * from treatment',(error,results,fields)=>{
    if(error){
      res.render(__dirname+"/ayur/treatdemo",{
        data:"error in fetching data"
      })
    }else{
      if(results.length>0){
        res.render(__dirname+"/ayur/treatdemo",{
          data:results
        })
      }else{
        res.render(__dirname+"/ayur/treatdemo",{
          data:"No data to fetch"
        })
      }

    }
  })
  
})

app.get("/ayurvedicproducts",(req,res)=>{
  console.log("query ",req.query.query)
  console.log("request arrived..")
  if(req.query.query==undefined){
    console.log("request is undefined")
    connection.query('select * from products',(error,results,feilds)=>{
      if(error){
        res.send(error)
      }else{
        if(results.length>0){
          results.forEach(product => {  
            if (product.image) {
                const imageData = product.image.toString('base64'); // Assuming dimage is a Buffer
                product.dimageBase64 = `data:image/jpeg;base64,${imageData}`; // Prepend data URI
            }
        });
          res.render(__dirname+"/index",{
            data:results
          })
        }
      }
    })
  }else{
    console.log("request is not undefined")
    const query=req.query.query+"%"
    console.log(query)
    connection.query('SELECT * FROM products WHERE UPPER(pname) LIKE UPPER(?)',[query],(error,results,feilds)=>{
      if(error){
        res.send(error)
      }else{
        if(results.length>0){
          results.forEach(product => {  
            if (product.image) {
                const imageData = product.image.toString('base64'); // Assuming dimage is a Buffer
                product.dimageBase64 = `data:image/jpeg;base64,${imageData}`; // Prepend data URI
            }
        });
          res.render(__dirname+"/index",{
            data:results
          })
        }else{
          res.render(__dirname+"/index", {
            data:null
          })
        }
      }
    })
  }
 
})

app.get("/doctorappo",(req,res)=>{
    console.log(req.query.parameter)
    req.session.did=req.query.parameter;
    res.render(__dirname+"/doctorsappo")
})


app.get("/booking",(req,res)=>{
  connection.query('select * from treatment',(error,results,fields)=>{
    if(error){
      res.render(__dirname+"/ayur/booking",{
        data:"Error in fetching data"
      })
    }else{
      if(results.length>0){
        res.render(__dirname+"/ayur/booking",{
          data:results
        })
      }else{
        res.render(__dirname+"/ayur/booking",{
          data:"No data available"
        })
      }
    }
  })
  
})

app.post("/doctorsappo",(req,res)=>{
  const { date, utime, uname, ucontact, uemail,umessage } = req.body;
  console.log(req.body)
  var did=req.session.did
  var uid=req.session.userid
  connection.query(
    "INSERT INTO doctorBooking (bdate, btime, did, uid, message) VALUES (?, ?, ?, ?, ?)",
    [date, utime, did, uid, umessage],
    function (error, results, fields) {
        if (error) throw error;
        if (results.insertId > 0) {
            res.sendFile(__dirname+"/sucess.html")
        } else {
            res.send("No doctors found!");
        } 
    }
);
})

app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});
app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/script.js");
});
app.post("/userlist",(req,res)=>{
  console.log("service: ",req.body.service)
    connection.query(
    'select * from services where sname=? and oid=?',
    [req.body.service,req.session.service.id],
    function(error,results,fields){
      if(error) throw error;
      console.log("service",results[0].sid)
      if(results.length>0){
        req.session.serviceName=results[0].sid
      }else{
        req.session.serviceName=0;
      }
      res.sendStatus(200)
    }
  )
})
app.get("/userlist", (req, res) => {
  console.log(req.session.serviceName)
  connection.query(
    "SELECT * FROM Employee where qid=? and userid !=?",
    [req.session.serviceName,req.session.userid],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results)
      if (results.length > 0) {
        console.log("data fetched...",results.length)
        res.render(__dirname+"/userlist",{  
          data:results
        })
      } else {
       // res.send("error in database");
        res.render(__dirname+"/userlist",{
          data:results
        })
      }
      res.end();
    }
  );
});

app.get("/option", (req, res) => {
  connection.query(
    "SELECT * FROM options",
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        console.log("data fetched...",results.length)
        res.render(__dirname+"/option",{
          data:results
        })
      } else {
        res.send("error in database");
      }
      res.end();
    }
  );
});

app.post('/option',(req,res)=>{
  console.log(req.body.id)
  req.session.service=req.body
  res.redirect('/outdoor')
})

app.get("/outdoor", (req, res) => {
  console.log("connection called")
  connection.query(
    "SELECT * FROM services AS s, options AS o WHERE o.id = s.oid and o.id=?",
    [req.session.service.id],
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        console.log("data fetched...",results.length)
        res.render(__dirname+"/outdoor",{
          data:results
        })
      } else {
        res.send("error in database");
      }
      res.end();
    }
  );
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/karthikeyan.html");
});

app.post('/addservice',(req,res) => {
  var name=req.body.name
  var hour=req.body.hour
  var age=req.body.age
  var phone=req.body.phone
  var email=req.body.email
  var description=req.body.desc
  var salary=req.body.salary
  var eid=0;
  console.log(name,hour,age,phone,email,description,salary)
  if(name ==undefined && hour==undefined && age==undefined){
    connection.query('select * from Employee where userid=?',
    [req.session.userid],
    (error,results,fields)=>{
      if(error) throw error;
      console.log(results)
      eid=results[0].id
      if(results.insertId>0){
        res.sendStatus(200)
      }else{
        res.sendStatus(403)
      }
    })
  }else{
    connection.query('INSERT INTO Employee (name, phone, email, wage, description, hours, age,qid,userid) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)',
    [name,phone,email,salary,description,hour,age,req.session.serviceName,req.session.userid],
    (error,results,fields)=>{
      if(error) throw error;
      console.log(results)
      eid=results[0].id
      if(results.insertId>0){
        res.sendStatus(200)
      }else{
        res.sendStatus(403)
      }
    })
  } 
})

app.get("/addservice", (req, res) => {
  console.log(req.session.serviceName,"serviceName    ")
  connection.query(
    'select * from Employee where userid=? and qid=?',
    [req.session.userid,req.session.serviceName],(error,results,fields)=>{
      if(results.length>0){
        console.log("addsevive",results )
        res.render(__dirname + "/addservice",{
          data:results
        })
      }else{
        res.render(__dirname + "/addservice",{
          data:results
        })
      }
    }
  )
});
app.get("/addsuc", (req, res) => {
  res.sendFile(__dirname + "/addsuc.html");
});
app.get("/book", (req, res) => {
  connection.query(
    'select * from Employer where userid=?',
    [req.session.userid],(error,results,fields)=>{
      if(results.length>0){
        res.render(__dirname + "/book",{
          data:results
        })
      }else{
        res.render(__dirname + "/book",{
          data:results
        })
      }
    }
  )
});

app.post("/choice",(req,res)=>{
  var id=req.body.id
  req.session.employee=id;
  res.sendStatus(200)
})

app.post('/book',(req,res)=>{
  var name=req.body.name
  var address=req.body.address
  var phone=req.body.phone
  var eid=0;
  if(name==undefined&&address==undefined&&phone==undefined){
    connection.query(
      'select * from Employer where userid=?',
      [req.session.userid],(error,results,fields)=>{
        if(results.length>0){
          eid=results[0].id
          console.log("eid is set",eid)
          ExecuteBookingQuery(req,res,eid)
        }else{
          eid=0;
        }
      }
    )
  }else{
    connection.query('INSERT INTO Employer (name, phone, address,qid,userid) VALUES (?, ?, ?, ?, ?)',
    [name,phone,address,req.session.serviceName,req.session.userid],
    (error,results,fields)=>{
      if(error) throw error;
      console.log(results)
      if(results.insertId>0){
        eid=results.insertId;
        console.log("employer created")
        ExecuteBookingQuery(req,res,eid)
      }else{
        console.log("employer not created")
      }
    })
  }
  
})

function ExecuteBookingQuery(req,res,eid){
  connection.query('insert into booking(employee,employer) values (?,?)',
  [req.session.employee,eid],
  (error,results,fields)=>{
    if(error) throw error
    if(results.insertId>0){
      res.sendStatus(200)
    }else{
      res.sendStatus(403)
    }
  })
}

app.get("/booksuc", (req, res) => {
  res.sendFile(__dirname + "/booksuc.html");
});
app.use(express.static(path.join(__dirname, "")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});