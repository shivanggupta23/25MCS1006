const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

async function fetchDepots(token) {
  const response = await axios.get(`${BASE_URL}/depots`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.depots;
}

async function fetchVehicles(token) {
  const response = await axios.get(`${BASE_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.vehicles;
}

module.exports = { fetchDepots, fetchVehicles };