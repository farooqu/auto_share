// eslint-disable-next-line func-names
(function () {
  const shareType = window.prompt("Share with 'followers' or 'party'", 'followers');
  const statusDiv = document.createElement('div');
  const statusDivColor = shareType === 'party' ? 'green' : 'red';
  statusDiv.style.cssText = `position: fixed; top: 0px; left: 0px; z-index: 9999; color: white; background: ${statusDivColor}; padding: 2px`;
  document.body.appendChild(statusDiv);

  // Poshmark seems to be switching back and forth between these two selectors
  const selectors = document.querySelectorAll('.share').length
    ? {
      loadingIndicatorId: '#infinite-scroll',
      inventoryTagClass: '.inventory-tag',
      shareButtonClass: '.share',
      shareModalId: '#share-popup',
      followerShareClass: `.pm-${shareType}-share-link`,
    }
    : {
      loadingIndicatorId: '#infinite-scroll',
      inventoryTagClass: '.tile__inventory-tag',
      shareButtonClass: '.social-action-bar__share',
      shareModalId: '.share-modal',
      followerShareClass: `[data-et-name=share_poshmark${shareType === 'party' ? '_poshparty' : ''}]`,
    };

  const getWindowHeight = () => document.body.offsetHeight;

  const scrollToBottomOfPage = () => {
    statusDiv.innerText = 'Scrolling...';
    window.scrollTo(0, getWindowHeight());
  };

  const getAllTiles = () => document.querySelectorAll('.tile');

  const getActiveTiles = () => {
    const allTiles = getAllTiles();
    return Array.prototype.filter.call(
      allTiles,
      (tile) => tile.querySelector(selectors.inventoryTagClass) === null,
    );
  };

  const getShareButton = (t) => t.querySelector(selectors.shareButtonClass);

  const waitForElement = async (selector) => {
    while (document.querySelector(selector) === null) {
      /* eslint-disable-next-line no-await-in-loop */
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  };

  const shareActiveListings = () => {
    statusDiv.innerText = 'Starting to share items.';
    const activeTiles = getActiveTiles();
    let currentTileIndex = 0;
    const shareNextActiveTile = async () => {
      statusDiv.innerText = `Item ${currentTileIndex + 1} of ${activeTiles.length}, sharing...`;
      const currentTile = activeTiles[currentTileIndex];
      currentTileIndex += 1;
      const shareButton = getShareButton(currentTile);
      shareButton.click();
      await waitForElement(selectors.shareModalId);
      const shareToFollowersButton = await waitForElement(selectors.followerShareClass);
      shareToFollowersButton.click();
      if (currentTileIndex < activeTiles.length) {
        const waitTime = Math.floor(Math.random() * Math.floor(4)) + 1;
        window.setTimeout(shareNextActiveTile, waitTime * 1000);
        statusDiv.innerText = `Item ${currentTileIndex} of ${activeTiles.length}, shared, waiting...`;
      } else {
        window.alert('All Done Meri Jaan! I love you!');
        statusDiv.remove();
      }
    };
    shareNextActiveTile();
  };

  const isLoading = () => !!document.querySelector(selectors.loadingIndicatorId)?.offsetParent;

  let lastWindowHeight;
  const intervalId = window.setInterval(() => {
    if (!isLoading()) {
      statusDiv.innerText = 'Checking Height...';
      const newHeight = getWindowHeight();
      if (newHeight !== lastWindowHeight) {
        lastWindowHeight = newHeight;
        scrollToBottomOfPage();
      } else {
        window.clearInterval(intervalId);
        shareActiveListings();
      }
    }
  }, 1000);
}());
