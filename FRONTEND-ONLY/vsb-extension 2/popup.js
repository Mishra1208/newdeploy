document.getElementById('open-vsb').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://vsb.concordia.ca' });
});
