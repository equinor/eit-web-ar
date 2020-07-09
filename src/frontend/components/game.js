/* eslint-disable */

import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:game");
import axios from 'axios';

// TODO:
// X * Register and get playerId
// * Get entity setup
// * Send boxes

AFRAME.registerComponent('game', {
  schema: {
    playerName: { type: 'string', default: 'LoserBoi420'}
  },
  init: function () {
    let data = this.data;
    this.playerEntities = [];
    
    this.markerList = [];
    this.markerEntityList = [];
    let markers = document.querySelectorAll('.marker');
    markers.forEach((marker) => {
      this.markerList.push(marker);
      this.markerEntityList.push(marker.firstElementChild);
    });

    // init player id and player name
    document.getElementById("player_id_submit").addEventListener("click", () => {
        // Set player name and id  
        let playerName = document.getElementById("player_id_text").value;
        if (playerName != '' && typeof(playerName) == 'string') {
          data.playerName = playerName;
        }
        
        // Hide image and text/submit box
        document.getElementById("game_init_container").style.display = 'none';
       
        // Send register request to api, and get back player id
        this.registerPlayer(data.playerName).then((resData) => {
          if (resData != false && resData != undefined) {
            this.playerId = resData.playerId;
            console.log("** Player registered with playerName: " + data.playerName + " and playerId: " + this.playerId);
          } else {
            alert("Something went wrong when registering. CONTACT CYBER SUPPORT.")
          }
        });
    });
    
    // Add event listener to click on a markers box
    let entities = document.querySelectorAll('.game-entity');
    entities.forEach(item => {
      item.addEventListener('click', (e) => {
        // Get entity id
        let entityId = e.target.id;
        // Write to redis
        this.sendEntity(this.playerId, entityId);
      });
    });
  },
  tick: function () {
    // If the player is registered
    if (this.playerId != undefined) {
      // Get list of entities for this playerId
      this.getEntities(this.playerId).then((resData) => {
        // If entities were recieved from the server
        if (resData != false && resData != undefined) {
          // TODO: Check if the new array is different (in backend)

          // Update the players entity array
          this.playerEntities = resData.entities;
          // Update the a-frame scene to display entities according to the entity array
          this.updateEntities(this.playerEntities);
        } else {
          console.error("Game: Error while requesting entities");
        }
      });
    }
  },
  registerPlayer: async function (playerName) {
    const regUrl = 'http://localhost:3001/player/add';
    
    let player = {
      name: playerName
    };
    try {
      let res = await axios({
        method: 'post',
        url: regUrl,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data: player
      }).catch(function (error) {
        // handle error
        console.error(error);
      });
      if (res.status == 200 || res.status == 201) {
        return res.data
      } else {
        return false
      }
    } catch (err) {
      console.error(err);
    }
    
  },
  getEntities: async function (playerId) {
    const getEntitiesUrl = 'http://localhost:3001/entities/';

    try {
      let res = await axios({
        method: 'get',
        url: getEntitiesUrl + playerId,
      });
      if (res.status == 200) {
        return res.data
      } else {
        return false
      }
    } catch (err) {
      console.error(err);
    }
    return axios.get()
  },
  updateEntities: function (entities) {
    for (let i = 0; i < entities.length; i++) {
      if (entities[i] == 0) {
        this.markerEntityList[i].setAttribute('visible', false);
        this.markerEntityList[i].setAttribute('data-entity-id', '');
      } else {
        this.markerEntityList[i].setAttribute('visible', true);
        this.markerEntityList[i].setAttribute('data-entity-id', entities[i]);
      }
    }
    
  },
  sendEntity: function (playerId, entityId) {
    // const sendEntityUrl = ... ;
    // boxInfo = {
    //   playerId: playerId,
    //   entityId: entityId
    // };
    // return axios({
    //   method: 'post',
    //   url: sendEntityUrl,
    //   data: boxInfo
    // }).then(data=>console.log(data)).catch(err=>console.log(err)); 
  },
});