const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

let authToken = null;

async function authenticate(credentials) {
  const response = await axios.post(`${BASE_URL}/auth`, credentials);
  authToken = response.data.access_token;
  return authToken;
}

function setToken(token) {
  authToken = token;
}

function getToken() {
  return authToken;
}

async function Log(stack, level, packageName, message) {
  if (!authToken) {
    console.warn("Log skipped: no auth token set");
    return;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/logs`,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Log failed:", err.response?.data || err.message);
  }
}

module.exports = { Log, authenticate, setToken, getToken };