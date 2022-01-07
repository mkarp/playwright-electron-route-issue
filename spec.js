const { _electron: electron } = require("playwright");

(async function () {
  const app = await electron.launch({
    args: ["main.js"].concat(process.argv.slice(2)),
  });
  const page = await app.firstWindow();

  await page.route("https://test/foo", (route) => {
    console.log("Mocking HTTP response...");
    route.fulfill({
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ hello: "world" }),
    });
  });

  console.log("Waiting for HTTP response...");

  const response = await page.waitForResponse("https://test/foo");
  console.log("Received HTTP", response.status());
  console.assert(response.status() == 200, "Should return HTTP 200");

  // Uncomment to leave Electron app open to inspect DevTools
  // await page.waitForSelector("#timeout");
  await app.close();
})();
