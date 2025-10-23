# Firebase Setup Guide

## Environment Variables

Add these to your Vercel project or `.env.local`:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

## Firestore Collections Structure

### users
- **Document ID**: Firebase Auth UID
- **Fields**:
  - `uid` (string)
  - `email` (string)
  - `displayName` (string)
  - `photoURL` (string, optional)
  - `createdAt` (timestamp)
  - `privacy` (string: 'public' | 'squad' | 'private')
  - `squadIds` (array of strings)

### squads
- **Document ID**: Auto-generated
- **Fields**:
  - `id` (string)
  - `name` (string)
  - `createdBy` (string, user UID)
  - `createdAt` (timestamp)
  - `memberIds` (array of strings)
  - `inviteCode` (string, 6 chars uppercase)

### results
- **Document ID**: Auto-generated
- **Fields**:
  - `id` (string)
  - `userId` (string)
  - `squadId` (string)
  - `difficulty` (string: 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'extreme')
  - `timeSeconds` (number)
  - `timestamp` (timestamp)
  - `weekStart` (timestamp, Monday 00:00)
  - `integrityHint` (string, optional)

### prs (Personal Records)
- **Document ID**: Auto-generated
- **Fields**:
  - `id` (string)
  - `userId` (string)
  - `difficulty` (string)
  - `timeSeconds` (number)
  - `achievedAt` (timestamp)
  - `resultId` (string, reference to result)

### leaders (Weekly Leaderboard Cache)
- **Document ID**: Auto-generated
- **Fields**:
  - `id` (string)
  - `squadId` (string)
  - `weekStart` (timestamp)
  - `userId` (string)
  - `solveCount` (number)
  - `bestTime` (number)
  - `difficulty` (string)

## Indexes Required

Create these composite indexes in Firebase Console:

1. **results**: `squadId` (Ascending) + `weekStart` (Ascending) + `timestamp` (Descending)
2. **prs**: `userId` (Ascending) + `difficulty` (Ascending) + `timeSeconds` (Ascending)
3. **leaders**: `squadId` (Ascending) + `weekStart` (Ascending) + `solveCount` (Descending) + `bestTime` (Ascending)

## Security Rules

See the specification document for complete Firestore security rules.
