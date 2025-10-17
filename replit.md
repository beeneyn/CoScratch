# LiveScratch Backend

## Overview
LiveScratch is a real-time collaborative platform that enables multiple users to work together on Scratch projects simultaneously. This repository contains:
- **Backend API**: Node.js/Express server with Socket.IO for real-time collaboration
- **Browser Extension**: Chrome/browser extension that integrates with scratch.mit.edu

## Project Structure
- `backend/` - Node.js backend server
  - `index.js` - Main server file
  - `WebSockets.js` - Socket.IO implementation
  - `utils/` - Utility modules (authentication, file storage, user management, etc.)
  - `storage/` - Runtime data storage (created automatically)
- `extension/` - Browser extension files
  - `manifest.json` - Extension configuration
  - `background/` - Service worker scripts
  - `scripts/` - Content scripts for Scratch integration
  - `popups/` - Extension popup interface

## Current Configuration
- **Backend Port**: 3000 (localhost)
- **Server Type**: REST API + WebSocket server
- **Process Manager**: PM2 (configured but using direct Node.js execution in Replit)
- **Environment**: Development

## Environment Variables
Located in `backend/.env`:
- `PORT`: Server port (3000)
- `CHAT_WEBHOOK_URL`: Discord webhook for chat notifications
- `ADMIN_USER`: Basic auth credentials for admin endpoints
- `AUTH_PROJECTS`: Array of authorized Scratch project IDs
- `ADMIN`: Array of admin usernames

## Running the Project
The backend server starts automatically via the configured workflow. To manually start:
```bash
cd backend && node index.js
```

## Key Features
- Real-time collaborative Scratch project editing
- User authentication via Scratch credentials
- Project sharing and permissions management
- Chat functionality with profanity filtering
- Active user tracking
- Admin dashboard endpoints

## API Endpoints
- `GET /` - API status
- `POST /newProject/:scratchId/:owner` - Create new project
- `GET /projectJSON/:lsId` - Get project JSON
- `POST /projectSavedJSON/:lsId/:version` - Save project
- `GET /changesSince/:id/:version` - Get changes since version
- `GET /share/:id` - Get shared users list
- `PUT /share/:id/:to/:from` - Share project
- And many more...

## Recent Changes
- 2025-10-17: Initial Replit environment setup
  - Installed Node.js 20
  - Configured backend workflow on port 3000
  - Created .env with default configuration
  - Created storage directory
  - Updated .gitignore for Node.js project

## Notes
- This is a backend API server only - no web frontend interface
- The browser extension connects to this backend for real-time collaboration
- Storage data is saved in `backend/storage/` and persists between runs
