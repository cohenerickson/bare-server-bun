const validChars =
  "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserveChar = "%";
function encodeProtocol(protocol) {
  let result = "";
  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];
    if (validChars.includes(char) && char !== reserveChar) {
      result += char;
    } else {
      const code = char.charCodeAt(0);
      result += reserveChar + code.toString(16).padStart(2, "0");
    }
  }
  return result;
}

const ws = new WebSocket(
  "wss://cohenerickson-urban-rotary-phone-g69r6p5vgrwfvx99-8080.preview.app.github.dev/v1",
  [
    "bare",
    encodeProtocol(
      JSON.stringify({
        remote: {
          host: "example.org",
          port: 80,
          path: "/ws-path",
          protocol: "ws:"
        },
        headers: {
          Origin: "http://example.org",
          "Sec-WebSocket-Protocol": "original_websocket_protocol"
        },
        forward_headers: [
          "accept-encoding",
          "accept-language",
          "sec-websocket-extensions",
          "sec-websocket-key",
          "sec-websocket-version"
        ],
        id: "UniqueID_123"
      })
    )
  ]
);
ws.onopen = () => {
  ws.send("hello world");
};
ws.onmessage = (data) => {
  console.log(data.data);
};
