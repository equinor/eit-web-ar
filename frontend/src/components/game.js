/* eslint-disable */

import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:game");
import axios from 'axios';
import io from 'socket.io-client';

// TODO:
// * Check if the new array is different (in backend), when updating entitites in tick()
// * Implement sockets.io instead of requesting entities list every tick

AFRAME.registerComponent('game', {
  schema: {
    playerName: { type: 'string', default: 'LoserBoi420'}
  },
  init: function () {
    const _this = this;
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

    // Socket stuff - connection to backend
    this.socket = io('http://localhost:3100');
    this.socket.on('connect', function(data){
      console.log('#GAME: Socket-io: Connected to backend.');
    });
    // When backend updates list of entities
    this.socket.on('entities-updated', function(data) {
      console.log('#GAME: Recieved event: entities-updated');
      if (this.playerId == data.playerId) {
        this.playerEntities = data.entities;
        this.updateSceneEntities(this.playerEntities);
      }
    });
    // Når en ny player registreres
    this.socket.on('player-added', function(data) {
      _this.animateText(data.name + " has joined the game", "#c1f588");
    });

    // Når noen sender en boks
    this.socket.on('entity-sent', function(data) {
      _this.animateText(data.fromPlayer.name + ' sent box to ' + data.toPlayer.name + '!!', "#ff7161");
    });

    // Når det er game over
    this.socket.on('status-change', function(data) {
      _this.animateText(data.status, "#40B7FF", 3000);
    });
  },
  tick: function () {
  },
  animateText: function (text, color, delay=500) {
    // add element to html
    let paragraph = document.createElement("p");
    paragraph.innerHTML = text;
    paragraph.style.color = color;
    let element = document.getElementById("action-text");
    element.appendChild(paragraph);
    
    // animate element
    setTimeout(function() {
      let pos = 0;
      let op = 1;
      let fz = 24;
      let id = setInterval(animate, 10);
      function animate() {
        if (pos == 150) {
          // remove element
          clearInterval(id);
          paragraph.remove();
        } else {
          pos++;
          paragraph.style.top = -1.5*pos + 'px';
          paragraph.style.opacity = op - pos/150;
          paragraph.style.fontSize = fz - 24*pos/150 + 'px';
        }
      }
    }, delay);
  },
  registerPlayer: function (playerName) {
    const regUrl = 'http://localhost:3100/api/player/add';

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
  getEntities: async function (playerId) {
    const getEntitiesUrl = 'http://localhost:3100/api/entities/';

    const response = await axios({
        method: 'get',
        url: getEntitiesUrl + playerId,
    });
    if (response.status == 200) {
      return response.data.entities;
    } else {
      throw '#GAME: Something went wrong when requesting list of entities.'
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
    const sendEntityUrl = 'http://localhost:3100/api/entity/send';

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
