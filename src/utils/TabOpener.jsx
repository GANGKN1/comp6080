export const TabOpener = (url) => {
  if (url) {
    const newTabToOpen = window.open(url, '_blank', 'noopener,noreferrer');
    if (newTabToOpen) {
      newTabToOpen.opener = null;
    }
  }
};
