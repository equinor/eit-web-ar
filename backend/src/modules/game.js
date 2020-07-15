const numberOfEntities = 3;
const numberOfMarkers = 6;

if (numberOfMarkers < numberOfEntities) {
  numberOfMarkers = numberOfEntities;
}

const game = {
  numberOfEntities: numberOfEntities,
  numberOfMarkers: numberOfMarkers
};

export default game;