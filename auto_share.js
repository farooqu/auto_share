(function(){
  const wait = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms )
    })
  }

    const  ajaxSuccessEvent = "lprequestend";
    const shareButtonSelector = ".social-action-bar__share";
    const shareModalSelector = ".share-modal";
    const followerShareClass = ".internal-share__link";

    const isVisible = el => el.offsetParent !== null || getComputedStyle(el).display !== "none";
    const getCaptchaElement = () => document.querySelector("#captcha-popup");
    const getWindowHeight = () => document.body.offsetHeight;
    const scrollToBottomOfPage = () => window.scrollTo(0, getWindowHeight());
    const tileContainsInventoryTag = tile => {
      const inventoryTagSelector = "[class*='inventory-tag']";
      return tile.querySelector(inventoryTagSelector) !== null;
    }
    const getAllTiles = () => document.querySelectorAll(".tile");
    const getActiveTiles = () => {
        const allTiles = getAllTiles();

        return Array.prototype.filter.call(allTiles,
            tile => !!tileContainsInventoryTag(tile))
    };
    const getShareButton = t => t.querySelector(shareButtonSelector);

    const shareActiveListings = async () => {
        const activeTiles = getActiveTiles();
        let currentTileIndex = 0;
        let captchaEl = getCaptchaElement();

        const shareNextActiveTile = async () => {
            captchaEl = captchaEl || getCaptchaElement();

            if (!captchaEl || !isVisible(captchaEl)){
                const currentTile = activeTiles[currentTileIndex++];
                const shareButton = getShareButton(currentTile);

                shareButton.click();
                await wait(100);
                const shareModal = document.querySelector(shareModalSelector);
                const shareToFollowersButton = shareModal.querySelector(followerShareClass);
                shareToFollowersButton.click();
            }

            if (currentTileIndex < activeTiles.length){
                window.setTimeout(shareNextActiveTile, 500);
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

        if (newHeight !== lastWindowHeight && !lastTileContainsInventoryTag){
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
