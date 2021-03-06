/**
 *  Required modules 
 */

const express = require('express') // load nodejs framework
const path = require('path') // utilities for working with file and directory paths
const cors = require('cors')
const bodyParser = require('body-parser') // parse request body
const dotenv = require('dotenv').config()
const {auth} = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

// initialize express
const app = express()
const port = parseInt(process.env.PORT, 10) || 3000

//Auth0 openID
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'HSQSHlA5GCFNtRArVJA8MLmdLZ36LYhu',
    issuerBaseURL: 'https://chair-site.us.auth0.com'
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));

/**
 * Middleware
 */

//serve public files
app.use(express.static('public'));
// enable cors
app.use(cors())
// parses incoming requests with JSON payloads
app.use(express.json());
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}));
//set the path to views folder
app.set('views', __dirname + '/views')


/**
 * Routes
 */
const customersRoute = require('./routes/customers')
const categoriesRoute = require('./routes/categories')
const productsRoute = require('./routes/products')
const ordersRoute = require('./routes/orders')

app.use('/customers', customersRoute)
app.use('/categories', categoriesRoute)
app.use('/products', productsRoute)
app.use('/orders', ordersRoute)


app.get('/', (req, res) => {
    res.send('Welcome to Site1-loads-of-chairs!')
})

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

/**
 *  Handle Errors
 */

// handle 404 page not found
app.use(function(req,res){
    res.status(404).send('The page you are looking for does not exist')
})
// handle server error 500
app.use(function(req,res){
    res.status(500).send('Something went wrong in our server')
})


app.listen(port, () => {
    console.log(`> Server is running on http://localhost:${port}`)
})

