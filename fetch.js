/*
 * bare v1
*/

// https://example.com/
fetch("/v1", {
  headers: {
    "x-bare-host": "example.com",
    "x-bare-port": 443,
    "x-bare-protocol": "https:",
    "x-bare-path": "/",
    "x-bare-headers": "{}",
    "x-bare-forward-headers": "[]"
  }
});
