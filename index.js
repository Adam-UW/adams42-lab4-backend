//express is the framework we're going to use to handle requests
const express = require('express')
//Create a new instance of express
const app = express()

let middleware= require('./utilities/middleware');
//const hello= require('./routes/hello');
//app.use('/hello', hello);


//let middleware = require('./utilities/middleware')

app.use("/doc", express.static('apidoc'))

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json())

// USING ROUTES 
app.use('/auth', require('./routes/login.js'));
app.use('/auth', require('./routes/register.js'));
app.use('/hello', require('./routes/hello'));
app.use('/params', require('./routes/params'));
app.use('/demosql', require('./routes/demosql'));
app.use('/messages', middleware.checkToken, require('./routes/messages.js'))
app.use('/chats', middleware.checkToken, require('./routes/chats.js'))
app.use('/auth', middleware.checkToken, require('./routes/pushyregister.js'))

// app
// .route('/hello/adam')
// .get((request, respond)=>{})
// .post((request, respond)=>{})
app.get("/wait", (request, response)=>{
    setTimeout(()=>{
        response.send({
            message:"Thanks for waiting"
        });
    }, 5000)
});
/*
 * This middleware function will respond to inproperly formed JSON in 
 * request parameters.
 */
app.use(function(err, req, res, next) {

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).send({ message: "malformed JSON in parameters" });
  } else next();
})

/*
 * Return HTML for the / end point. 
 * This is a nice location to document your web service API
 * Create a web page in HTML/CSS and have this end point return it. 
 * Look up the node module 'fs' ex: require('fs');
 */
app.get("/", (request, response) => {
    //this is a Web page so set the content-type to HTML
    response.writeHead(200, {'Content-Type': 'text/html'});
    for (i = 1; i < 7; i++) {
        //write a response to the client
        response.write('<h' + i + ' style="color:blue">Hello World!</h' + i + '>'); 
    }
    response.end(); //end the response
});


app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});