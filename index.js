const express = require('express');
const keys = require('./config/keys');
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/db', async (req, res) => {
  try {
    var doc = yaml.safeLoad(fs.readFileSync("https://limitless-spire-35121.herokuapp.com/merchants.yml", 'utf8'));
    var search = req.query.search.toLowerCase();
    if (search !== "undefined") {
      newList = [];
      for (var i = 0; i < doc.length; i++) {
        if (doc[i].name.toLowerCase().includes(search) || doc[i].category.toLowerCase().includes(search)) {
          newList.push(doc[i]);
        }
      }
      res.send(newList);
    } else {
      res.send(doc);
    }
  } catch (e) {
    console.log(e);
  }
});

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);