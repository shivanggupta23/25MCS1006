function knapsack(vehicles, capacity) {
  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const duration = vehicles[i - 1].Duration;
    const impact = vehicles[i - 1].Impact;

    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - duration] + impact);
      }
    }
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  return {
    selectedVehicles: selected,
    totalImpact: dp[n][capacity],
    totalDuration: selected.reduce((sum, v) => sum + v.Duration, 0),
  };
}

module.exports = { knapsack };