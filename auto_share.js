(function(){
    const  ajaxSuccessEvent = "lprequestend";
    const inventoryTagClass = ".inventory-tag";
    const shareButtonClass = ".share";
    const shareModalId = "#share-popup";
    const followerShareClass = ".pm-followers-share-link";

    const getWindowHeight = () => document.body.offsetHeight;
    const scrollToBottomOfPage = () => window.scrollTo(0, getWindowHeight());
    const getAllTiles = () => document.querySelectorAll(".tile");
    const getActiveTiles = () => {
        const allTiles = getAllTiles();

        return Array.prototype.filter.call(allTiles, 
            tile => tile.querySelector(inventoryTagClass) === null)
    };
    const shuffle = (array) => {
      let currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };
    const getShareButton = t => t.querySelector(shareButtonClass);

    const shareActiveListings = () => {
        const shareModal = document.querySelector(shareModalId);
        const shareToFollowersButton = shareModal.querySelector(followerShareClass);
        const activeTiles = shuffle(getActiveTiles());
        let currentTileIndex = 0;

        const shareNextActiveTile = () => {
            const currentTile = activeTiles[currentTileIndex++];
            const shareButton = getShareButton(currentTile);

            shareButton.click();
            shareToFollowersButton.click();

            if(currentTileIndex < activeTiles.length){
                window.setTimeout(shareNextActiveTile, 500);
            }
        };
        shareNextActiveTile();
    };

    let lastWindowHeight = getWindowHeight();

    const checkHeightAndScroll = () => {
        const newHeight = getWindowHeight();
        if (newHeight !== lastWindowHeight){
            lastWindowHeight = newHeight;
            scrollToBottomOfPage();
        } else {
            window.removeEventListener(ajaxSuccessEvent, checkHeightAndScroll);
            shareActiveListings();
        }
    };

    window.addEventListener(ajaxSuccessEvent, checkHeightAndScroll);
    scrollToBottomOfPage();
})();
