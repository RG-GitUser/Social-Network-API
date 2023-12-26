
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes'); 

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// routes
app.use('/api', routes); // use the routes defined in the 'routes' module

// default response for any other request
app.use((req, res) => {
  res.status(404).send("404 Error: Not Found");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
