/* eslint-disable */

import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:game");
import axios from 'axios';

// TODO:
// * Check if the new array is different (in backend), when updating entitites in tick()
// * Implement sockets.io instead of requesting entities list every tick

AFRAME.registerComponent('game', {
  schema: {
    playerName: { type: 'string', default: 'LoserBoi420'}
  },
  init: function () {
    const data = this.data;
    this.playerEntities = [0,0,0,0,0,0];
    this.markerList = [];
    this.markerEntityList = [];

    const markers = document.querySelectorAll('.marker');
    markers.forEach((marker) => {
      this.markerList.push(marker);
      this.markerEntityList.push(marker.firstElementChild);
    });

    // Register player
    document.getElementById("player_id_submit").addEventListener("click", () => {
        const playerName = document.getElementById("player_id_text").value;
        if (playerName && typeof(playerName) == 'string') {
          data.playerName = playerName;
        }
        document.getElementById("game_init_container").style.display = 'none';
        this.registerPlayer(data.playerName);
    });
    
    // Send entity when clicking on it
    const entities = document.querySelectorAll('.game-entity');
    entities.forEach(item => {
      item.addEventListener('click', (e) => {
        const entityId = parseInt(e.target.dataset.entityId, 10);
        this.sendEntity(this.playerId, entityId);
      });
    });
    log.info("init complete")
  },
  tick: function () {
    // If the player is registered, get the new list of entities
    if (typeof(this.playerId) == 'number') {
      this.getEntities(this.playerId, this.playerEntities).then((newEntities) => {
        if (newEntities) {
          this.playerEntities = newEntities;
          this.updateSceneEntities(this.playerEntities);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  },
  registerPlayer: function (playerName) {
    const regUrl = 'http://localhost:3001/player/add';
    
    const payload = {
      name: playerName
    };
    
    axios({
      method: 'post',
      url: regUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: payload
    })
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          this.playerId = response.data.playerId;
          console.log("#GAME: Player registered with playerName: " + this.data.playerName + " and playerId: " + this.playerId);
          return true
        } else {
          alert("Something went wrong when registering. See console.");
          return false
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  getEntities: async function (playerId, playerEntities) {
    const getEntitiesUrl = 'http://localhost:3001/entities/compare';

    const payload = {
      playerId: playerId,
      entities: playerEntities
    }

    const response = await axios({
        method: 'post',
        url: getEntitiesUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload
    });
    if (response.status == 200) {
      if (response.data.match == true) {
        return false
      } else {
        return response.data.entities;
      }
    } else {
      throw '#GAME: Something went wrong when requesting list of entities (not 200 response)'
    }
  },
  updateSceneEntities: function (entities) {
    for (let i = 0; i < entities.length; i++) {
      if (entities[i] == 0) {
        this.markerEntityList[i].setAttribute('visible', false);
        this.markerEntityList[i].setAttribute('data-entity-id', '');
        this.markerEntityList[i].classList.remove('cursor-interactive');
      } else {
        this.markerEntityList[i].setAttribute('visible', true);
        this.markerEntityList[i].setAttribute('data-entity-id', entities[i]);
        this.markerEntityList[i].classList.add('cursor-interactive');
        // SOUND
        console.log(this.markerEntityList[i]);
        console.log(this.markerEntityList[i].sound);
        this.markerEntityList[i].components.sound.stopSound();
        this.markerEntityList[i].components.sound.playSound();
      }
    }
    
  },
  sendEntity: function (playerId, entityId) {
    const sendEntityUrl = 'http://localhost:3001/entity/send';
    
    const payload = {
      playerId: playerId,
      entityId: entityId
    };

    axios({
      method: 'post',
      url: sendEntityUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload
    }).then((response) => {
      if (response.status == 200) {
        console.log("#GAME: Sent box.");
      } else {
        console.log("#GAME: Could not send box.");
      }
    }).catch(function (error) {
      console.error(error);
    });
  },
});