var enabled;
const main = async () => {
    enabled = await getFromStorage('OJT_1', '');
}

const checkElementLoaded = (selector, callback, interval = 100, timeout = 5000) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(checkInterval);
            callback(element);
        } else if (Date.now() - startTime > timeout) {
            clearInterval(checkInterval);
            console.error(`Element ${selector} not found within ${timeout}ms`);
        }
    }, interval);
};

window.onload = async () => {
    await main().then(() => {
        if (enabled) {
            checkElementLoaded("#navbarSupportedContent > form > a", (submitBtn) => {
                submitBtn.click();
            });
        }
    });
};