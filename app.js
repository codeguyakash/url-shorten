const cluster = require("node:cluster");
const os = require("os");
const express = require("express");

const numCPUs = os.cpus().length; //number of CPUs

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.get("/", (req, res) => {
    return res.json({
      message: `Hello Server ${process.pid} CPUs -> (${numCPUs})`,
    });
  });
  app.listen(PORT, () =>
    console.log(
      `Worker => ${process.pid} running on => http://localhost:${PORT}`
    )
  );
}
