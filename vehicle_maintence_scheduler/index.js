const express = require("express");
const { fetchDepots, fetchVehicles } = require("./depotService");
const { knapsack } = require("./scheduler");
const { Log, getToken } = require("../logging_middleware");

const router = express.Router();

router.get("/schedule", async (req, res) => {
  const token = getToken();

  if (!token) {
    return res.status(401).json({ success: false, error: "No auth token available" });
  }

  try {
    await Log("backend", "info", "route", "Received request to schedule vehicle maintenance");

    const depots = await fetchDepots(token);
    await Log("backend", "info", "service", `Fetched ${depots.length} depots from evaluation service`);

    const vehicles = await fetchVehicles(token);
    await Log("backend", "info", "service", `Fetched ${vehicles.length} vehicles from evaluation service`);

    const results = depots.map((depot) => {
      const result = knapsack(vehicles, depot.MechanicHours);
      return {
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        totalImpact: result.totalImpact,
        totalDuration: result.totalDuration,
        selectedVehicles: result.selectedVehicles,
      };
    });

    await Log("backend", "info", "handler", `Scheduling complete for ${results.length} depots`);

    res.json({ success: true, data: results });
  } catch (err) {
    await Log("backend", "error", "handler", `Vehicle scheduling failed: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;