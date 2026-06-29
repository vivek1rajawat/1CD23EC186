const axios = require("axios");
const Log = require("./logger");

const NOTIFICATION_API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aXZla3JhamF3YXQyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc4MjcxNjQ2MywiaWF0IjoxNzgyNzE1NTYzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjA0MWE3YzMtNzMwZC00MDUzLWI1NWQtMTY2MGU5NGE5N2FhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidml2ZWsgc2luZ2ggcmFqYXdhdCIsInN1YiI6ImVmYWQ0NWE3LTA2MzktNGZmMS1hMWJkLWI0MTFhNzRhN2JiMyJ9LCJlbWFpbCI6InZpdmVrcmFqYXdhdDIwMDVAZ21haWwuY29tIiwibmFtZSI6InZpdmVrIHNpbmdoIHJhamF3YXQiLCJyb2xsTm8iOiIxY2QyM2VjMTg2IiwiYWNjZXNzQ29kZSI6IkFwbnBUbSIsImNsaWVudElEIjoiZWZhZDQ1YTctMDYzOS00ZmYxLWExYmQtYjQxMWE3NGE3YmIzIiwiY2xpZW50U2VjcmV0IjoiVUpNcUZxc1JwWWJnU0dGQSJ9.nu1RbrfCcsjAmH42n4Ps4ZueJjMr1FCF6CBpqyQXv-I";

function getTypeWeight(type) {
  if (type === "Placement") return 3;
  if (type === "Result") return 2;
  if (type === "Event") return 1;
  return 0;
}

async function getPriorityInbox() {
  try {
    await Log("backend", "info", "route", "Fetching all notifications for sorting");

    const response = await axios.get(NOTIFICATION_API, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const notifications = response.data.notifications || [];

    const sorted = notifications.sort((a, b) => {
      const weightA = getTypeWeight(a.Type);
      const weightB = getTypeWeight(b.Type);

      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sorted.slice(0, 10);

    console.dir(top10, { depth: null });
    await Log("backend", "info", "route", "Priority inbox top 10 generated successfully");
    
    return top10;
  } catch (error) {
    await Log("backend", "error", "route", error.message);
  }
}

getPriorityInbox();