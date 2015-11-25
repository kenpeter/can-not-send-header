# What is this
This is the answer to http://stackoverflow.com/questions/33839813/cant-set-headers-after-theyre-sent.

The error is "Can't set headers after they are sent", basically res.render gets called for more than once within a post or get route. This is the error we will see.

# How to run the code
* install: npm install
* run: node app.js
* Visit http://localhost:3000, then click "add new item".
* Then it will work

# Uncomment
If you uncomment line 132, res.render('last',context), you will see the error again.

