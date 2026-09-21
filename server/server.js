const app = require("./app");

const PORT = process.env.PORT || 8090;
app.listen(PORT);

console.log("Server at http://127.0.0.1:8090")
