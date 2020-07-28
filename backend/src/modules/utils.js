module.exports = {
  getUserHash: function(userId) {
    return 'user:' + userId;
  },
  getGroupHash: function(groupId) {
    return 'group:' + groupId;
  },
  getRocketHash: function(groupId) {
    return 'rocket:' + groupId;
  },
  objectToStorageArray: function(object) {
    const keys = Object.keys(object);
    let storageArray = [];
    keys.forEach(key => {
      storageArray.push(key);
      storageArray.push(object[key]);
    });
    return storageArray;
  }
}