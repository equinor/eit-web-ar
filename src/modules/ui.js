
var toggle = true;

document.addEventListener("DOMContentLoaded", function(){
    doubleup_el = document.getElementById("doubleup");
    one_el = document.getElementById("one");
    two_el = document.getElementById("two");
    three_el = document.getElementById("three")


    doubleup_el.addEventListener("click", function(){
        if(toggle){
            console.log("toggle off")
            one_el.style.display = "block";
            two_el.style.display = "block";
            three_el.style.display = "block";
            toggle = false;
            doubleup_el.style.transform = "scaleY(-1)"
        }else{
            console.log("toggle on")
            toggle = true;
            one_el.style.display = "none";
            two_el.style.display = "none";
            three_el.style.display = "none";
            doubleup_el.style.transform = "scaleY(1)"
            
        }

    })
});

