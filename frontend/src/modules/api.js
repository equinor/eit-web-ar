function getApiUri () {
  let dockerUri = `http://${window.location.hostname}:3100/api`;
  let productionUri = `https://${window.location.hostname}/api`;
  
  if (window.location.hostname.indexOf("localhost") > -1) {
    return dockerUri;
  } else {
    return productionUri;
  }
}

const api = {
  baseUri: getApiUri()
};

export default api;