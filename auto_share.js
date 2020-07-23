(function () {
  const ajaxSuccessEvent = "lprequestend";
  const shareButtonSelector = ".social-action-bar__share";
  const followerShareClass = ".internal-share__link";

  const isVisible = (el) =>
    el.offsetParent !== null || getComputedStyle(el).display !== "none";
  const getCaptchaElement = () => document.querySelector("#captcha-popup");
  const getWindowHeight = () => document.body.offsetHeight;
  const scrollToBottomOfPage = () => window.scrollTo(0, getWindowHeight());
  const tileContainsInventoryTag = (tile) => {
    const inventoryTagSelector = ".tile__inventory-tag";
    return tile.querySelector(inventoryTagSelector) !== null;
  };
  const getAllTiles = () => document.querySelectorAll(".tile");
  const getActiveTiles = () => {
    return Array.prototype.filter.call(
      getAllTiles(),
      (tile) => !tileContainsInventoryTag(tile)
    );
  };
  const getShareButton = (t) => t.querySelector(shareButtonSelector);

  const shareActiveListings = () => {
    const activeTiles = getActiveTiles();
    let currentTileIndex = 0;
    let captchaEl = getCaptchaElement();

    const shareNextActiveTile = () => {
      captchaEl = captchaEl || getCaptchaElement();

      if (!captchaEl || !isVisible(captchaEl)) {
        const currentTile = activeTiles[currentTileIndex++];
        const shareButton = getShareButton(currentTile);
        const mainNode = document.querySelector("#app main");
        const shareModalSelector = ".share-modal";

        const observer = new MutationObserver((mutations) => {
          const shareModalNode = mainNode.querySelector(shareModalSelector);
          if (shareModalNode) {
            const shareToFollowersButton = shareModalNode.querySelector(
              followerShareClass
            );
            shareToFollowersButton.click();

            if (currentTileIndex < activeTiles.length) {
              window.setTimeout(shareNextActiveTile, 500);
            }
            observer.disconnect();
          }
        });

        observer.observe(document, {
          childList: true,
          subtree: true,
        });

        shareButton.click();
      }
    };
    shareNextActiveTile();
  };

  let lastWindowHeight = 0;

  const loadCloset = () => {
    const newHeight = getWindowHeight();
    const allTiles = getAllTiles();
    const lastTile = allTiles[allTiles.length - 1];
    const lastTileContainsInventoryTag = tileContainsInventoryTag(lastTile);

    if (newHeight !== lastWindowHeight && !lastTileContainsInventoryTag) {
      lastWindowHeight = newHeight;
      scrollToBottomOfPage();
    } else {
      window.removeEventListener(ajaxSuccessEvent, loadCloset);
      shareActiveListings();
    }
  };

  window.addEventListener(ajaxSuccessEvent, loadCloset);
  loadCloset();
})();
