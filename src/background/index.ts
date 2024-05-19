import { ChromeEvent } from "@/types/event";

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    const event: ChromeEvent ={
      type: 'urlChanged',
      url: changeInfo.url,
    }

    const promise = chrome.tabs.sendMessage(tabId, event)
    promise.catch(error => {
      console.log(error)
    })
  }
});
