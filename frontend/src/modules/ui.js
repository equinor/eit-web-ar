/* eslint-disable */
import * as utils from "./utils";
const log = utils.getLogger("ui");

// ********************************************************
// HOW TO USE:
// * Show and hide content with #toggle_button
// * Put the content you want to toggle in #toggle_content
// * If you want to hide the content at start-up, add the class .hide,
// * If you want to show it at start-up, add the class .show to indicate this
// * If you have other buttons (like submit buttons) that you want to close the content, 
//   add the class .close_content to those buttons
// ********************************************************

document.addEventListener("DOMContentLoaded", function(){
    // ********************************************************
    // Wait until assets have loaded until UI is loaded.
    // If it took too long to load (timeout), alert the user.
    const ui = document.getElementById('ui_wrap');
    const assets = document.getElementsByTagName('a-assets')[0];
    assets.addEventListener('loaded', () => {
        log.info('Assets loaded');
        ui.classList.remove('hide');
    });
    if (assets.hasAttribute('timeout')) {
        var timer = assets.getAttribute('timeout')*0.001;
        assets.addEventListener('timeout', () => {
            alert(`Timeout (${timer}s): took too long to load assets (3D models, audio, etc.). Adjust timeout timer or reduce size of assets.`)
        });
    }
    

    // ********************************************************
    // Add events to toggle UI button and content
    const toggleButton = document.getElementById("toggle_button");
    const toggleContent = document.getElementById("toggle_content");
    const closeButtons = document.getElementsByClassName("close_content");
    const infoButton = document.getElementById("info_button");
    const infoContent = document.getElementById("info_content");
    const infoClose = document.getElementById("close_info");
    const scrollIndicator = document.getElementById("scroll_indicator");

    let toggle = true;

    toggleButton.addEventListener("click", () => {
        if (toggle) {
            toggleContent.style.display = "block";
            toggle = false;
            toggleButton.style.transform = "scaleY(-1)"
        } else {
            toggleContent.style.display = "none";
            toggle = true;
            toggleButton.style.transform = "scaleY(1)"
        }
    });
    for (let button of closeButtons) {
        button.addEventListener('click', () => {
            toggleContent.style.display = "none";
            toggle = true;
            toggleButton.style.transform = "scaleY(1)";
        });
    }

    let infoToggle = true;

    // INFO BUTTON
    infoButton.addEventListener('click', () => {
        if (infoToggle) {
            infoContent.style.display = "block";
            infoToggle = false;
            infoButton.style.transform = "scaleY(-1)";
        } else {
            infoContent.style.display = "none";
            infoToggle = true;
            infoButton.style.transform = "scaleY(1)";
        }
    });
    infoClose.addEventListener('click', () => {
        infoContent.style.display = "none";
        infoToggle = true;
        infoButton.style.transform = "scaleY(1)";
    });

    // Show indication that there are more info if you scroll
    async function setScroll() {
        setTimeout(function () {
            if (infoContent.scrollHeight > infoContent.clientHeight+20) {
                scrollIndicator.style.display = "block";
            }
        }, 1000)
    }
    setScroll();

    
    // if (infoContent.scrollHeight > infoContent.clientHeight) {
    //     scrollIndicator.style.display = "block";
    // }
    // console.log(infoContent.scrollHeight);
    //     console.log(infoContent.clientHeight);
    
    infoContent.addEventListener('scroll', (e) => {
        if (infoContent.scrollHeight - infoContent.scrollTop < infoContent.offsetHeight+50) {
            scrollIndicator.style.display = "none"
        } else {
            scrollIndicator.style.display = "block"
        }
    });
    scrollIndicator.addEventListener("click", () => {
        infoContent.scrollTop = infoContent.scrollHeight;
    });
});

