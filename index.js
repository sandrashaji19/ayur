const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});
const nodemailer = require('nodemailer');


app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false}
}));
const cors = require('cors');


app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const multer = require('multer');
const {error} = require('console');
const {send} = require('express/lib/response');
const e = require('express');


const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: path.join(__dirname, 'public', 'images'),
  filename: (req, file, cb) => {
    cb(null,
       file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});

const memberStorage = multer.diskStorage({
  // Destination to store image
  destination: path.join(__dirname, 'public', 'images'),
  filename: (req, file, cb) => {
    cb(null,
       file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});


const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 * 10  // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})

const pdfupload =
    multer({
      storage: memberStorage,
      limits: {
        fileSize: 1000000 * 10  // 10000000 Bytes = 10 MB
      },
      function(req, file, callback) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname);

        if (allowedExtensions.includes(extname.toLowerCase())) {
          callback(null, true);
        } else {
          callback(new Error('Only JPG, PNG, and PDF files are allowed'));
        }
      }
    }).fields([{name: 'images', maxCount: 1}])


app.get('/', (req, res) => {
  res.render(__dirname + '/root');
});

app.get('/auth', (req, res) => {
  console.log('GET /auth');
  res.render(__dirname + '/auth');
});


app.get('/signup', (req, res) => {
  console.log('GET /signup ')
  let data = {success: -1, message: ''};

  res.render(__dirname + '/registration', {data});
})

