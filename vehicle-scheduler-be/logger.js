const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aXZla3JhamF3YXQyMDA1QGdtYWlsLmNvbSIsImV4cCI6MTc4MjcxNjQ2MywiaWF0IjoxNzgyNzE1NTYzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjA0MWE3YzMtNzMwZC00MDUzLWI1NWQtMTY2MGU5NGE5N2FhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidml2ZWsgc2luZ2ggcmFqYXdhdCIsInN1YiI6ImVmYWQ0NWE3LTA2MzktNGZmMS1hMWJkLWI0MTFhNzRhN2JiMyJ9LCJlbWFpbCI6InZpdmVrcmFqYXdhdDIwMDVAZ21haWwuY29tIiwibmFtZSI6InZpdmVrIHNpbmdoIHJhamF3YXQiLCJyb2xsTm8iOiIxY2QyM2VjMTg2IiwiYWNjZXNzQ29kZSI6IkFwbnBUbSIsImNsaWVudElEIjoiZWZhZDQ1YTctMDYzOS00ZmYxLWExYmQtYjQxMWE3NGE3YmIzIiwiY2xpZW50U2VjcmV0IjoiVUpNcUZxc1JwWWJnU0dGQSJ9.nu1RbrfCcsjAmH42n4Ps4ZueJjMr1FCF6CBpqyQXv-I";

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log Success:", response.data);
  } catch (err) {
    console.log(
      "Log Failed:",
      err.response?.data || err.message
    );
  }
}

module.exports = Log;