const Chatkit = require("@pusher/chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:f7156a69-5e8f-4554-a08b-df33b7e4e39c",
  key: "04625d1d-4808-4f3a-9bd7-eeda580e4474:TYPK3FLEOk9tf8rVrItOBRfoEa3H2GAY7t/FE4LYzwU="
});

module.exports = chatkit;
