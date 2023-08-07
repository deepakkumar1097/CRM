const Client = require("node-rest-client");
const client = new Client.Client();

module.exports = (subject, content, recepient, requester) => {
  /**
   * Need to call that notification POST api
   */

  const reqBody = {
    subject: subject,
    recepientEmail: recepient,
    content: content,
    requester: requester,
  };

  const reqHeaders = {
    "Content-Type": "application/json",
  };

  const args = {
    data: reqBody,
    headers: reqHeaders,
  };

  client.post(
    "http://localhost:7500/notificationService/api/v1/notification",
    args,
    (data, res) => {
      console.log(`Request Sent : ${data}`);
    }
  );
};
