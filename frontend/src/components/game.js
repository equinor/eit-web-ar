/* eslint-disable */

import AFRAME, { THREE } from "aframe"
import * as utils from "../modules/utils";
const log = utils.getLogger("components:game");
import axios from 'axios';
import io from 'socket.io-client';
import api from '../modules/api';


AFRAME.registerComponent('game', {
  schema: {
    playerName: { type: 'string', default: 'AnstendigSpiller'},
    playerModel: { type: 'string', default: 'g_box'},
    playerModelColor: { type: 'string', default: 'green' }
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
    document.getElementById("player_model_select").addEventListener('change', function() {
      if (this.value[0] == 'g') {
        document.getElementById("player_model_color_select").removeAttribute("disabled");
      } else if (this.value[0] == 'm') {
        document.getElementById("player_model_color_select").setAttribute("disabled", true);
      }
    });
    document.getElementById("player_id_submit").addEventListener("click", () => {
        const playerName = document.getElementById("player_id_text").value;
        const playerModel = document.getElementById("player_model_select").value;
        const playerModelColor = document.getElementById("player_model_color_select").value;
        if (playerName && typeof(playerName) == 'string') {
          data.playerName = playerName;
        }
        if (playerModel && typeof(playerModel) == 'string') {
          if (playerModel[0] == 'm') {
            data.playerModelColor = '';
          } else if (playerModelColor && typeof(playerModelColor) == 'string') {
            data.playerModelColor = playerModelColor;
          }
          data.playerModel = playerModel;
        }
        document.getElementById("game_init_container").style.display = 'none';
        this.registerPlayer(data.playerName, data.playerModel, data.playerModelColor);
    });

    // Send entity when clicking on it
    const entities = document.querySelectorAll('.game-entity');
    entities.forEach(item => {
      item.addEventListener('click', (e) => {
        const entityId = parseInt(e.target.dataset.entityId, 10);
        _this.sendEntity(_this.playerId, entityId);
      });
    });
    log.info("init complete")

    // Socket stuff - connection to backend
    this.socket = io(api.socketUri);
    this.socket.on('connect', function(data){
      console.log('#GAME: Socket-io: Connected to backend.');
    });
    // When backend updates list of entities
    this.socket.on('entities-updated', function(data) {
      console.log('#GAME: Recieved event: entities-updated');
      if (_this.playerId == data.playerId) {
        _this.playerEntities = data.entities;
        _this.updateSceneEntities(_this.playerEntities);
      }
    });
    // Når en ny player registreres
    this.socket.on('player-added', function(data) {
      _this.animateText('<strong>' + data.name + "</strong> has joined", "#c1f588");
    });

    // Når noen sender en boks
    this.socket.on('entity-sent', function(data) {
      _this.animateText('<strong>' + data.fromPlayer.name + '</strong> sent box to <strong>' + data.toPlayer.name + '</strong>!!', "#ff87f9");
    });

    // Når det er game over
    this.socket.on('status-change', function(data) {
      if (data.status == 'not-started') {
        _this.animateText("<strong>Standby - Game not started</strong>", "#87ebff", 3000);
      } else if (data.status == 'started') {
        _this.animateText("<strong>Game started - Let's GO!</strong>", "#87ff9f", 3000);
      } else if (data.status == 'game-over') {
        _this.getWinner((winner) => {
          _this.animateText('<strong>GAME OVER!</strong>\n And the winner is.... \n <strong>' + winner + '</strong>', "#ff4060", 3000);
        });
      }
    });
  },
  tick: function () {
  },
  getWinner: function(callback) {
    const getWinnerUrl = api.baseUri + '/game/scores';

    axios.get(getWinnerUrl)
      .then((response) => {
        if (response.status == 200) {
          let winner;
          for (const item of response.data.scores) {
            if (item.score == 0) {
              winner = item.player.name;
              break;
            }
          }
          callback(winner);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  registerPlayer: function (playerName, playerModel, playerModelColor) {
    const regUrl = api.baseUri + '/player/add';

    const payload = {
      name: playerName,
      model: playerModel,
      color: playerModelColor,
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
    const getEntitiesUrl = api.baseUri + '/entities/';

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
      } else if (entities[i].model[0] == 'g') {
        const entityModel = entities[i].model.slice(2);
        this.markerEntityList[i].setAttribute('visible', true);
        this.markerEntityList[i].classList.add('cursor-interactive');
        this.markerEntityList[i].removeAttribute('gltf-model');
        this.markerEntityList[i].setAttribute('material', 'color', entities[i].color);
        this.markerEntityList[i].setAttribute('geometry', 'primitive', entityModel);
        this.markerEntityList[i].setAttribute('data-entity-id', entities[i].entityId);
        // Scaling && Positioning
        let scale;
        let position;
        if (entityModel == 'box') {
          scale = '1 1 1';
          position = '0 0 0';
        } else if (entityModel == 'sphere') {
          scale = '0.5 0.5 0.5';
          position = '0 0 0';
        } else if (entityModel == 'cone') {
          scale = '0.5 0.5 0.5';
          position = '0 0 0';
        } else if (entityModel == 'octahedron') {
          scale = '0.5 0.5 0.5';
          position = '0 0 0';
        } else if (entityModel == 'torusKnot') {
          scale = '0.3 0.3 0.3';
          position = '0 0 0';
        }
        this.markerEntityList[i].setAttribute('scale', scale);
        this.markerEntityList[i].setAttribute('position', position);
        // SOUND
        this.markerEntityList[i].components.sound.stopSound();
        this.markerEntityList[i].components.sound.playSound();
      } else if (entities[i].model[0] == 'm') {
        const entityModel = entities[i].model.slice(2);
        this.markerEntityList[i].setAttribute('visible', true);
        this.markerEntityList[i].classList.add('cursor-interactive');
        this.markerEntityList[i].removeAttribute('material');
        this.markerEntityList[i].removeAttribute('geometry');
        this.markerEntityList[i].setAttribute('gltf-model', entityModel);
        this.markerEntityList[i].setAttribute('data-entity-id', entities[i].entityId);
        // Scaling && Positioning
        let scale;
        let position;
        if (entityModel == '#penguin') {
          scale = '0.3 0.3 0.3';
          position = '0.05 0 0';
        }
        this.markerEntityList[i].setAttribute('scale', scale);
        this.markerEntityList[i].setAttribute('position', position);
        // SOUND
        this.markerEntityList[i].components.sound.stopSound();
        this.markerEntityList[i].components.sound.playSound();
      } else {
        console.log("#GAME: entity model is not a geometry or 3d-model. This updates nothing.")
      }
    }
  },
  sendEntity: function (playerId, entityId) {
    const sendEntityUrl = api.baseUri + '/entity/send';

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
