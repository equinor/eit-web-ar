# Documentation

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
