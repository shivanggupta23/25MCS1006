const express = require("express");
const { fetchNotifications } = require("./notificationService");
const { getTopN } = require("./priorityInbox");
const { Log, getToken } = require("../logging_middleware");

const router = express.Router();

router.get("/notifications", async (req, res) => {
  const token = getToken();
  const limit = parseInt(req.query.limit) || 10;

  if (!token) {
    return res.status(401).json({ success: false, error: "No auth token available" });
  }

  try {
    await Log("backend", "info", "route", `Received request for top ${limit} priority notifications`);

    const notifications = await fetchNotifications(token);
    await Log("backend", "info", "service", `Fetched ${notifications.length} notifications from evaluation service`);

    const top = getTopN(notifications, limit);
    await Log("backend", "info", "handler", `Returning ${top.length} priority notifications to client`);

    res.json({ success: true, total: notifications.length, returned: top.length, data: top });
  } catch (err) {
    await Log("backend", "error", "handler", `Notification fetch failed: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;