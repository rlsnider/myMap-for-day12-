import dummyData from './dummy.json' assert {type: 'json'};;

//const apiKey = 'fsq3Y3ke4l0wzO37KmBodosczZnNv3YKY/7wFeg2Ou6MxlE=';

const getLocation = async () => {
  let res = await new Promise((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return res.coords;
}

const queryPlaces = async (lat, long) => {
  // if (!!dummyData) return dummyData;
  let categories = ['coffee', 'restaurant', 'hotel', 'market'];

//   const options = {
//     method: 'GET',
//     headers: {
//       Accept: 'application/json',
//       Authorization: apiKey
//     }
 };

//   let promises = [];
//   categories.forEach(category => {
//     promises.push(fetch(`https://api.foursquare.com/v3/places/search?query=${category}&ll=${lat},${long}&limit=5`, options));
//   })
//   let res = await Promise.all(promises);

//   promises = [];
//   res.forEach(response => promises.push(response.json()));
//   let data = await Promise.all(promises);

//   let result = {};
//   data.forEach((val, idx) => {
//     result[categories[idx]] = val;
//   })

//   console.log(result);
//   return result;
// }

const main = async () => {
  let { latitude, longitude } = await getLocation();

  // Create Map
  var map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Mark user location
 
 L.marker([latitude, longitude]).bindPopup('You are here!').addTo(map);

  let data = await queryPlaces(latitude, longitude);

  let layers = {};

  Object.entries(data).forEach(([ layerName, { results } ]) => {
    let markers = [];
    results.forEach(({ geocodes: { main: { latitude, longitude }}, name }) => {
      markers.push(L.marker([latitude, longitude]).bindPopup(name));
    })
    layers[`${layerName[0].toUpperCase()}${layerName.substr(1)}`] = L.layerGroup(markers);
  })

  L.control.layers({}, layers).addTo(map);
}

window.addEventListener('load', main)