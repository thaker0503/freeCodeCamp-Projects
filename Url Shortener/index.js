require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// create a new schema
const urlSchema = mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: Number, required: true}
});

// create a model
const Url = mongoose.model('Url', urlSchema);

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', async function(req, res) {
  const url = req.body.url;
  if (url === '' || url === undefined || url === null || !isValidUrl(url)) {
    res.json({error:"invalid URL"});
  }
  else {
    const savedUrl = await Url.findOne({original_url: url});
    if (savedUrl) {
      res.json({original_url: savedUrl.original_url, short_url: savedUrl.short_url});
    }
    else {
      const newUrl = new Url({original_url: url, short_url: Math.floor((Math.random()*100)+1)});
      const savedUrl = await newUrl.save();
      res.json({original_url: savedUrl.original_url, short_url: savedUrl.short_url});
    }
  }
});

app.get('/api/shorturl/:id', async function(req, res) {
  console.log(req.params.id);
  const redUrl = await Url.findOne({short_url: req.params.id});
  if (redUrl) {
    res.redirect(redUrl.original_url);
  }
  else {
    res.json({error: "invalid short url"});
  }
});


function isValidUrl(url) {
  const regex = "((http|https)://)(www.)?" + "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" + "{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"; 
  return url.match(regex);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
  if (err) {
    console.log('Database error: ' + err);
    } else {
      console.log('Successful database connection');
      app.listen(port, function() {
        console.log(`Listening on port ${port}`);
      });
    }
});
