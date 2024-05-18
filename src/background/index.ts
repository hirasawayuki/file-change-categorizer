import { ChromeEvent } from "@/types/event";

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    const event: ChromeEvent ={
      type: 'urlChanged',
      url: changeInfo.url,
    }

    chrome.tabs.sendMessage(tabId, event)
  }
});
