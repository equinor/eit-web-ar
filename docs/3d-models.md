# 3d models

All 3d assets should be in [glTF](https://www.khronos.org/gltf/) binary format `glb`.  
It is preferable to use glb binary format to avoid problems with loading textures in Safari related to CORS and/or reverse proxy and/or cookie. 

An easy way to convert `glTF` to `glb` is using a command line tool provided in nodejs:
1. Install [glTF pipeline](https://github.com/AnalyticalGraphicsInc/gltf-pipeline) command line tool globally with npm:  
   1. `npm install -g gltf-pipeline`
1. Convert glTF to glb  
   1. `gltf-pipeline -i model.gltf -o model.glb`
1. Done!