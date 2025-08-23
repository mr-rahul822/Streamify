# Design Document

## Overview

The issues identified are:

1. **UI Issue**: Bio text in user cards overflows because there's no text truncation or proper container constraints
2. **Friend Request Backend Bugs**: Multiple critical bugs in the backend controllers
3. **Frontend Data Handling**: Issues with how friend request data is processed

## Architecture

The fix involves three main areas:
1. **Frontend UI**: Add proper text truncation and container constraints for user cards
2. **Backend Controllers**: Fix critical bugs in friend request logic
3. **Data Flow**: Ensure proper data structure consistency between frontend and backend

## Components and Interfaces

### Frontend UI Components
- **HomePage.jsx**: User cards need proper text truncation for bio field
- **CSS/Styling**: Add text overflow handling with ellipsis or line clamping

### Backend Controllers (`Backend/src/controllers/user.controllers.js`)
**Critical Bugs Found:**

1. **acceptFriendRequest function**:
   - Line 95: `await User.findById(requestId)` should be `await FriendRequest.findById(requestId)`
   - Line 100: Wrong comparison `friendRequest.recipient.toString() !== req.params.id` should be `friendRequest.recipient.toString() !== req.user.id`
   - Line 103: `frameElement.save()` should be `friendRequest.save()`

2. **getFriendRequests function**:
   - Line 125: `sender : req.params.id` should be `sender : req.user.id` for accepted requests

### Data Models

**Friend Request Flow:**
```javascript
// Outgoing request structure
{
  _id: "requestId",
  sender: "userId",
  recipient: "recipientId", 
  status: "pending"
}

// Incoming request structure  
{
  _id: "requestId",
  sender: { fullName, profilePic, nativeLanguage, learningLanguage },
  recipient: "currentUserId",
  status: "pending"
}
```

## Error Handling

### Backend Validation
- Proper error messages for duplicate requests
- Correct authorization checks for accepting requests
- Proper model references and field access

### Frontend Error Display
- Show server error messages to users
- Handle loading states properly
- Display meaningful feedback for failed operations

## Testing Strategy

### Backend Testing
- Test friend request creation with valid data
- Test duplicate request prevention
- Test friend request acceptance flow
- Test proper data population in queries

### Frontend Testing
- Test UI text overflow handling
- Test friend request display in notifications
- Test outgoing request tracking
- Verify proper error message display