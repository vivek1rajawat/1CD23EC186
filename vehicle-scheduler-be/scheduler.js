const Log = require("./logger");

function knapsack(vehicles, mechanicHours) {
  const n = vehicles.length;
  const W = mechanicHours;

  const dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const currentVehicle = vehicles[i - 1];
    const weight = currentVehicle.Duration;
    const value = currentVehicle.Impact;

    for (let w = 0; w <= W; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(value + dp[i - 1][w - weight], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let res = dp[n][W];
  let w = W;
  const selectedVehicles = [];
  let totalDuration = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res === dp[i - 1][w]) {
      continue;
    } else {
      selectedVehicles.push(vehicles[i - 1].TaskID);
      totalDuration += vehicles[i - 1].Duration;
      res -= vehicles[i - 1].Impact;
      w -= vehicles[i - 1].Duration;
    }
  }

  return {
    selectedVehicles: selectedVehicles.reverse(),
    totalImpact: dp[n][W],
    totalDuration: totalDuration
  };
}

module.exports = knapsack;