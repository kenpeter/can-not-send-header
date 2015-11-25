var express = require('express');
var app = express();
var util = require("util");
var bodyParser = require('body-parser');

var session = require('express-session');
var request = require('request');

app.set('view engine', 'jade')
app.set('views', __dirname + '/views');


app.use(session({
  secret: 'ssshhhhh',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req,res){
  res.render('index'); 
});


app.post('/', function(req,res) {
  var context = {};

  if(req.body['New List'] === "true") {
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
    
    console.log("Add a new list");
  }

  //If there is no session, go to the main page.
  if(!req.session.name && !req.body.name) {
    res.render('newSession', context);
    console.log("new session!");
    return;
  }

  if(req.body['Add Item'] === "true") {
    if(!req.session.curId) {
      req.session.curId = 0;
    }

    if(!req.session.toDo) {
      req.session.toDo = [];  
    }

    console.log("Add a new item");

    var city = req.body.city;
    var minimum = req.body.temp;
    var myKey = "542e56d5b6d3a1afe4750a04143f961a"; // Yes, you can use my key

    if(city !== '') {

    }
    else {
      city = "Melbourne";
    }

    request('http://api.openweathermap.org/data/2.5/weather?q='+ city +'oh&appid='+myKey, getWeather);

    // Call back func
    function getWeather(err, response, body) {

      if(!err && response.statusCode < 400) {
        var weather = JSON.parse(body);
        var tempFahrenheit = ((weather.main.temp - 273.15)*1.8) + 32

        console.log(tempFahrenheit);

        if(tempFahrenheit >= minimum)
        {
          var doNow = "yes, do this now";
          req.session.toDo.push({
            "name": req.body.name, 
            "id": req.session.curId, 
            "city": req.body.city, 
            "temp": req.body.temp, 
            "doNow": doNow
          });

          req.session.curId++;
          context.name = req.session.name;
          context.toDoCount = req.session.toDo.length;
          context.toDo = req.session.toDo;
          console.log(context.toDo);
          return res.render('toDo',context);

        }
        else {
          var doNow = "no, do this later";
          req.session.toDo.push({"name":req.body.name, "id":req.session.curId, "city":req.body.city, "temp":req.body.temp,
          "doNow":doNow});
          req.session.curId++;
          context.name = req.session.name;
          context.toDoCount = req.session.toDo.length;
          context.toDo = req.session.toDo;
          console.log(context.toDo);
          return res.render('toDo',context);
        }

        res.render('toDo', context); // This never get called
        return;
      }
      else {
        if(response)
        {
          console.log(response.statusCode);
        }
        next(err);
      }
    } // end call back 
  } // end add item

  if(req.body['Done'] === "true"){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  console.log(context.toDo);
  // // Now we render again, see res.render('toDo', context) above.
  // We get error: Can't set headers after they are sent
  //res.render('last',context);  
  return;
});




// start the server
var port = 3000;
app.listen(port);
console.log('running');
