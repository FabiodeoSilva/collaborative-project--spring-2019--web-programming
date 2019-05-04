## Chrome Extension Development Testing

\*Before using this testing place, make sure you create your own branch for testing. This way we don't clutter this file.

When done with an issue, save it in a javascript file in the dev branch until the main framework is done.\*

### How to install a chrome extension on developer mode

1. Open the chrome extension page
2. Make sure developer mode is on (top right corner)
3. click on "load unpacked" and choose this folder - "chrome-extension-test"

### How a chrome extension works

1. There are three javascript files required for a chrome extension to work:
- manifest.json
- background.js
- your javascript files aka content_scripts
2. Manifest.json is a configuration file. It's how the chrome extension knows what is the title, the version, the thumbnail image, the decription, which URLs to activate this extension, and most importantly, the name of each js file being used.
3. background.js is a javascript file that have access to many powerful features of the browser itself, but it cannot interact with the DOM. This file can access your browser history, the window size and window position on the screen, create and close tabs/windows, the storage so that it remembers things you did in other pages, and much more.
4. Content scripts are the files that we're going to create, it can do anything on the DOM of all.

### Developing

1. Keep your chrome extension page open.
2. The only file we are really concerned about is the content scripts. Your code goes in there.
3. To see any results after changing your content files, go to the chrome extension page and click on the circular arrow button for refresh. This is how the broswer updates your work.
4. Go to the page you are testing and refresh that page, to see the results.
