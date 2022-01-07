# Reproduction of an issue with Playwright and onBeforeRequest

It seems like if `electron.session.defaultSession.webRequest.onBeforeRequest()`
is used for any URLs, mocked HTTP responses using Playwright's `page.route()`
have status `0` for every URL. It's expected that status should be `200` or as
specified with `page.route({ status: 123 })`.

This small project illustrates this scenario. The code is kept to a bare minimum
to eliminate possible other causes.

Versions:

- macOS 12.1 M1
- Electron 16.0.6
- Playwright 1.17.1

Setup: `npm i`.

Try running `npx electron .` and check that the window opens.

Run the Playwright script with `node spec.js`. Electron's renderer app will try
to make a request to `https://test/foo` and Playwright should respond with a
mocked HTTP response using `page.route("https://test/foo")`. This command should
exit without errors:

```bash
$ node spec.js
Waiting for HTTP response...
Mocking HTTP response...
Received HTTP 200
```

Then try running `node spec.js --with-on-before-request`. It registers an
`onBeforeRequest` listener for a URL `https://electronjs.org/*`, and it is
expected that a request to `https://test/foo` should not be affected by it and
should succeed. However, the Playwright script won't exit in this scenario:

```bash
$ node spec.js --with-on-before-request
Waiting for HTTP response...
Mocking HTTP response...
node:internal/process/promises:246
          triggerUncaughtException(err, true /* fromPromise */);
          ^

page.waitForResponse: Timeout while waiting for event "response"
=========================== logs ===========================
waiting for response "https://test/foo"
============================================================
    at /Users/mkarp/Workspace/playwright-electron-route-issue/spec.js:20:31 {
  name: 'TimeoutError'
}
```

The renderer app will receive an HTTP response for `https://test/foo`, but it
will be missing almost all HTTP headers, and HTTP status will be `0`.
