const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const mysql = require('mysql');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});
var cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
const argon2 = require('argon2');

async function hashPass(password) {
  try {
    hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.log('hashPassword(): Error : ', err);
  }
}

async function hashVerify(password, dbhash) {
  try {
    if (await argon2.verify(dbhash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log('hashVerify(): Error: ', err);
  }
}

key = process.env.KEY;
function encrypt(inputString) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const ciphertext = CryptoJS.AES
                         .encrypt(inputString, keyWordArray, {
                           iv: keyWordArray,
                         })
                         .toString();
  return ciphertext;
}

function decrypt(encryptedString) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const bytes = CryptoJS.AES.decrypt(encryptedString, keyWordArray, {
    iv: keyWordArray,
  });
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false},
}));
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());
const multer = require('multer');
const {table} = require('console');
const {attachment} = require('express/lib/response');
app.use(cookieParser());
require('console');
require('express/lib/response');

const memberStorage = multer.diskStorage({
  // Destination to store image
  destination: path.join(__dirname, 'public', 'images', 'doctors'),
  filename: (req, file, cb) => {
    cb(null,
       `doctors` +
           '_' + Date.now() + path.extname(file.originalname));
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const treatmentStorage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'images', 'treatments'),
  filename: (req, file, cb) => {
    cb(null,
       `treatments` +
           `_` + Date.now() + path.extname(file.originalname));
  },
});

const productStorage = multer.diskStorage({
  destination: path.join(__dirname, 'public', 'images', 'products'),
  filename: (req, file, cb) => {
    cb(null,
       `products` +
           `_` + Date.now() + path.extname(file.originalname));
  },
});

const pdfupload =
    multer({
      storage: memberStorage,
      limits: {
        fileSize: 1000000 * 10,  // 10000000 Bytes = 10 MB
      },
      function(req, file, callback) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname);

        if (allowedExtensions.includes(extname.toLowerCase())) {
          callback(null, true);
        } else {
          callback(new Error('Only JPG, PNG, and PDF files are allowed'));
        }
      },
    }).fields([{name: 'images', maxCount: 1}]);

const treatmentsUpload =
    multer({
      storage: treatmentStorage,
      limits: {fileSize: 1000000 * 10},
      function(req, file, callback) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname);

        if (allowedExtensions.includes(extname.toLocaleLowerCase())) {
          callback(null, true);
        } else {
          callback(new Error('Only JPG, PNG, and PDF files are allowed'));
        }
      },
    }).fields([{name: 'images', maxCount: 1}]);

const productsUpload =
    multer({
      storage: productStorage,
      limits: {fileSize: 1000000 * 10},
      function(req, file, callback) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname);

        if (allowedExtensions.includes(extname.toLocaleLowerCase())) {
          callback(null, true);
        } else {
          callback(new Error('Only JPG, PNG, and PDF files are allowed'));
        }
      },
    }).fields([{name: 'images', maxCount: 1}]);

app.get('/', (req, res) => {
  if (!req.cookies.user) {
    res.render(__dirname + '/root');
  } else {
    res.redirect('/home');
  }
});

app.get('/auth', (req, res) => {
  console.log('GET /auth');
  if (!req.cookies.user) {
    res.render(__dirname + '/auth');
  } else {
    console.log('GET /home');
    res.redirect('/home');
  }
});

app.get('/signup', (req, res) => {
  console.log('GET /signup ');
  if (!req.cookies.user) {
    let data = {success: -1, message: ''};
    res.render(__dirname + '/registration', {data});
  } else {
    res.send('Please logout first!');
  }
});

app.post('/signup', pdfupload, (req, res) => {
  console.log(req.body);
  let username = req.body.name;
  let realname = req.body.realname;
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
      message: 'Password needs to have minimum 10 characters',
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
            (async () => {
              passwordHash = await hashPass(password);
              connection.query(
                  'INSERT INTO account (name, password, email,phone,realname,mode) VALUES (?, ?, ?, ?, ?, "user")',
                  [username, passwordHash, email, phone, realname],
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
            })();
          }
        }
      });
});

app.get('/admin', async (req, res) => {
  console.log('GET /admin');
  let mode = (await decrypt(req.cookies.mode)) === 'admin' ? true : false;
  console.log(mode);
  if (mode) {
    res.render(__dirname + '/admin');
  } else {
    res.sendStatus(403);
  }
});

