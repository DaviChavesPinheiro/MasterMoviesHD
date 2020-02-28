chrome.runtime.onInstalled.addListener(() => {
    console.log("installed")
})

chrome.bookmarks.onCreated.addListener(() => {
    alert("Bruh, i got it")
})