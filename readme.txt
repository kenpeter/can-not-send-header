This is the answer to http://stackoverflow.com/questions/33839813/cant-set-headers-after-theyre-sent.

The error is "Can't set headers after they are sent", basically res.render gets called for more than once within a post or get route. This is the error we will see.