app.post('/signup', pdfupload, (req, res) => {
  console.log(req.body);
  let username = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phone = parseInt(req.body.phone, 10);
  let phonelength = req.body.phone.length;

  if (username === '') {
    let data = {success: 0, message: 'Username is invalid'};
    return res.render(__dirname + '/registration', {data});
  }

  if (password === '' || password.length < 8) {
    let data = {
      success: 0,
      message: 'Password needs to have minimum 10 characters'
    };
    return res.render(__dirname + '/registration', {data});
  }

  if (email === '' || !email.includes('@') || !email.includes('.com')) {
    let data = {success: 0, message: 'Email is invalid'};
    return res.render(__dirname + '/registration', {data});
  }

  if (phonelength !== 10) {
    let data = {success: 0, message: 'Phone number is invalid'};
    return res.render(__dirname + '/registration', {data});
  }

  connection.query(
      'SELECT * FROM account WHERE BINARY name = ?', [username],
      (error, results, fields) => {
        if (error) {
          let data = {success: 0, message: 'Database Error'};
          res.render(__dirname + '/registration', {data});
          throw error;
        } else {
          if (results.length > 0) {
            let data = {success: 0, message: 'User already exists'};
            return res.render(__dirname + '/registration', {data});
          } else {
            // Insertion code
            connection.query(
                'INSERT INTO account (name, password, email,phone,mode) VALUES (?, ?, ?, ?, "user")',
                [username, password, email, phone],
                (error, results, fields) => {
                  if (error) {
                    console.log(error);
                    let data = {
                      success: 0,
                      message: 'Error creating account',
                    };
                    res.render(__dirname + '/registration', {data});
                    return;
                  }

                  // Code for successful insertion
                  let data = {success: 1, message: 'Account created'};
                  res.render(__dirname + '/registration', {data});
                });
          }
        }
      });
});


  app.get('/admin',(req,res)=>{
    console.log('admin',req.query)
    res.render(__dirname+'/admin')
  })


  app.post('/insertDoctor',pdfupload ,(req,res)=>{
    console.log(req.body,req.files)
    connection.query('insert into doctors(dname,qualification,location,contact,contact,email,dimage) value(?,?,?,?,?,?,?)',
    [req.body.dname,req.body.qualification,req.body.location,req.body.contact,req.body.email,req.files.images[0].path],(error,results,fields)=>{
  if (error) {
    throw error
  } else {
    if (results.insertId > 0) {
      res.redirect('/admin')
    }
  }
    })
    //res.end()
  })

  app.post('/insertTreatment',pdfupload,(req,res)=>{
    console.log(req.body,req.files)
    connection.query('insert into treatment(tname,course,prize,description,image) value(?,?,?,?,?,?)',
    [req.body.tname,req.body.course,req.body.prize,req.body.description,req.files.images[0].path],(error,results,fields)=>{
  if (error) {
    throw error
  } else {
    if (results.insertId > 0) {
      res.redirect('/admin')
    }
  }
    })
  })

  app.post('/insertProduct',pdfupload,(req,res)=>{
    console.log(req.body,req.files)
    connection.query('insert into products(pname,prize,image,descrption,stock) value(?,?,?,?,?)',
    [req.body.pname,req.body.prize,req.files.images[0].path,req.body.description,req.body.stock],(error,results,fields)=>{
  if (error) {
    throw error
  } else {
    if (results.insertId > 0) {
      res.redirect('/admin')
    }
  }
    })
  })

    app.post('/auth', pdfupload, function(request, response) {
      let username = request.body.name;
      let password = request.body.password;

      if (username && password) {
        connection.query(
            'SELECT * FROM account WHERE BINARY name = ?', [username],
            function(error, results, fields) {
              if (error) {
                response.status(500).json({
                  success: false,
                  message: 'Database error occurred',
                  error: error
                });
                return;
              }

              if (results.length > 0) {
                connection.query(
                    'SELECT * FROM account WHERE BINARY name = ? AND BINARY password = ?',
                    [username, password], function(error, results, fields) {
                      if (error) {
                        response.status(500).json({
                          success: false,
                          message: 'Database error occurred',
                          error: error
                        });
                        return;
                      }

                      if (results.length > 0) {
                        request.session.loggedin = true;
                        request.session.username = username;
                        response.status(200).json(
                            {success: true, message: 'Login success'})
                      } else {
                        response.status(401).json(
                            {success: false, message: 'Incorrect password.'});
                      }
                      response.end();
                    });
              } else {
                response.status(401).json(
                    {success: false, message: 'Account does not exist.'});
                response.end();
              }
            });
      } else {
        response.status(400).json(
            {success: false, message: 'Please enter Username and Password!'});
        response.end();
      }
    });



    app.get('/home', function(request, response) {
      if (request.session.loggedin) {
        response.render(__dirname + '/home', {user: request.session.username})
      } else {
        response.send('Please login to view this page!');
      }
      response.end();
    });

    app.get('/css', (req, res) => {
      res.sendFile(__dirname + '/login.css');
    });
    app.get(
        '/profile',
        (req, res) => {

            res.render(__dirname + '/profile')});

    app.get('/ourdoctors', (req, res) => {
      connection.query(
          'SELECT * FROM doctors', function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
              results.forEach(doctor => {
                if (doctor.dimage) {
                  const imageData = doctor.dimage.toString(
                      'base64');  // Assuming dimage is a Buffer
                  doctor.dimageBase64 = `data:image/jpeg;base64,${
                      imageData}`;  // Prepend data URI
                }
              });

              res.render(__dirname + '/doctors', {data: results});
            } else {
              res.send('No doctors found!');
            }
            res.end();
          });
    });
    app.get(
        '/ayurvedatreatments',
        (req, res) => {connection.query(
            'select * from treatment',
            (error, results, fields) => {
              if (error) {
                res.render(
                    __dirname + '/ayur/treatdemo',
                    {data: 'error in fetching data'})
              } else {
                if (results.length > 0) {
                  res.render(__dirname + '/treatment', {data: results})
                } else {
                  res.render(
                      __dirname + '/treatment', {data: 'No data to fetch'})
                }
              }
            })

        })



    async function sendMail(recipientEmail, subject, text, html) {
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,  // Use secure connection (SSL/TLS)
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false  // Ignore certificate validation errors
        },
      });

      const mailOptions = {
        from: {name: 'Ayur', address: senderEmail},
        to: recipientEmail,
        subject: subject,
        text: text,  // Plain text content
        html: html   // HTML content (optional)
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    app.get(
        '/booktreatment', (req, res) => {res.render(__dirname + '/booking')})
    app.post('/booktreatment', pdfupload, (req, res) => {
      console.log(req.body)
      if (req.session.userid != undefined) {
        connection.query(
            'insert into treatmentBooking (uid,email,phone,treatment) value(?,?,?,?)',
            [
              req.session.userid, req.body.email, req.body.phone,
              req.body.treatment
            ],
            (error, results, feilds) => {
              if (error) {
                res.send(error)
              } else {
                console.log(results)
                if (results.insertId > 0) {
                  const recipientEmail = req.body.email;
                  const subject = 'You have booked a treatment from our site ';
                  const text = 'Ayur Vedic healing .';
                  const html =
                      `<h1>Test Email</h1><p>Teatment time will be discussed later.</p>`;
                  console.log('sending Mail...')
                  sendMail(recipientEmail, subject, text, html)
                  res.send('Booking created a email will be send')
                }
                else {
                  res.send('No booking happened..')
                }
              }
            })
      }
      else {
        res.send('Create a Account')
      }
    })

    app.get('/bookingProducts', (req, res) => {console.log()})

    app.get('/ayurvedicproducts', (req, res) => {
      console.log('query ', req.query.query)
      console.log('request arrived..')
      if (req.query.query == undefined) {
        console.log('request is undefined')
        connection.query('select * from products', (error, results, feilds) => {
          if (error) {
            res.send(error)
          } else {
            if (results.length > 0) {
              results.forEach(product => {
                if (product.image) {
                  const imageData = product.image.toString(
                      'base64');  // Assuming dimage is a Buffer
                  product.dimageBase64 = `data:image/jpeg;base64,${
                      imageData}`;  // Prepend data URI
                }
              });
              res.render(__dirname + '/products', {data: results})
            }
          }
        })
      }
      else {
        console.log('request is not undefined')
        const query = req.query.query + '%'
        console.log(query)
        connection.query(
            'SELECT * FROM products WHERE UPPER(pname) LIKE UPPER(?)', [query],
            (error, results, feilds) => {
              if (error) {
                res.send(error)
              } else {
                if (results.length > 0) {
                  results.forEach(product => {
                    if (product.image) {
                      const imageData = product.image.toString(
                          'base64');  // Assuming dimage is a Buffer
                      product.dimageBase64 = `data:image/jpeg;base64,${
                          imageData}`;  // Prepend data URI
                    }
                  });
                  res.render(__dirname + '/products', {data: results})
                } else {
                  res.render(__dirname + '/products', {data: null})
                }
              }
            })
      }
    })

    app.get('/doctorappo', (req, res) => {
      console.log(req.query.parameter)
      req.session.did = req.query.parameter;
      res.render(__dirname + '/doctorsappo')
    })


    app.get(
        '/booking',
        (req, res) => {connection.query(
            'select * from treatment',
            (error, results, fields) => {
              if (error) {
                res.render(
                    __dirname + '/ayur/booking',
                    {data: 'Error in fetching data'})
              } else {
                if (results.length > 0) {
                  res.render(__dirname + '/booking', {data: results})
                } else {
                  res.render(
                      __dirname + '/booking', {data: 'No data available'})
                }
              }
            })

        })

    app.post('/doctorsappo', (req, res) => {
      const {date, utime, uname, ucontact, uemail, umessage} = req.body;
      console.log(req.body)
      var did = req.session.did
      var uid = req.session.userid
      connection.query(
          'INSERT INTO doctorBooking (bdate, btime, did, uid, message) VALUES (?, ?, ?, ?, ?)',
          [date, utime, did, uid, umessage], function(error, results, fields) {
            if (error) throw error;
            if (results.insertId > 0) {
              res.sendFile(__dirname + '/sucess.html')
            } else {
              res.send('No doctors found!');
            }
          });
    })

    app.get('/style.css', (req, res) => {
      res.sendFile(__dirname + '/style.css');
    });
    app.get('/script.js', (req, res) => {
      res.sendFile(__dirname + '/script.js');
    });
  app.post('/userlist',(req,res)=>{
    console.log('service: ',req.body.service)
      connection.query(
      'select * from services where sname=? and oid=?',
      [req.body.service,req.session.service.id],
      function(error,results,fields){
  if (error) throw error;
  console.log('service', results[0].sid)
  if (results.length > 0) {
    req.session.serviceName = results[0].sid
  }
  else {
    req.session.serviceName = 0;
  }
  res.sendStatus(200)
      }
    )
  })
      app.get('/userlist', (req, res) => {
        console.log(req.session.serviceName)
        connection.query(
            'SELECT * FROM Employee where qid=? and userid !=?',
            [req.session.serviceName, req.session.userid],
            function(error, results, fields) {
              if (error) throw error;
              console.log(results)
              if (results.length > 0) {
                console.log('data fetched...', results.length)
                res.render(__dirname + '/userlist', {data: results})
              }
              else {// res.send("error in database");
                    res.render(
                        __dirname + '/userlist', {data: results})} res.end();
            });
      });

      app.get('/option', (req, res) => {
        connection.query(
            'SELECT * FROM options', function(error, results, fields) {
              if (error) throw error;
              if (results.length > 0) {
                console.log('data fetched...', results.length)
                res.render(__dirname + '/option', {data: results})
              } else {
                res.send('error in database');
              }
              res.end();
            });
      });

  app.post('/option',(req,res)=>{
    console.log(req.body.id)
  req.session.service = req.body
    res.redirect('/outdoor')
  })

    app.get('/outdoor', (req, res) => {
      console.log('connection called')
      connection.query(
          'SELECT * FROM services AS s, options AS o WHERE o.id = s.oid and o.id=?',
          [req.session.service.id], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
              console.log('data fetched...', results.length)
              res.render(__dirname + '/outdoor', {data: results})
            } else {
              res.send('error in database');
            }
            res.end();
          });
    });

    app.get('/home', (req, res) => {
      res.sendFile(__dirname + '/karthikeyan.html');
    });

    app.post('/addservice', (req, res) => {
      var name = req.body.name
      var hour = req.body.hour
      var age = req.body.age
      var phone = req.body.phone
      var email = req.body.email
      var description = req.body.desc
      var salary = req.body.salary
      var eid = 0;
      console.log(name, hour, age, phone, email, description, salary)
      if (name == undefined && hour == undefined && age == undefined) {
        connection.query(
            'select * from Employee where userid=?', [req.session.userid],
            (error, results, fields) => {
              if (error) throw error;
              console.log(results)
              eid = results[0].id
              if (results.insertId > 0) {
                res.sendStatus(200)
              }
              else {
                res.sendStatus(403)
              }
            })
      }
      else {
        connection.query(
            'INSERT INTO Employee (name, phone, email, wage, description, hours, age,qid,userid) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)',
            [
              name, phone, email, salary, description, hour, age,
              req.session.serviceName, req.session.userid
            ],
            (error, results, fields) => {
              if (error) throw error;
              console.log(results)
              eid = results[0].id
              if (results.insertId > 0) {
                res.sendStatus(200)
              }
              else {
                res.sendStatus(403)
              }
            })
      }
    })

  app.get('/addservice', (req, res) => {
    console.log(req.session.serviceName,'serviceName    ')
    connection.query(
      'select * from Employee where userid=? and qid=?',
      [req.session.userid,req.session.serviceName],(error,results,fields)=>{
  if (results.length > 0) {
    console.log('addsevive', results)
    res.render(__dirname + '/addservice', {data: results})
  } else {
    res.render(__dirname + '/addservice', {data: results})
  }
      }
    )
  });
    app.get('/addsuc', (req, res) => {
      res.sendFile(__dirname + '/addsuc.html');
    });
    app.get(
        '/book',
        (req, res) => {connection.query(
            'select * from Employer where userid=?', [req.session.userid],
            (error, results, fields) => {
              if (results.length > 0) {
                res.render(__dirname + '/book', {data: results})
              } else {
                res.render(__dirname + '/book', {data: results})
              }
            })});

    app.post('/choice', (req, res) => {
      var id = req.body.id
      req.session.employee = id;
      res.sendStatus(200)
    })

    app.post('/book', (req, res) => {
      var name = req.body.name
      var address = req.body.address
      var phone = req.body.phone
      var eid = 0;
      if (name == undefined && address == undefined && phone == undefined) {
        connection.query(
            'select * from Employer where userid=?', [req.session.userid],
            (error, results, fields) => {
              if (results.length > 0) {
                eid = results[0].id
                console.log('eid is set', eid)
                ExecuteBookingQuery(req, res, eid)
              } else {
                eid = 0;
              }
            })
      } else {
        connection.query(
            'INSERT INTO Employer (name, phone, address,qid,userid) VALUES (?, ?, ?, ?, ?)',
            [name, phone, address, req.session.serviceName, req.session.userid],
            (error, results, fields) => {
              if (error) throw error;
              console.log(results)
              if (results.insertId > 0) {
                eid = results.insertId;
                console.log('employer created')
                ExecuteBookingQuery(req, res, eid)
              }
              else {
                console.log('employer not created')
              }
            })
      }
    })

    function ExecuteBookingQuery(req, res, eid) {
      connection.query(
          'insert into booking(employee,employer) values (?,?)',
          [req.session.employee, eid], (error, results, fields) => {
            if (error) throw error
              if (results.insertId > 0) {
                res.sendStatus(200)
              }
            else {
              res.sendStatus(403)
            }
          })
    }

    app.get('/booksuc', (req, res) => {
      res.sendFile(__dirname + '/booksuc.html');
    });
    app.use(express.static(path.join(__dirname, '')));

    app.listen(process.env.PORT, process.env.HOST, () => {
      console.log(`Example app listening on port ${process.env.PORT}`);
    });

    app.get('/logout', (req, res) => {req.session.destroy((err) => {
                         if (err) {
                           res.sendStatus(500);
                         } else {
                           res.sendStatus(200);
                         }
                       })});

    app.get('/payment', (req, res) => {
      res.sendFile(__dirname + '/payment.html');
    })

    app.post('/payment', (req, res) => {
      console.log('body is ', req.body);
      pname = req.body.pname;
      req.session.pid = req.body.pid;
      req.session.pname = pname;
      req.session.pimage = req.body.pimage;
      console.log('pname is ', req.session.pname);
      res.sendStatus(200);
    })

    app.post('/addbooking', (req, res) => {
      connection.query(
          'INSERT into booking (pid,pname,pimage,userid) VALUES(?,?,?,?)',
          [
            req.session.pid, req.session.pname, req.session.pimage,
            req.session.userid
          ],
          (error, results, fields) => {
            if (error) {
              console.error(error);
            } else {
              res.send('Sucess');
            }
          });
    })