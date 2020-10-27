(function () {
  const statusDiv = document.createElement("div");
  statusDiv.style.cssText = `position: fixed; top: 0px; left: 0px; z-index: 9999; color: white; background: orange; padding: 2px`;
  document.body.appendChild(statusDiv);

  const isLoading = () =>
    !!document.querySelector("#infinite-scroll")?.offsetParent;

  const getWindowHeight = () => document.body.offsetHeight;

  const scrollToBottomOfPage = () => {
    statusDiv.innerText = "Scrolling...";
    window.scrollTo(0, getWindowHeight());
  };

  let lastWindowHeight;
  const intervalId = window.setInterval(() => {
    if (!isLoading()) {
      statusDiv.innerText = "Checking Height...";
      const newHeight = getWindowHeight();
      if (newHeight !== lastWindowHeight) {
        lastWindowHeight = newHeight;
        scrollToBottomOfPage();
      } else {
        window.clearInterval(intervalId);
      }
    }
  }, 1000);
})();
