(function () {
  const shareType = window.prompt(
    "Share with 'followers' or 'party'",
    "followers"
  );
  const statusDiv = document.createElement("div");
  const statusDivColor = shareType === "party" ? "green" : "red";
  statusDiv.style.cssText = `position: fixed; top: 0px; left: 0px; z-index: 9999; color: white; background: ${statusDivColor}; padding: 2px`;
  document.body.appendChild(statusDiv);

  // Poshmark seems to be switching back and forth between these two selectors
  const selectors = document.querySelectorAll(".share").length
    ? {
        captcha: ".modal iframe[src*='captcha']",
        inventoryTagClass: ".inventory-tag",
        shareButtonClass: ".share",
        shareModalId: "#share-popup",
        followerShareClass: `.pm-${shareType}-share-link`,
      }
    : {
        captcha: ".modal iframe[src*='captcha']",
        inventoryTagClass: ".tile__inventory-tag",
        shareButtonClass: ".social-action-bar__share",
        shareModalId: ".share-modal",
        followerShareClass: `[data-et-name=share_poshmark${
          shareType === "party" ? "_poshparty" : ""
        }]`,
      };

  const isVisible = (el) =>
    !!el && (!!el.offsetParent || !!getComputedStyle(el).display);

  const getCaptcha = () => document.querySelector(selectors.captcha);

  const getAllTiles = () => document.querySelectorAll(".tile");

  const getActiveTiles = () =>
    Array.prototype.filter.call(
      getAllTiles(),
      (tile) => tile.querySelector(selectors.inventoryTagClass) === null
    );

  const getShareButton = (t) => t.querySelector(selectors.shareButtonClass);

  const waitForElement = async (selector) => {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  };

  const shareActiveListings = () => {
    statusDiv.innerText = "Starting to share items.";

    const activeTiles = getActiveTiles().reverse();
    let currentTileIndex = 0;

    const shareNextActiveTile = async () => {
      const captchaVisible = isVisible(getCaptcha());

      if (!captchaVisible) {
        statusDiv.innerText = `Item ${currentTileIndex + 1} of ${
          activeTiles.length
        }, sharing...`;

        const currentTile = activeTiles[currentTileIndex];
        currentTileIndex += 1;

        const shareButton = getShareButton(currentTile);
        shareButton.click();

        await waitForElement(selectors.shareModalId);

        const shareToFollowersButton = await waitForElement(
          selectors.followerShareClass
        );
        shareToFollowersButton.click();
      }

      if (currentTileIndex < activeTiles.length) {
        const waitTime = Math.floor(Math.random() * Math.floor(4)) + 1;

        statusDiv.innerText = `Item ${currentTileIndex} of ${
          activeTiles.length
        }, ${
          captchaVisible ? "captcha present" : "shared"
        }, waiting ${waitTime} seconds...`;

        window.setTimeout(shareNextActiveTile, waitTime * 1000);
      } else {
        window.alert("All Done Meri Jaan! I love you!");
        statusDiv.remove();
      }
    };

    shareNextActiveTile();
  };

  shareActiveListings();
})();
