const PRIORITY_WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

function scoreNotification(notification) {
  const typeWeight = PRIORITY_WEIGHTS[notification.Type] || 0;
  const recency = new Date(notification.Timestamp).getTime();
  return { ...notification, score: typeWeight * 1e13 + recency };
}

function getTopN(notifications, n) {
  return notifications
    .map(scoreNotification)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

module.exports = { getTopN };