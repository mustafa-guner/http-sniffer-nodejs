import * as util from "util";
import * as url from "url";
import * as http from "http";

const timeStamp = () => new Date().toISOString();
const Node_SERVER = http.createServer();
const PORT = "http://localhost:4000";

export const sniffOn = (server) => {
  server.on("request", (req, res) => {
    console.log(`${timeStamp()} request`);
    console.log(`${timeStamp()} ${reqToString(req)}`);
  });

  server.on("close", (errno) =>
    console.log(`${timeStamp()} close errNo: ${errno}`)
  );

  server.on("checkContinue", (req, res) => {
    console.log(`${timeStamp()} checkContinue`);
    console.log(`${timeStamp()} ${reqToString(req)}`);
    res.writeContinue();
  });

  server.on("upgrade", (req, socket, head) => {
    console.log(`${timeStamp()} upgrade`);
    console.log(`${timeStamp()} ${reqToString(req)}`);
  });

  server.on("clientError", () => console.log("ClientError"));
};

export const reqToString = (req) => {
  let ret = `request: ${req.method} ${req.httpVersion} ${req.url}` + `\n`;
  ret += JSON.stringify(url.parse(req.url, true)) + `\n`;
  let keys = Object.keys(req.headers);
  for (let key of keys) {
    ret += `${key}: ${req.headers[key]}` + `\n`;
  }

  if (req.trailers) {
    ret += util.inspect(req.trailers) + `\n`;
    return ret;
  }
};

sniffOn(Node_SERVER);

Node_SERVER.listen(new URL(PORT).port, () =>
  console.log(`server is running on ${new URL(PORT).port}`)
);
