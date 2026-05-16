const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

async function fetchNotifications(token) {
  const response = await axios.get(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.notifications;
}

module.exports = { fetchNotifications };