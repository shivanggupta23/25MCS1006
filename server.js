require("dotenv").config();
const express = require("express");
const { authenticate, setToken } = require("./logging_middleware");
const vehicleRouter = require("./vehicle_maintence_scheduler/index");
const notificationRouter = require("./notification_app_be/routes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const credentials = {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL_NO,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };

  try {
    const token = await authenticate(credentials);
    setToken(token);
    console.log("Authenticated successfully. Token acquired.");

    app.use("/vehicle", vehicleRouter);
    app.use("/notifications", notificationRouter);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Test vehicle: GET http://localhost:${PORT}/vehicle/schedule`);
      console.log(`Test notifications: GET http://localhost:${PORT}/notifications/notifications?limit=10`);
    });
  } catch (err) {
    console.error("Startup failed:", err.response?.data || err.message);
    process.exit(1);
  }
}

bootstrap();