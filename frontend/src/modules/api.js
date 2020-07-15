function getApiUri () {
  let dockerUri = `http://${window.location.hostname}:3100/api`;
  let productionUri = `https://${window.location.hostname}/api`;
  
  if (window.location.hostname.indexOf("localhost") > -1) {
    return dockerUri;
  } else {
    return productionUri;
  }
}

function getSocketUri () {
  let dockerUri = `http://${window.location.hostname}:3100`;
  let productionUri = `https://${window.location.hostname}`;
  
  if (window.location.hostname.indexOf("localhost") > -1) {
    return dockerUri;
  } else {
    return productionUri;
  }
}

const api = {
  baseUri: getApiUri(),
  socketUri: getSocketUri()
};

export default api;