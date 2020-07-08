/* eslint-disable */
var toggle = true;

document.addEventListener("DOMContentLoaded", function(){
    doubleup_el = document.getElementById("button_doubleup");
    one_el = document.getElementById("button_one");
    two_el = document.getElementById("button_two");
    three_el = document.getElementById("button_three")


    doubleup_el.addEventListener("click", function(){
        if(toggle){
            one_el.style.display = "block";
            two_el.style.display = "block";
            three_el.style.display = "block";
            toggle = false;
            doubleup_el.style.transform = "scaleY(-1)"
        }else{
            toggle = true;
            one_el.style.display = "none";
            two_el.style.display = "none";
            three_el.style.display = "none";
            doubleup_el.style.transform = "scaleY(1)"
            
        }

    })
});

