const express = require('express');
const app = express();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const bodyParser= require("body-parser");
const cors =require("cors");
const axios = require('axios');
const pg = require('pg');
const multer = require('multer');
const session = require('express-session');
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
  });
  
const upload = multer({ storage: storage });

const db = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "bot",
    password: "12345",
    port: 5432,
  });
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //////////////recruitebot resume parser///////////////////
app.get('/api/resumeparserget', (req, res) => {
    const sqlGet = 'SELECT * FROM resumeparser';
    db.query(sqlGet, (error, result) => {
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(result.rows);
    });
  });

// Handle file upload and data insertion
app.post('/api/resumeparserpost', upload.single('uploadfile'), (req, res) => {
  try {
    const { jobdescription, promptmsg } = req.body;
    const uploadfile = req.file;

    if (!uploadfile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!jobdescription || !promptmsg) {
      return res.status(400).json({ error: 'Job description and prompt message are required' });
    }

    const sqlInsert = 'INSERT INTO resumeparser (jobdescription, uploadfile, promptmsg) VALUES ($1, $2, $3)';
    const values = [jobdescription, uploadfile.originalname, promptmsg];

    db.query(sqlInsert, values, (error) => {
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'Data inserted successfully' });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//**********************screening********************* */
     app.get('/api/screeningget', (req, res) => {
     const sqlGet = 'SELECT * from screening';
     db.query(sqlGet,(error,result)=>{
     if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
        res.json(result.rows);
    }
    );
});

app.post('/api/screeningpost', upload.single('uploadfile'), async (req, res) => {
  try {
    const { criteria, prompt } = req.body;
    const uploadfile = req.file;

    if (!uploadfile || !criteria || !prompt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sqlInsert = 'INSERT INTO screening (criteria, fileupload, prompt) VALUES ($1, $2, $3)';
    const values = [criteria, uploadfile.originalname, prompt];
    await db.query(sqlInsert, values);
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//**************************schedule*********************** */
app.get('/api/scheduleget', (req, res) => {
    const sqlGet= "SELECT * from schedule";
    db.query(sqlGet,(error,result)=>{
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
        res.json(result.rows);
    });
});

app.use(bodyParser.json());

// POST route definition
app.post('/api/schedulepost', async (req, res) => {
  const { email, whatsapp, date, time, contact } = req.body;

  if (!email || !whatsapp || !date || !time || !contact) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) {
    return res.status(400).json({ error: "Invalid date format, should be YYYY-MM-DD" });
  }

  const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
  if (!timeRegex.test(time)) {
    return res.status(400).json({ error: "Invalid time format, should be HH:MM or HH:MM:SS" });
  }

  try {
    const sqlInsert = "INSERT INTO schedule (email, whatsapp, date, time, contact) VALUES ($1, $2, $3, $4, $5)";
    const values = [email, whatsapp, date, time, contact];
    await db.query(sqlInsert, values);
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//************************interview************************ */
app.get('/api/interviewget', (req, res) => {
  const sqlGet= 'SELECT * from interview';
  db.query(sqlGet,(error,result)=>{
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
      res.json(result.rows);
  });
});

/////////////////////////////////////////////
app.post('/api/interviewpost', upload.none(), async (req, res) => {
  const { name, emailid, phone, link } = req.body;

  // Validate input fields
  if (!name || !emailid || !phone || !link) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Additional validation for email and phone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  if (!emailRegex.test(emailid)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  try {
    const sqlInsert = 'INSERT INTO interview (name, emailid, phone, link) VALUES ($1, $2, $3, $4)';
    const values = [name, emailid, phone, link];
    await db.query(sqlInsert, values);
    res.status(201).json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//add a query
app.post('/api/feedbackpost', upload.none(), (req, res) => {
  const { interviewFeedback, whatWentWrong, rating } = req.body;

  // Simple validation
  // Validate rating to be a number
  const ratingNumber = Number(rating);
  if (isNaN(ratingNumber)) {
    return res.status(400).json({ error: 'Rating must be a number' });
  }

  const sqlInsert = 'INSERT INTO feedback (interviewfeed, whatwentwrong, rating) VALUES ($1, $2, $3)';
  const values = [interviewFeedback, whatWentWrong, ratingNumber];
  
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error('Error inserting feedback:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Feedback inserted successfully' });
  });
});

////////////////refer jds/////////////////referJDs
app.get('/api/referjdget', (req, res) => {
  const sqlGet= 'SELECT jobdescription from resumeparser';
  db.query(sqlGet,(error,result)=>{
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
      res.json(result.rows);
  });
});

////////////////Nmap/////////////
app.get('/api/nmap-scan', (req, res) => {
    const ip = req.query.ip; // Assuming the IP is provided as a query parameter
  
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }
  
    // Execute the Nmap command
    exec(`nmap -p- --open ${ip}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      const openPorts = stdout
        .split("\n")
        .filter((line) => line.includes("/tcp"))
        .map((line) => line.split("/")[0]);
  
      res.json({ openPorts });
    });
  });

///////////////////////////

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });