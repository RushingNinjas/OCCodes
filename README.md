# Code Dispatch System

A two-application system for managing and dispatching emergency codes in healthcare facilities.

## Overview

This system consists of two web applications:

1. **Manager Portal** - For creating and maintaining templates, distribution lists, and system configuration
2. **Operator Portal** - For quickly dispatching codes using pre-configured templates

## Features

### Manager Portal
- **Template Management**: Create, edit, and version code dispatch templates
- **Distribution Lists**: Manage recipient lists with different permission levels
- **User & Role Management**: Configure operators and their permissions
- **Reporting & Audit Logs**: View dispatch history, delivery status, and export reports

### Operator Portal
- **Code Dispatch Dashboard**: Quick access to all active templates
- **Template Execution**: Fill in required fields and dispatch codes
- **Multi-Channel Dispatch**: Send via Email, SMS, Paging, and Voice/TTS
- **Real-time Status Tracking**: Monitor delivery status across all channels
- **Dispatch History**: View past dispatches and clone/re-dispatch

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Applications

#### Manager Portal (Port 3000)
```bash
npm run dev:manager
```
Open http://localhost:3000

#### Operator Portal (Port 3001)
```bash
npm run dev:operator
```
Open http://localhost:3001

### Building for Production

```bash
# Build Manager app
npm run build:manager

# Build Operator app
npm run build:operator
```

## Project Structure

```
codes-OC/
├── shared/              # Shared code between apps
│   ├── components/      # Reusable UI components
│   ├── services/        # Stub services for integrations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── manager-app/         # Manager portal application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   └── components/ # App-specific components
│   └── index.html
├── operator-app/        # Operator portal application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   └── components/  # App-specific components
│   └── index.html
└── package.json
```

## Stub Integrations

All external integrations are stubbed for now:

- **Email**: `shared/services/stubServices.ts` - `sendEmail()`
- **SMS**: `shared/services/stubServices.ts` - `sendSMS()`
- **Paging**: `shared/services/stubServices.ts` - `sendPager()`
- **Voice/TTS**: `shared/services/stubServices.ts` - `sendVoiceCall()`
- **Database**: `shared/services/stubServices.ts` - `dbService` (currently uses localStorage)

## Data Storage

Currently, the application uses browser localStorage for data persistence. In a production environment, this would be replaced with a proper backend API and database.

## Features Implemented

### Manager Portal
✅ Template creation and editing
✅ Template versioning and audit logs
✅ Template preview (Email, SMS, TTS)
✅ Distribution list management
✅ User and role configuration
✅ Reporting dashboard with filters
✅ CSV export functionality

### Operator Portal
✅ Template selection dashboard
✅ Dispatch flow with required fields
✅ Multi-channel dispatch
✅ Real-time delivery status
✅ Dispatch history
✅ Clone/re-dispatch functionality
✅ Retry failed deliveries

## Next Steps

To make this production-ready:

1. **Backend API**: Replace localStorage with a REST API
2. **Authentication**: Implement SSO/SAML/OAuth2
3. **Real Integrations**: Connect to actual email, SMS, paging, and TTS services
4. **Database**: Set up PostgreSQL/MongoDB for data persistence
5. **WebSockets**: Real-time status updates
6. **Notifications**: Push notifications for delivery failures
7. **Testing**: Add unit and integration tests

## License

This is a concept/prototype application.

