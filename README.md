# Project Setup Instructions

## Interface: Android

1. **Update API URL**  
    Before proceeding, update the `utils/api.ts` file. Replace the URL `http://192.168.29.179:3000` with your LAN IP address.

2. **Install Dependencies**  
    ```bash
    npm i
    ```

3. **Start the Project**  
    ```bash
    npx expo start
    ```

4. **Run on Phone**  
    Scan the QR code displayed in the terminal or Expo Developer Tools and open the app on your phone.

---

## Server

1. **Install Dependencies**  
    ```bash
    npm i
    ```

2. **Start the Server**  
    - For development:
      ```bash
      npm run dev
      ```
    - For production:
      ```bash
      npm build
      npm start
      ```