app.post('/insertDoctor', pdfupload, (req, res) => {
  console.log(req.body, req.files);
  connection.query(
      'insert into doctors(dname,qualification,location,contact,email,dimage) value(?,?,?,?,?,?)',
      [
        req.body.dname, req.body.qualification, req.body.location,
        req.body.contact, req.body.email,
        path.join('images', 'doctors', req.files.images[0].filename)
      ],
      (error, results, fields) => {
        if (error) {
          console.log('POST: /insertDoctor : Error: ', error);
          res.json({success: false});
        } else {
          if (results.insertId > 0) {
            res.json({success: true});
          }
        }
      });
  // res.end()
});

app.post('/updateDoctor', pdfupload, (req, res) => {
  console.log('body is ', req.body);
  console.log('did is ', req.body.id);
  connection.query(
      'UPDATE doctors set dname=?, qualification=?, location=?, contact=?,email=? where did=?',
      [
        req.body.dname,
        req.body.qualification,
        req.body.location,
        req.body.contact,
        req.body.email,
        req.body.id,
      ],
      async (error, results, fields) => {
        console.log(results);
        if (results.affectedRows > 0) {
          function getOldIMG() {
            return new Promise((resolve, reject) => {
              connection.query(
                  'SELECT dimage from doctors where did=?', [req.body.id],
                  (err, res) => {
                    imgPATH = path.join(
                        __dirname, 'public', res[0].dimage.toString('utf-8'));
                    resolve(imgPATH);
                  });
            });
          }
          imgPATH = await getOldIMG();
          console.log('imgpath is ', imgPATH);

          fs.unlink(imgPATH, (err) => {
            if (err) {
              console.log(
                  'POST /updateDoctor : Error: Error deleting image: ', err);
            }
          });

          connection.query(
              'UPDATE doctors set dimage=? where did=?',
              [
                path.join('images', 'doctors', req.files.images[0].filename),
                req.body.id,
              ],
              (error) => {
                if (!error) {
                  res.json({success: true});
                } else {
                  res.json({
                    success: false,
                    message: 'Failed to update row. Refreshing page...',
                  });
                }
              });
        } else {
          res.json({
            success: false,
            message:
                'A doctor with the given id was not found. Refreshing the page...',
          });
        }
      });
});

