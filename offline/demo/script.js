// Check if service worker is supported by our browser
if (navigator.serviceWorker) {
  // Register the service worker

  navigator.serviceWorker
    // by default the scope of SW is global, so we can also define a folder in scope and it will only listen to events in that folder
    .register("./sw.js", {
      scope: "./",
    })
    .then((res) => {
      console.log("Service worker registered successfully");
    })
    .catch((err) => {
      console.log("Error registering service worker", err);
    });
}
