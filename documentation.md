# Documentation

## Development Environment - Eric
Development environment:
* MacOS Catalina
* Android v. 10
* Chrome for mobile v. 83

Settings:
* I had to enable the webxr-ar-module flag in chrome://flags (As per 22 june 2020)

Comments:
* With this setup, everything seems to work as it should. I can see the AR/VR buttons when I visit the app and I get no errors.
* No workarounds.

## Development Environment - Ola
Development environment
* Ubuntu 20.04 (Linux)
* iPhone 11 - iOS 13.3.1
* XRviewer/Safari

Comments:
* Need to install the app "XR viewer" from the app store to have a compatible browser for WebXR on iPhone. 
* For only enabling camera as a background (without IMU etc.) only Safari works.

## Using devices without AR support

Android devices without support for ARCore doesn't show the AR button in the browser,
or if they do, the AR button will not work properly.

It is possible to force show the AR button in Chrome by setting some flags in `chrome://flags`.
The flags we've enabled are the following:
* WebXR Incubations
* Experimental Web Platform features (search for "web platform")
* Enable Portals. (search for "web platform")
* Web Platform Controls updated IU (search for "web platform")

It seems that at least some AR functionality can still be accessed even though the device does not have full AR support.
So far we have been able to use the following functionalities on phones without AR support:

* Camera (Moto G5)

## Tracking symbols
AR.js comes with two tracking functionalities: Image Tracking and Marker Tracking. Images are like photos (very detailed), while markers are very simple symbols. After some testing and reading, it seems that using markers is better for tracking in terms of speed and stability.

Links:
* https://ar-js-org.github.io/AR.js-Docs/

## A note about QR-codes
QR-codes are symbols that are too complex to use as markers. The tracking is not good and you need to be very close to the qr-code in order to track it as a symbol. Therefore we are not using QR-codes as markers.

## Barcodes
Barcodes are simple symbols with good performance. Barcodes are generated symbols for a number. You don't need a symbol/pattern file, it is enough to just specify the number used for generating the barcode. For example, using 3x3 matrix code type, we have 64 standardized symbols available between 0-63. Then it is enough to specify the number in the html code.

Links:
* How to use: https://aframe.io/blog/arjs/#different-type-of-markers-pattern-and-barcode
* Info: https://github.com/artoolkitx/artoolkitx/wiki/Creating-and-using-square-barcode-markers
* Generator: https://au.gmented.com/app/marker/marker.php 


## Toggling the visibility of objects
* Generator: https://au.gmented.com/app/marker/marker.php

### Trouble recognizing barcode with laptop
With [Commit #26](https://github.com/equinor/eit-web-ar/commit/3c82867d0a231d38d44d794825fe564e65f36a39) we're able to show text when the app recognizes barcode `0`.

All of us were able to recognize the barcode with our phones, but none of us were able to recognize the barcode using the webcam on our laptops.
