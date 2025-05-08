# وجبة في معلومة (Meal in Information)

## Automated Installation

1. Double-click `install.bat`
2. Click "Yes" to allow administrator privileges
3. Wait for the installation to complete
4. The app will automatically open in your browser

## Manual Installation (Alternative)

1. Install Node.js:
   - Download from: https://nodejs.org/
   - Install the LTS version

2. Install Git:
   - Download from: https://git-scm.com/
   - Install with default settings

3. Open Command Prompt and run:
   ```
   cd mealinfo
   npm install
   cd api
   npm install
   ```

4. Start the servers:
   ```
   cd ..
   npm start
   ```

5. Access the app:
   - Open browser
   - Go to: http://localhost:3000

## Important Notes
- Ensure ports 3000 and 3001 are available
- Keep both servers running for full functionality
- The app is optimized for Arabic language




----
Frontend:
React.js for the user interface
JavaScript/ES6+ for programming logic
CSS for styling (with RTL support for Arabic)
Backend:
Node.js with Express.js for the API server
JavaScript for server-side logic
Tools:
npm for package management
FFmpeg for video processing (used via Node.js)