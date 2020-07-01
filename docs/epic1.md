# Epic 1

With epic 1 we created a web app with the ability to recognize "barcode markers". When the camera on the phone or laptop recognizes the marker, the app enhances the camera stream with AR functionality: showing text over the marker, showing a 3d box over the marker, showing a custom 3d model over the marker, playing a sound, or drawing lines between markers.

With the functionality we implemented we were able to create a proof of concept web AR app. At this stage the user have to print out the given barcode markers and put them on the object of interest.

See [this video](https://drive.google.com/file/d/1teWcL39Us8xr9aYBNlM7stuhZb1C4WGH/view?usp=sharing) for a demonstration.

## Experience made during epic 1

The group had different levels of experience with web development, Javascript, Docker and everything else we needed to use for making a web AR app. The first days were therefore spent getting to know the basics of the technologies.

During epic 1 we started getting to know the AR libraries three.js, A-frame, and AR.js. We spent a lot of time trying to understand how they work and how they interact with each other.

Already in the very beginning we encountered compability issues with laptops and phones that seemed to not be AR compatible, but these problems were solved (see [Notes](notes.md)) or simply ignored, as it is possible to use a lot of the AR technology even if the phone does not officially support it.

## Pros and cons with the approach

Pro: Enhancing physical models with points of interest works well with AR and marker recognition. So far we have simply enhanced the real world with static information, but it seems that it would also work well to enhance it with interactive elements (like control panels for a physical submarine :)).

Con: One of the mains goals with this epic is to make AR more available for Statoil employees. We encountered compability isuues with our laptops and phones, which means that others will probably encounter the same issues - meaning that our web app might not be easily accessible for everyone.

...
