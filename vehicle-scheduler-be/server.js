const express = require("express");
const axios = require("axios");
const Log = require("./logger");
const knapsack = require("./scheduler");

const app = express();

app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aXZla3JhamF3YXQyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc4MjcxNjQ2MywiaWF0IjoxNzgyNzE1NTYzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjA0MWE3YzMtNzMwZC00MDUzLWI1NWQtMTY2MGU5NGE5N2FhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidml2ZWsgc2luZ2ggcmFqYXdhdCIsInN1YiI6ImVmYWQ0NWE3LTA2MzktNGZmMS1hMWJkLWI0MTFhNzRhN2JiMyJ9LCJlbWFpbCI6InZpdmVrcmFqYXdhdDIwMDVAZ21haWwuY29tIiwibmFtZSI6InZpdmVrIHNpbmdoIHJhamF3YXQiLCJyb2xsTm8iOiIxY2QyM2VjMTg2IiwiYWNjZXNzQ29kZSI6IkFwbnBUbSIsImNsaWVudElEIjoiZWZhZDQ1YTctMDYzOS00ZmYxLWExYmQtYjQxMWE3NGE3YmIzIiwiY2xpZW50U2VjcmV0IjoiVUpNcUZxc1JwWWJnU0dGQSJ9.nu1RbrfCcsjAmH42n4Ps4ZueJjMr1FCF6CBpqyQXv-I";


const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

app.get("/", (req, res) => {
  res.send("Vehicle Scheduler Running");
});

app.get("/vehicles", async (req, res) => {
  try {
    await Log("backend", "info", "route", "Fetching vehicle data");

    const depotsResponse = await axios.get(
      "http://4.224.186.213/evaluation-service/depots",
      { headers }
    );

    const vehiclesResponse = await axios.get(
      "http://4.224.186.213/evaluation-service/vehicles",
      { headers }
    );

    const depots = depotsResponse.data.depots;
    const vehicles = vehiclesResponse.data.vehicles;

    let answer = [];

    for (let depot of depots) {
      const schedule = knapsack(vehicles, depot.MechanicHours);

      answer.push({
        DepotID: depot.ID,
        MechanicHours: depot.MechanicHours,
        SelectedVehicles: schedule.selectedVehicles,
        TotalImpact: schedule.totalImpact,
        TotalDuration: schedule.totalDuration,
      });
    }

    res.status(200).json(answer);
  } catch (err) {
    await Log("backend", "error", "route", err.message);

    res.status(500).json({
      message: err.response?.data || err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});