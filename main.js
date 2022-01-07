const { BrowserWindow, app, session } = require("electron");

app.whenReady().then(function () {
  if (process.argv.includes("--with-on-before-request")) {
    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ["https://electronjs.org/*"] },
      function (details, callback) {
        console.log(
          "Making request to",
          details.url,
          details.referrer,
          details.requestHeaders
        );
        callback({});
      }
    );
  }

  const userDataPath = "/tmp/" + (Math.random() + 1).toString(36).substring(7);
  console.log("userData:", userDataPath);
  app.setPath("userData", userDataPath);

  const win = new BrowserWindow({
    x: 30,
    y: 30,
    width: 640,
    height: 480,
    title: "Test Electron Window",
  });
  win.loadFile("renderer.html");
  //   win.openDevTools();
});