app.post('/deleteDoctor', pdfupload, (req, res) => {
  console.log('body is ', req.body);
  connection.query(
      'SELECT * from doctors where did=?', [req.body.id], (error, results) => {
        if (error) {
          console.log('POST: /deleteDoctor: Error: ', error);
        } else {
          if (results[0]) {
            console.log('dimage is ', results[0].dimage.toString('utf-8'));
            imgPATH = path.join(
                __dirname, 'public', results[0].dimage.toString('utf-8'));
            function deleteIMG(imgPATH) {
              return new Promise((resolve, reject) => {
                fs.unlink(imgPATH, (err) => {
                  console.log('imgPATH is ', imgPATH);
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
            }

            deleteIMG(imgPATH)
                .then(() => {
                  connection.query(
                      'DELETE FROM doctors where did=?', [req.body.id],
                      (err) => {
                        if (err) {
                          console.log('POST: /deleteDoctor: Error: ', err);
                          res.json({
                            success: false,
                            message: 'Failed to delete row from doctors',
                          });
                        } else {
                          res.json({success: true});
                        }
                      });
                })
                .catch((err) => {
                  console.log(
                      'POST /deleteDoctor: Error: Failed to delete image: ',
                      err);
                  res.json({
                    success: false,
                    message: 'Failed to delete associated data',
                  });
                });
          } else {
            res.json({
              success: false,
              message:
                  'A doctor with the given id was not found. Refreshing the page...',
            });
          }
        }
      });
});

app.post('/displayList', (req, res) => {
  console.log('GET /displayList');
  console.log(req.body);
  ({choice} = req.body);
  console.log('choice is ', choice);
  connection.query(`SELECT * FROM ${choice} `, (error, results, fields) => {
    if (error) {
      console.log('GET /displayList : Error : ', error);
    } else {
      res.json({success: true, data: results});
    }
  });
});

app.post('/insertTreatment', treatmentsUpload, (req, res) => {
  console.log(req.body, req.files);
  connection.query(
      'INSERT INTO treatment(tname,prize,description,image) values(?,?,?,?)',
      [
        req.body.tname,
        req.body.prize,
        req.body.description,
        path.join('images', 'treatments', req.files.images[0].filename),
      ],
      (error, results, fields) => {
        if (error) {
          console.log('POST: /insertTreatment : Error: ', error);
          res.json({success: false});
        } else {
          if (results.insertId > 0) {
            res.json({success: true});
          }
        }
      });
});

app.post('/updateTreatment', treatmentsUpload, (req, res) => {
  console.log('body is ', req.body);
  console.log('did is ', req.body.id);
  connection.query(
      'UPDATE treatment set tname=?, prize=?, description=? where tid=?',
      [req.body.tname, req.body.prize, req.body.description, req.body.id],
      async (error, results, fields) => {
        console.log(results);
        if (results.affectedRows > 0) {
          function getOldIMG() {
            return new Promise((resolve, reject) => {
              connection.query(
                  'SELECT image from treatment where tid=?', [req.body.id],
                  (err, res) => {
                    imgPATH = path.join(__dirname, 'public', res[0].image);
                    resolve(imgPATH);
                  });
            });
          }
          imgPATH = await getOldIMG();
          console.log('imgpath is ', imgPATH);

          fs.unlink(imgPATH, (err) => {
            if (err) {
              console.log(
                  'POST /updateTreatment : Error: Error deleting image: ', err);
            }
          });

          connection.query(
              'UPDATE treatment set image=? where tid=?',
              [
                path.join('images', 'treatments', req.files.images[0].filename),
                req.body.id,
              ],
              (error) => {
                if (!error) {
                  res.json({success: true});
                } else {
                  res.json({
                    success: false,
                    message: 'Failed to update row. Refreshing page...',
                  });
                }
              });
        } else {
          res.json({
            success: false,
            message:
                'A treatment with the given id was not found. Refreshing the page...',
          });
        }
      });
});

app.post('/deleteTreatment', treatmentsUpload, (req, res) => {
  console.log('body is ', req.body);
  connection.query(
      'SELECT * from treatment where tid=?', [req.body.id],
      (error, results) => {
        if (error) {
          console.log('POST: /deleteTreatment: Error: ', error);
        } else {
          if (results[0]) {
            console.log('image is ', results[0].image);
            imgPATH = path.join(__dirname, 'public', results[0].image);
            function deleteIMG(imgPATH) {
              return new Promise((resolve, reject) => {
                fs.unlink(imgPATH, (err) => {
                  console.log('imgPATH is ', imgPATH);
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
            }

            deleteIMG(imgPATH)
                .then(() => {
                  connection.query(
                      'DELETE FROM treatment where tid=?', [req.body.id],
                      (err) => {
                        if (err) {
                          console.log('POST: /deleteTreatment: Error: ', err);
                          res.json({
                            success: false,
                            message: 'Failed to delete row from treatment',
                          });
                        } else {
                          res.json({success: true});
                        }
                      });
                })
                .catch((err) => {
                  console.log(
                      'POST /deleteTreatment: Error: Failed to delete image: ',
                      err);
                  res.json({
                    success: false,
                    message: 'Failed to delete associated data',
                  });
                });
          } else {
            res.json({
              success: false,
              message:
                  'A treatment with the given id was not found. Refreshing the page...',
            });
          }
        }
      });
});

app.post('/insertProduct', productsUpload, (req, res) => {
  console.log(req.body, req.files);
  connection.query(
      'insert into products(pname,prize,image,descrption,stock) value(?,?,?,?,?)',
      [
        req.body.pname,
        req.body.prize,
        path.join('images', 'products', req.files.images[0].filename),
        req.body.description,
        req.body.stock,
      ],
      (error, results, fields) => {
        if (error) {
          console.log('POST: /insertProduct : Error: ', error);
          res.json({success: false});
        } else {
          if (results.insertId > 0) {
            res.json({success: true});
          }
        }
      });
});

app.post('/updateProduct', productsUpload, (req, res) => {
  console.log('body is ', req.body);
  console.log('did is ', req.body.id);
  connection.query(
      'UPDATE products set pname=?, prize=?, descrption=?, stock=? where pid=?',
      [
        req.body.pname,
        req.body.prize,
        req.body.description,
        req.body.stock,
        req.body.id,
      ],
      async (error, results, fields) => {
        console.log(results);
        if (results.affectedRows > 0) {
          function getOldIMG() {
            return new Promise((resolve, reject) => {
              connection.query(
                  'SELECT image from products where pid=?', [req.body.id],
                  (err, res) => {
                    imgPATH = path.join(
                        __dirname, 'public', res[0].image.toString('utf-8'));
                    resolve(imgPATH);
                  });
            });
          }
          imgPATH = await getOldIMG();
          console.log('imgpath is ', imgPATH);

          fs.unlink(imgPATH, (err) => {
            if (err) {
              console.log(
                  'POST /updateProduct : Error: Error deleting image: ', err);
            }
          });

          connection.query(
              'UPDATE products set image=? where pid=?',
              [
                path.join('images', 'products', req.files.images[0].filename),
                req.body.id,
              ],
              (error) => {
                if (!error) {
                  res.json({success: true});
                } else {
                  res.json({
                    success: false,
                    message: 'Failed to update row. Refreshing page...',
                  });
                }
              });
        } else {
          res.json({
            success: false,
            message:
                'A product with the given id was not found. Refreshing the page...',
          });
        }
      });
});

app.post('/deleteProduct', productsUpload, (req, res) => {
  console.log('body is ', req.body);
  connection.query(
      'SELECT * from products where pid=?', [req.body.id], (error, results) => {
        if (error) {
          console.log('POST: /deleteProduct: Error: ', error);
        } else {
          if (results[0]) {
            console.log('image is ', results[0].image);
            imgPATH = path.join(
                __dirname, 'public', results[0].image.toString('utf-8'));
            function deleteIMG(imgPATH) {
              return new Promise((resolve, reject) => {
                fs.unlink(imgPATH, (err) => {
                  console.log('imgPATH is ', imgPATH);
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
            }

            deleteIMG(imgPATH)
                .then(() => {
                  connection.query(
                      'DELETE FROM products where pid=?', [req.body.id],
                      (err) => {
                        if (err) {
                          console.log('POST: /deleteProduct: Error: ', err);
                          res.json({
                            success: false,
                            message: 'Failed to delete row from products',
                          });
                        } else {
                          res.json({success: true});
                        }
                      });
                })
                .catch((err) => {
                  console.log(
                      'POST /deleteProduct: Error: Failed to delete image: ',
                      err);
                  res.json({
                    success: false,
                    message: 'Failed to delete associated data',
                  });
                });
          } else {
            res.json({
              success: false,
              message:
                  'A product with the given id was not found. Refreshing the page...',
            });
          }
        }
      });
});

app.post('/auth', pdfupload, function(request, response) {
  let username = request.body.name;
  let password = request.body.password;

  if (username && password) {
    connection.query(
        'SELECT * FROM account WHERE BINARY name = ?', [username],
        async function(error, results, fields) {
          if (error) {
            response.status(500).json({
              success: false,
              message: 'Database error occurred',
              error: error,
            });
            return;
          }

          if (results.length > 0) {
            (async () => {
              verifyStatus = await hashVerify(password, results[0].password);
              if (verifyStatus) {
                response.cookie('user', await encrypt(username), {
                  maxAge: 604800000,
                  httpOnly: true,
                  sameSite: 'strict',
                });

                connection.query(
                    'SELECT id,mode from account where name = ?', [username],
                    async (error, results) => {
                      if (error) {
                        console.log('POST /auth: Error: ', error);
                      } else {
                        response.cookie(
                            'uid', await encrypt(String(results[0].id)), {
                              maxAge: 604800000,
                              httpOnly: true,
                              sameSite: 'strict',
                            });
                        response.cookie(
                            'mode', await encrypt(results[0].mode), {
                              maxAge: 604800000,
                              httpOnly: true,
                              sameSite: 'strict',
                            });
                        response.status(200).json(
                            {success: true, message: 'Login success'});
                      }
                      response.end();
                    });
              } else {
                response.status(401).json(
                    {success: false, message: 'Incorrect password.'});
                response.end();
              }
            })();
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

app.get('/home', async function(request, response) {
  if (request.cookies.user) {
    response.render(__dirname + '/home', {
      user: await decrypt(request.cookies.user),
    });
  } else {
    response.send('Please login to view this page!');
  }
  response.end();
});

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/login.css');
});
app.get('/profile', (req, res) => {
  res.render(__dirname + '/profile');
});

app.get('/ourdoctors', (req, res) => {
  connection.query(
      'SELECT * FROM doctors', async function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          results.forEach((doctor) => {
            if (doctor.dimage) {
              const imageData = doctor.dimage.toString(
                  'base64');  // Assuming dimage is a Buffer
              doctor.dimageBase64 =
                  `data:image/jpeg;base64,${imageData}`;  // Prepend data URI
            }
          });

          res.render(__dirname + '/doctors', {
            data: results,
            user: await decrypt(req.cookies.user),
          });
        } else {
          res.send('No doctors found!');
        }
        res.end();
      });
});

app.get('/ayurvedatreatments', (req, res) => {
  if (req.cookies.user) {
    connection.query(
        'select * from treatment', async (error, results, fields) => {
          if (error) {
            console.log('GET /ayruvedictreatments : Error : ', error);
          } else {
            if (results.length > 0) {
              res.render(__dirname + '/treatment', {
                data: results,
                user: await decrypt(req.cookies.user),
              });
            } else {
              res.render(__dirname + '/treatment', {
                data: 'No data to fetch',
                user: await decrypt(req.cookies.user),
              });
            }
          }
        });
  } else {
    res.send('Please login to view this page!');
  }
});

async function sendMail(
    recipientEmail, subject, templatename, user, data, attachmentsval) {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const templatePath = path.join(__dirname, 'templates', templatename + '.ejs');
  const template =
      fs.readFileSync(templatePath, 'utf-8');  // Read the file content
  const html = ejs.render(template, {user, data});

  const attachments = attachmentsval ? attachmentsval : [];

  const mailOptions = {
    from: {name: 'Ayur', address: process.env.SENDER_EMAIL},
    to: recipientEmail,
    subject: subject,
    html: html,
    attachments: attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to :', recipientEmail, ' ', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


app.post('/booktreatment', pdfupload, async (req, res) => {
  async function getEmail() {
    uid = await decrypt(req.cookies.uid);
    return new Promise(
        (resolve, reject) => {connection.query(
            'SELECT email from account where id = ?', [uid],
            (error, results) => {
              if (error) {
                console.log(
                    'POST: /booktreatment : Error: Failed to get email : ',
                    error)
                reject(false)
              } else {
                resolve(results[0].email);
              }
            })})
  }

  console.log(req.body);
  if (req.cookies.user) {
    user = await decrypt(req.cookies.user);
    connection.query(
        'SELECT * FROM treatmentbooking where uid = ? and treatment = ?',
        [parseInt(await decrypt(req.cookies.uid)), req.body.treatment],
        async (error, results) => {
          if (error) {
            console.log('POST /booktreatment: Error: ', error);
          } else {
            if (results.length > 0) {
              res.json({success: false, message: 'Booking Exists'});
            } else {
              connection.query(
                  'insert into treatmentbooking (uid,date,time,treatment) value(?,?,?,?)',
                  [
                    parseInt(await decrypt(req.cookies.uid)),
                    req.body.date,
                    req.body.utime,
                    req.body.treatment,
                  ],
                  async (error, results, feilds) => {
                    if (error) {
                      res.send(error);
                    } else {
                      console.log(results);
                      if (results.insertId > 0) {
                        const recipientEmail = await getEmail();
                        const subject = 'Treatment Booking Confirmation ';
                        console.log('sending Mail to ', recipientEmail, '...');
                        sendMail(
                            recipientEmail, subject, 'treatment', {
                              name: user.charAt(0).toUpperCase() + user.slice(1)
                            },
                            {
                              tname: req.body.treatment,
                              date: req.body.date,
                              time: convertTo12Hour(req.body.utime)
                            });
                        console.log('Booking created a email will be send');
                        res.json({success: true});
                      } else {
                        res.send('No booking happened..');
                      }
                    }
                  });
            }
          }
        });
  } else {
    res.send('Create a Account');
  }
});

app.get('/ayurvedicproducts', (req, res) => {
  if (req.cookies.user) {
    console.log('query ', req.query.query);
    console.log('request arrived..');
    if (req.query.query == undefined) {
      console.log('request is undefined');
      connection.query(
          'select * from products', async (error, results, feilds) => {
            if (error) {
              res.send(error);
            } else {
              if (results.length > 0) {
                results.forEach((product) => {
                  if (product.image) {
                    const imageData = product.image.toString(
                        'base64');  // Assuming dimage is a Buffer
                    product.dimageBase64 = `data:image/jpeg;base64,${
                        imageData}`;  // Prepend data URI
                  }
                });
                res.render(__dirname + '/products', {
                  data: results,
                  user: await decrypt(req.cookies.user),
                });
              }
            }
          });
    } else {
      console.log('request is not undefined');
      const query = req.query.query + '%';
      console.log(query);
      connection.query(
          'SELECT * FROM products WHERE UPPER(pname) LIKE UPPER(?)', [query],
          (error, results, feilds) => {
            if (error) {
              res.send(error);
            } else {
              if (results.length > 0) {
                results.forEach((product) => {
                  if (product.image) {
                    const imageData = product.image.toString(
                        'base64');  // Assuming dimage is a Buffer
                    product.dimageBase64 = `data:image/jpeg;base64,${
                        imageData}`;  // Prepend data URI
                  }
                });
                res.render(__dirname + '/products', {data: results});
              } else {
                res.render(__dirname + '/products', {data: null});
              }
            }
          });
    }
  } else {
    res.send('Please login to view this page!');
  }
});

app.get('/doctorappo', (req, res) => {
  if (req.cookies.user) {
    console.log(req.query.parameter);
    req.session.did = req.query.parameter;
    res.render(__dirname + '/doctorsappo');
  } else {
    res.send('Please login to view this page!');
  }
});

app.get('/booking', (req, res) => {
  if (req.cookies.user) {
    connection.query('select * from treatment', (error, results, fields) => {
      if (error) {
        res.render(__dirname + '/booking', {data: 'Error in fetching data'});
      } else {
        if (results.length > 0) {
          res.render(__dirname + '/booking', {data: results});
        } else {
          res.render(__dirname + '/booking', {data: 'No data available'});
        }
      }
    });
  } else {
    res.send('Please login to view this page');
  }
});

app.post('/doctorsappo', pdfupload, async (req, res) => {
  user = await decrypt(req.cookies.user);

  async function getEmail() {
    uid = await decrypt(req.cookies.uid);
    return new Promise(
        (resolve, reject) => {connection.query(
            'SELECT email from account where id = ?', [uid],
            (error, results) => {
              if (error) {
                console.log(
                    'POST: /booktreatment : Error: Failed to get email : ',
                    error)
                reject(false)
              } else {
                resolve(results[0].email);
              }
            })})
  }


  console.log('request received');
  console.log(req.body);
  const {date, utime, umessage} = req.body;
  var did = req.session.did;

  var uid = parseInt(await decrypt(req.cookies.uid));
  connection.query(
      'SELECT * FROM doctorbooking WHERE did=? and uid=?', [did, uid],
      (error, results) => {
        if (error) {
          console.log('POST /doctorappo : Error : ', error);
        } else {
          if (results.length > 0) {
            res.json({success: false, message: 'Appointment Exists'});
          } else {
            connection.query(
                'INSERT INTO doctorbooking (bdate, btime, did, uid, message) VALUES (?, ?, ?, ?, ?)',
                [date, utime, did, uid, umessage],
                async function(error, results, fields) {
                  if (error) {
                    console.log('POST /doctorsappo : Error: ', error);
                  } else {
                    if (results.insertId > 0) {
                      const recipientEmail = await getEmail();

                      const getDoctorName = (did) => {
                        return new Promise((resolve, reject) => {
                          connection.query(
                              'SELECT dname FROM doctors WHERE did = ?', [did],
                              (error, results) => {
                                if (error) {
                                  console.log(
                                      'POST /doctorsappo : Error: Failed to get doctor name : ',
                                      error);
                                  reject(error);
                                } else if (results.length > 0) {
                                  resolve(results[0].dname);
                                } else {
                                  reject(new Error(
                                      'No doctor found with the given ID'));
                                }
                              });
                        });
                      };

                      (async () => {
                        try {
                          const did = 1;  // Replace with the actual doctor ID
                          const doctorName = await getDoctorName(did);
                          sendMail(
                              recipientEmail,
                              'Appointment Booking Confirmation', 'appointment',
                              {
                                name: user.charAt(0).toUpperCase() +
                                    user.slice(1),
                              },
                              {
                                dname: doctorName,
                                date: date,
                                time: convertTo12Hour(utime)
                              })
                          console.log(
                              doctorName);  // Use the doctorName as needed
                        } catch (error) {
                          console.log('Error fetching doctor name:', error);
                        }
                      })();


                      res.json({success: true});
                    } else {
                      res.json({success: false});
                    }
                  }
                });
          }
        }
      });
});

app.use(express.static(path.join(__dirname, '')));

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.clearCookie('user');
      res.clearCookie('uid');
      res.sendStatus(200);
    }
  });
});

app.get('/payment', (req, res) => {
  if (req.cookies.user) {
    pid = req.query.pid;
    connection.query(
        'SELECT prize from products where pid=?', [pid], (error, results) => {
          if (error) {
            console.log('GET /payment : Error : ', error);
          } else {
            prize = results[0].prize;
            res.render(__dirname + '/payment', {prize: prize});
          }
        });
  } else {
    res.send('Please login to view this page');
  }
});

app.post('/productbooking', async (req, res) => {
  user = await decrypt(req.cookies.user);
  async function getEmail() {
    uid = await decrypt(req.cookies.uid);
    return new Promise(
        (resolve, reject) => {connection.query(
            'SELECT email from account where id = ?', [uid],
            (error, results) => {
              if (error) {
                console.log(
                    'POST: /booktreatment : Error: Failed to get email : ',
                    error)
                reject(false)
              } else {
                resolve(results[0].email);
              }
            })})
  }



  var {pid, address, state, pincode, prize} = req.body;
  pid = parseInt(pid);
  pincode = parseInt(pincode);
  prize = parseInt(prize);

  connection.query(
      'INSERT INTO productbooking (pid,uid,address,state,pincode,amount) VALUES(?,?,?,?,?,?)',
      [
        pid,
        parseInt(await decrypt(req.cookies.uid)),
        address,
        state,
        pincode,
        prize,
      ],
      async (error, results) => {
        if (error) {
          console.log('POST /productbooking : Error : ', error);
          res.json({success: false, message: 'Payment Failed'});
        } else {
          const recipientEmail = await getEmail();

          async function sendProductConfirmation(
              prize, address, state, pincode) {
            await connection.query(
                'SELECT pname, image from products where pid = ?', [pid],
                (error, results) => {
                  if (error) {
                    console.log('POST /productbooking : Error: ', error)
                  } else {
                    pname = results[0].pname;
                    image = results[0].image.toString('utf-8');

                    sendMail(
                        recipientEmail, 'Product Purchase Confirmation',
                        'products',
                        {name: user.charAt(0).toUpperCase() + user.slice(1)},
                        {pname, prize, address, state, pincode}, [{
                          filename: image.slice(image.lastIndexOf('/') + 1),
                          path: path.join(__dirname, 'public', image),
                          cid: 'pimg'
                        }])
                  }
                })
          };

          sendProductConfirmation(prize, address, state, pincode);

          res.json({success: true});
        }
      });
});

function convertTo12Hour(time24) {
  // Split the input time string into components
  const [hours, minutes, seconds] = time24.split(':');

  // Convert string hours to a number
  let hour = parseInt(hours, 10);
  // Determine AM or PM suffix
  const ampm = hour >= 12 ? 'PM' : 'AM';
  // Convert hours to 12-hour format
  hour = hour % 12 || 12;

  // Return formatted string
  return `${hour} ${ampm}`;
}

app.get('/dashboard', async (req, res) => {
  console.log(`GET /dashboard : ${await decrypt(req.cookies.uid)}_${
      await decrypt(req.cookies.user)}`);
  if (req.cookies.user) {
    if ((await decrypt(req.cookies.mode)) === 'admin') {
      res.redirect('/admin');
    } else {
      let appointments = undefined;
      let treatments = undefined;
      let orders = undefined;

      connection.query(
          'SELECT A.id,A.bdate,A.btime,B.dname,A.message FROM doctorbooking A , doctors B WHERE A.did = B.did AND A.uid = ?',
          [parseInt(await decrypt(req.cookies.uid))],
          async (error, results) => {
            if (error) {
              console.log(`GET /dashboard : ${decrypt(req.cookies.uid)}_${
                  await decrypt(req.cookies.user)} : Error : ${error}`);
            } else {
              appointments = results;
              connection.query(
                  'SELECT id, date, time, treatment FROM treatmentbooking WHERE uid = ?',
                  [parseInt(await decrypt(req.cookies.uid))],
                  async (error, results) => {
                    if (error) {
                      console.log(`GET /dashboard : ${
                          await decrypt(req.cookies.uid)}_${
                          await decrypt(req.cookies.user)} : Error : ${error}`);
                    } else {
                      treatments = results;
                      connection.query(
                          'SELECT A.bid, A.address, A.state, A.pincode, B.pname, A.amount FROM productbooking A, products B WHERE A.pid = B.pid AND A.uid = ?',
                          [parseInt(await decrypt(req.cookies.uid))],
                          async (error, results) => {
                            if (error) {
                              console.log(`GET /dashboard : ${
                                  await decrypt(req.cookies.uid)}_${
                                  await decrypt(
                                      req.cookies.user)} : Error : ${error}`);
                            } else {
                              orders = results;
                              appointments.forEach(appointment => {
                                appointment.btime =
                                    convertTo12Hour(appointment.btime);
                              })
                              treatments.forEach(treatment => {
                                treatment.time =
                                    convertTo12Hour(treatment.time);
                              })
                              res.render(__dirname + '/dashboard', {
                                appointments,
                                treatments,
                                orders,
                              });
                            }
                          });
                    }
                  });
            }
          });
    }
  } else {
    res.send('Please login to view this page');
  }
});

app.post('/removeappo', (req, res) => {
  if (req.cookies.user) {
    connection.query(
        'DELETE FROM doctorbooking WHERE id = ?', [req.body.data.bid],
        async (error, results) => {
          if (error) {
            console.log(`POST /removeappo : ${await decrypt(req.cookies.uid)}_${
                await decrypt(req.cookies.user)} : Error : ${error}`);
          } else {
            res.json({success: true});
          }
        });
  } else {
    res.json({Error: 'User not logged in'});
  }
});

app.post('/removetreat', (req, res) => {
  if (req.cookies.user) {
    connection.query(
        'DELETE FROM treatmentbooking WHERE id = ?', [req.body.data.bid],
        async (error, results) => {
          if (error) {
            console.log(
                `POST /removetreat : ${await decrypt(req.cookies.uid)}_${
                    await decrypt(req.cookies.user)} : Error : ${error}`);
          } else {
            res.json({success: true});
          }
        });
  } else {
    res.json({Error: 'User not logged in'});
  }
});

app.post('/removeorder', (req, res) => {
  if (req.cookies.user) {
    connection.query(
        'DELETE FROM productbooking WHERE bid = ?', [req.body.data.bid],
        async (error, results) => {
          if (error) {
            console.log(
                `POST /removeorder : ${await decrypt(req.cookies.uid)}_${
                    await decrypt(req.cookies.user)} : Error : ${error}`);
          } else {
            res.json({success: true});
          }
        });
  } else {
    res.json({Error: 'User not logged in'});
  }
});


app.post('/getSlots', (req, res) => {
  console.log('body is ', req.body);
  if (req.cookies.user) {
    var table = req.body.table;
    var date = req.body.date;
    if (table === 'treatmentbooking') {
      connection.query(
          `SELECT time from ${table} where date = ?`, [date],
          (error, results) => {
            if (error) {
              console.log('POST /getSlots : Error : ', error);
              res.json({success: false, message: 'Failed to retreive slots!'})
            } else {
              slots = results.map(row => row.time)
              res.json({success: true, data: slots})
            }
          })
    } else if (table === 'doctorbooking') {
      connection.query(
          `SELECT btime from ${table} where bdate = ?`, [date],
          (error, results) => {
            if (error) {
              console.log('POST /getSlots : Error : ', error);
              res.json({success: false, message: 'Failed to retreive slots!'})
            } else {
              slots = results.map(row => row.btime)
              res.json({success: true, data: slots})
            }
          })
    }
  } else {
    res.sendStatus(403);
  }
})