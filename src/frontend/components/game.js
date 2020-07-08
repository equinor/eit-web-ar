/* eslint-disable */

import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:game");
import axios from 'axios';

// TODO:

AFRAME.registerComponent('game', {
  schema: {
    playerName: { type: 'string', default: 'LoserBoy420'}
  },
  init: function () {
    let data = this.data;

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
        this.playerId = this.registerPlayer(data.playerName);
    });
    
    // Add event listener to click on a markers box
    let entities = document.querySelectorAll('.game-entity');
    entities.forEach(item => {
      item.addEventListener('click', (e) => {
        // Get entity id (and player id from this.playerId)
        let entityId = e.target.id;
        // Write to redis
        this.sendEntity(this.playerId, entityId);
      });
    });
  },
  tick: function () {
    // Get list of entities from redis
    this.entities = this.getEntities(this.playerId);
    // update markers value = 9 (or just disable marker for the correct entities)
    // TODO

  },
  registerPlayer: function (playerName) {
    //const regUrl = ... ;
    
    let player = {
      name: playerName
    };

    return axios({ // returns playerID
      method: 'post',
      url: regUrl,
      data: {
        player
      }
    }).then(data=>console.log(data)).catch(err=>console.log(err));
  },
  getEntities: function (playerId) {
    // const getEntitiesUrl = .../entities/:playerId ;
    return axios.get()
  },
  sendEntity: function(playerId, entityId) {
    // const sendEntityUrl = ... ;
    boxInfo = {
      playerId: playerId,
      entityId: entityId
    };
    return axios({
      method: 'post',
      url: sendEntityUrl,
      data: {
        boxInfo
      }
    }).then(data=>console.log(data)).catch(err=>console.log(err)); 
  },
  // getPlayer: function (id) {
  //   //const getPlrUrl = ... + id;
  //   let params = {
  //     playerId: id,
  //   }
  //   return axios.get(Url, params).then(data=>console.log(data)).catch(err=>console.log(err));
  // },
});