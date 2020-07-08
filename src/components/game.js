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
    const Url = '';
    let data = this.data;

    // init player id and player name
    document.getElementById("player_id_submit").addEventListener("click", () => {
        let playerName = document.getElementById("player_id_text").value;
        if (playerName != '' && typeof(playerName) == 'string') {
          data.playerName = playerName;
        }
        let id = Math.floor(Math.random()*1000)
        this.playerId = data.playerName + id.toString();
        document.getElementById("game_init_container").style.display = 'none';
       

        // Send register request to api
        //this.registerPlayer(data.playerName, this.playerId);

        // then get back box/entity id's: 1,2,3 eller 4,5,6 ....
        
    });
    
    // Add event listener to click on a markers box
    let boxes = document.querySelectorAll('.game-box');
    boxes.forEach(item => {
      item.addEventListener('click', (e) => {
        // * Get entity id (and player id)
        console.log(e.target.);

        // * Write to redis
        //this.sendBox(this.playerId, entityId);
        
      });
    });
  },
  tick: function () {
    // Get data from redis
      // Where "id" == "playerId"
    // update markers value = 9/x depending on array (and playerID)
  },
  registerPlayer: function (playerName, playerId) {
    //const regUrl = ... ;
    let player = {
      name: playerName,
      id: playerId
    };

    return axios({
      method: 'post',
      url: regUrl,
      data: {
        player
      }
    }).then(data=>console.log(data)).catch(err=>console.log(err));

    // return true or false
  },
  getPlayer: function (id) {
    //const getPlrUrl = ... + id;
    let params = {
      playerId: id,
    }
    return axios.get(Url, params).then(data=>console.log(data)).catch(err=>console.log(err));
  },
  getBoxes: function () {
    // const getBoxesUrl = ... ;
    return axios.get()
  },
  sendBox: function(playerId, entityId) {
    // const sendBoxUrl = ... ;
    boxInfo = {
      playerId: playerId,
      entityId: entityId
    };
    return axios({
      method: 'post',
      url: sendBoxUrl,
      data: {
        boxInfo
      }
    }).then(data=>console.log(data)).catch(err=>console.log(err)); 
  }
});