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
Development environment:
* Ubuntu 20.04 (Linux)
* iPhone 11 - iOS 13.3.1
* XRviewer/Safari

Comments:
* Need to install the app "XR viewer" from the app store to have a compatible browser for WebXR on iPhone.
* For only enabling camera as a background (without IMU etc.) only Safari works.

## Development Environment - Erlend
Development environment:
* Linux Mint 19.1 (aka Ubuntu 18.04)
* Chromium 83 for desktop
* Moto G5 with Android 8.1.0
* Chrome 83 for mobile

Comments:
* Moto G5 does not support ARCore. The AR button in Chrome for mobile is shown, but gives an error without text when clicked.

## Development Environment - Jonas
Development environment:
* MacOS Catalina 10.15.2
* iPhone XR - iOS 13.5.1
* Safari

Comments:
* For now safari is sufficient for the web application, but XRViewer may be necessary later on.

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
* Use code:2 and matrix:3x3

You can toggle an object on and off by first adding the component toggle-visibility to an entity. Then when you click on the entity it will toggle it's visibility on and off.

### Trouble recognizing barcode ~~with laptop~~ with black background
With [Commit #26](https://github.com/equinor/eit-web-ar/commit/3c82867d0a231d38d44d794825fe564e65f36a39) we're able to show text when the app recognizes barcode `0`.

~~All of us were able to recognize the barcode with our phones, but none of us were able to recognize the barcode using the webcam on our laptops.~~

All of us were able to recognize the barcode with our phones. We also were able to recognize the barcode using the webcam on our laptops,
but only when the barcode marker had a white background - not a black one.

## Add gestures to objects

You can add gestures to object, such that you can scale and rotate the object in runtime using gestures on the touchscreen.

## Marker confidence

We've experienced some problems with markers being detected when they shouldn't be detected.
We looked into setting some minimum detection confidence level to ensure that the detected markers were "real".

It seems that there is a `minConfidence` property on the three.js object that deals with marker recognition.
There is also a `min-confidence` attribute to the `a-marker` in AR.js, although not documented and not fully implemented.
It seems simple enough to finish the implementation of this (see line 5090 in aframe-ar.js).

Even with the `min-confidence` things implemented, a confidence check can't be (easily) implemented at this time.
The reasen is that the barcode marker check in three.js seems to be binary (true/false).
When three.js recognizes a barcode marker, it simply tells us that is has found the marker with confidence 1.
A `min-confidence` property won't make much sense as long as three.js can't give us their confidence.

## Uncaught RangeError: Array buffer allocation failed
In aframe-ar.js:2. Happens very often on Erlends' phone (old) and sometimes on the other phones.

Seems to be related to RAM usage (although not 100% sure).

Quickfix to make it less irritating might be to force reload of the page when this error occurs.

Todo:
* find out exactly why the error occurs.
* if due to RAM usage: how to use less RAM?
