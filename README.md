# ⚡ Zero-Auth Instant Hotline Chat

A zero-friction, zero-auth direct chat and picture pipeline designed to connect two devices immediately without logins, OTPs, phone numbers, or passwords.

## Features
- **Zero Authentication**: Open the link on any PC, phone, or tablet &mdash; automatically connects.
- **Instant Photo Sharing**:
  - Paste screenshots directly using `Ctrl + V`.
  - Drag and drop pictures into the chat window.
  - Camera & gallery file picker.
  - Automatic client-side image compression (instant delivery of high-res photos).
- **Sound Alerts**: Built-in chime for incoming messages (Web Audio API, no external assets needed).
- **Auto-Persistent**: Remembers recent conversation in `messages.json`.
- **Wipe Chat**: 1-click button to clear all messages and photos for both parties.

## Running Locally
```bash
npm start
```
Open in browser:
- On your PC: `http://localhost:3000`
- On your phone or friend's device (same Wi-Fi): `http://<your-local-ip>:3000`

## Free 1-Click Hosting (for remote access anywhere)
You can deploy this to **[Render](https://render.com)** or **[Railway](https://railway.app)**:
1. Push this folder to a GitHub repository.
2. In Render / Railway, click **New Web Service** and select the repository.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. You'll get a free live URL (e.g. `https://my-hotline.onrender.com`). Bookmark it on both devices and you're set!
