import getPercentage from "./scripts/utils.js";
// const { getPercentage } = require("./scripts/utils.js").default;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  
  
  
  function isGoogleURL(url) {
  return url.startsWith("https://www.google.") || url.startsWith("http://www.google.");
}
  if (
    !isGoogleURL(tab.url) && (changeInfo.status === "complete") &&
    tab.url !== "chrome://newtab/" &&
    tab.url !== "chrome://extensions/"
  ) {
    // Get the current active tab
    const currentTabUrl = tab.url;
    console.log("Current tab URL:", currentTabUrl);
    // Check if the URL is already present in session storage
    chrome.storage.sync.get(currentTabUrl, async function (result) {
      const res = result[currentTabUrl];
      let safenessPercentage1;
      let cnt;
      if (res) {
        safenessPercentage1 = res["safe"];
        cnt = res["count"];
      }
      console.log(result[currentTabUrl]);
      let safenessPercentage = safenessPercentage1;
      if (typeof safenessPercentage1 === "undefined" || cnt < 2) {
        console.log("Inside Getpercent");
        let safenessPercentage2 = await getPercentage(currentTabUrl);
        safenessPercentage = safenessPercentage2;
      } else {
        // console.log("Url Already Present!!");
      }
      console.log(
        `The safeness percentage of ${currentTabUrl} is ${safenessPercentage}`
      );
      console.log(safenessPercentage);
      if (safenessPercentage === -1) {
        console.log("No connection");
      } else {
        if (safenessPercentage != safenessPercentage1 || cnt < 2) {
          const data = {};
          data[currentTabUrl] = {
            safe: safenessPercentage,
            count: 0,
          };
          if (typeof cnt === "undefined") {
            data[currentTabUrl]["count"] = 1;
          } else {
            data[currentTabUrl]["count"] = cnt + 1;
          }
          chrome.storage.sync.set(data, function () {
            console.log("Data stored", JSON.stringify(data));
          });
        } else {
          // console.log("Url Exists not saving");
        }
        if (safenessPercentage >= 0.5) {
          console.log("Good and safe");
          chrome.tabs.sendMessage(
            tabId,
            {
              type: "showSafeMessage",
              message: "This website is Safe.",
              percent: safenessPercentage,
            },
            function (response) {
              console.log("Message sent to content script:", response);
            }
          );
        } else {
          // Send a message to the content script to show an error message
          chrome.tabs.sendMessage(
            tabId,
            {
              type: "showErrorMessage",
              message: "Caution : Phishing Might Occur !",
              percent: safenessPercentage,
            },
            function (response) {
              console.log("Message sent to content script:", response);
            }
          );
        }
      }
    });
  }
});

// In background.js
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.type === "showNotification") {
//     console.log("In bg Notify");
//     chrome.notifications.create(
//       "Name",{
//         type: "basic",
//         title: "Safe Website",
//         message: "Hello All",
//         iconUrl: "icons/128.png",
//       },
//         function () {
//           console.log("Notification Done");
//       }
//     );
//   }
// });
