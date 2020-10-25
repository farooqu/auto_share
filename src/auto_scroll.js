(function () {
  const isLoading = () =>
    !!document.querySelector("#infinite-scroll")?.offsetParent;

  const getWindowHeight = () => document.body.offsetHeight;

  const scrollToBottomOfPage = () => {
    window.scrollTo(0, getWindowHeight());
  };

  let lastWindowHeight;
  const intervalId = window.setInterval(() => {
    if (!isLoading()) {
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
