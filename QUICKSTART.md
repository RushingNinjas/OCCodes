# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Applications

### Manager Portal
```bash
npm run dev:manager
```
Then open http://localhost:3000 in your browser.

### Operator Portal
```bash
npm run dev:operator
```
Then open http://localhost:3001 in your browser.

## First Steps

### Manager Portal

1. **Create a Distribution List:**
   - Navigate to "Distribution Lists"
   - Click "Create List"
   - Add members (users, email addresses, phone numbers)
   - Set the list type (static, editable, or operator-must-add)

2. **Create a Template:**
   - Navigate to "Templates"
   - Click "Create Template"
   - Fill in:
     - Code Name and Description
     - Select Severity level
     - Choose communication channels (Email, SMS, Pager, Voice)
     - Write message body (use {VariableName} for placeholders)
     - Add required fields/variables
     - Select distribution lists
   - Click "Save Template"

3. **Add Users:**
   - Navigate to "Users & Roles"
   - Click "Add User"
   - Set permissions for operators

### Operator Portal

1. **View Templates:**
   - The dashboard shows all active templates
   - Filter by severity or search by name

2. **Dispatch a Code:**
   - Click on a template card or "Dispatch" button
   - Fill in required fields
   - Review/Edit recipients (if allowed)
   - Click "Dispatch Code"
   - Monitor real-time delivery status

3. **View History:**
   - Navigate to "History"
   - View past dispatches
   - Click "View Details" to see full delivery status
   - Use "Clone & Re-dispatch" to send the same code again

## Data Persistence

Currently, all data is stored in browser localStorage. This means:
- Data persists between page refreshes
- Data is specific to each browser/device
- Data is cleared when browser storage is cleared

For production, you would replace this with a backend API and database.

## Stub Services

All integrations are stubbed:
- Email, SMS, Pager, and Voice calls are simulated
- They have random success/failure rates for demonstration
- In production, replace these with actual service integrations

## Troubleshooting

**Port already in use:**
- Change the port in `vite.manager.config.ts` or `vite.operator.config.ts`

**Module not found errors:**
- Run `npm install` again
- Make sure you're in the project root directory

**TypeScript errors:**
- Run `npm install` to ensure all types are installed
- Check that `@types/node` is installed

