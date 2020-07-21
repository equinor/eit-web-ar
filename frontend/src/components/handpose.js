// Detect flat hand or fist bump hand gesture, and find the position of the hand in 3D.
// Hand gesture detection works well.
// Finding the 3D position of the hand needs some more work.
// Based on https://github.com/tensorflow/tfjs-models/tree/master/handpose

const handpose = require("@tensorflow-models/handpose");

AFRAME.registerComponent("handpose", {
  schema: {
    loop_timer: { type: "number", default: 1000 },
    emit_3d_pos: { type: "boolean", default: true },
  },

  init: function () {
    load_loop_timeout = 1000;
    this.waitForElementToDisplay("video", load_loop_timeout);
  },

  remove: function () {},

  waitForElementToDisplay(selector, time) {
    var _this = this;
    element = document.querySelector(selector);
    if (element != null) {
      this.loadModel(element);
      return;
    } else {
      setTimeout(function () {
        _this.waitForElementToDisplay(selector, time);
      }, time);
    }
  },

  async loadModel(video_el) {
    const model = await handpose.load();
    this.predictLoop(video_el, model, this.data.loop_timer, 1);
  },

  multiplyMatrixAndPoint(matrix, point) {
    // Matrix multiplucation for 4x4 matrix and 4x1 point or vector
    let c0r0 = matrix[0],
      c1r0 = matrix[1],
      c2r0 = matrix[2],
      c3r0 = matrix[3];
    let c0r1 = matrix[4],
      c1r1 = matrix[5],
      c2r1 = matrix[6],
      c3r1 = matrix[7];
    let c0r2 = matrix[8],
      c1r2 = matrix[9],
      c2r2 = matrix[10],
      c3r2 = matrix[11];
    let c0r3 = matrix[12],
      c1r3 = matrix[13],
      c2r3 = matrix[14],
      c3r3 = matrix[15];

    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];

    let resultX = x * c0r0 + y * c0r1 + z * c0r2 + w * c0r3;
    let resultY = x * c1r0 + y * c1r1 + z * c1r2 + w * c1r3;
    let resultZ = x * c2r0 + y * c2r1 + z * c2r2 + w * c2r3;
    let resultW = x * c3r0 + y * c3r1 + z * c3r2 + w * c3r3;
    return [resultX, resultY, resultZ, resultW];
  },

  getPosition(predictions) {
    // Use position of palmbase to determine the position of the hand
    palmbase_raw = predictions[0].annotations.palmBase[0];
    palmbase_x = palmbase_raw[0] / 100;
    palmbase_y = palmbase_raw[1] / 150;
    palmbase_z = palmbase_raw[2] * 1000;

    pos_vec = [palmbase_x, palmbase_y, palmbase_z];
    return pos_vec;
  },

  rotateYAxis(radians, vec) {
    vec = [vec[0], vec[1], vec[2], 1];

    let rotateYMatrix = [
      Math.cos(radians),
      0,
      Math.sin(radians),
      0,
      0,
      1,
      0,
      0,
      -Math.sin(radians),
      0,
      Math.cos(radians),
      0,
      0,
      0,
      0,
      1,
    ];
    rotated_vec = this.multiplyMatrixAndPoint(rotateYMatrix, vec);
    return [rotated_vec[0], rotated_vec[1], rotated_vec[2]];
  },

  async predictLoop(vid, model, timeout, count) {
    var _this = this;
    const predictions = await model.estimateHands(vid);
    if (predictions.length > 0) {
      theta = this.calcAngle(predictions);
      if (theta > 1) {
        handpose_gesture = "fistbump";
      } else {
        handpose_gesture = "flat";
      }
      if (this.data.emit_3d_pos) {
        hand_position = this.getPosition(predictions);
        rotated_hand = this.rotateYAxis(-Math.PI / 3, hand_position);
        hand_world_position = this.toWorldPos(rotated_hand);
        this.el.emit("handpose", {
          handpose: handpose_gesture,
          position: hand_world_position,
        });
      } else {
        this.el.emit("handpose", {
          handpose: handpose_gesture,
        });
      }
    }
    setTimeout(() => {
      _this.predictLoop(vid, model, timeout, count + 1);
    }, timeout);
  },

  calcAngle(predictions) {
    A = predictions[0].annotations.palmBase[0];
    B = predictions[0].annotations.indexFinger[1];
    C = predictions[0].annotations.indexFinger[3];
    AB = this.poseMinus(B, A);
    BC = this.poseMinus(C, B);
    dot_prod = this.dotProduct(AB, BC);
    AB_len = this.lengthVector(AB);
    BC_len = this.lengthVector(BC);
    theta = Math.acos(dot_prod / (AB_len * BC_len));
    return theta;
  },

  poseMinus(pose1, pose2) {
    x_delta = pose1[0] - pose2[0];
    y_delta = pose1[1] - pose2[1];
    z_delta = pose1[2] - pose2[2];
    return [x_delta, y_delta, z_delta];
  },

  dotProduct(pose1, pose2) {
    return pose1[0] * pose2[0] + pose1[1] * pose2[1] + pose1[2] + pose2[2];
  },

  lengthVector(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
  },

  toWorldPos(hand_position) {
    const camera_pos = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    this.el.object3D.getWorldQuaternion(quaternion);
    this.el.object3D.getWorldPosition(camera_pos);
    var vector = new THREE.Vector3(hand_position[0], hand_position[1], 1.0);
    vector.applyQuaternion(quaternion);

    world_pos = [
      vector.x + camera_pos.x,
      vector.y + camera_pos.y,
      vector.z + camera_pos.z,
    ];
    return world_pos;
  },

  //tick() {
  //var _this = this;
  //var lastMove = 0;
  //this.el.addEventListener("handpose", function (e) {
  //if (Date.now() - lastMove > 500) {
  //lastMove = Date.now();
  //handpos = e.detail.position;
  //console.log(handpos);
  //}
  //});
  //},
});
