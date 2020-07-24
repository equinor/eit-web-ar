
var a = 10;
var foo = function () {
  var a = 20;
  console.log(a)
}
foo()
console.log(a);

var a = 30;
console.log(a);