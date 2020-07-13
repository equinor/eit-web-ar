# Notes

For exploring REST apis then the tool [postman](https://www.postman.com/) is currently the most popular one out there.  
There are how ever other ways as well and I'll describe some of them here.

## Exploring the REST api using chrome web dev tools

1. Browse to the url
1. Open web dev tools
1. Run script in script tab  
   ```js
   // POST example
   var xhr = new XMLHttpRequest();
   xhr.open("POST", "http://localhost:3100/api/player/add");
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.send("name=SweetBabyElvis");
   ```
1. In network tab, inspect the response output

_CORS_  
Be aware that chrome web tools `origin` has the value `null`.  
A hackish debug session can then be performed by allowing `null` in the list of `origin` in express cors `corsOptions` setup...
A hack that really should not creep out into production.


## Exploring the REST api using linux curl

TODO
