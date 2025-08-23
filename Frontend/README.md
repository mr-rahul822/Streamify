# Frontend Setup

## Environment Variables

Create a `.env` file in the Frontend directory with the following variables:

```env
# Stream Chat Configuration
VITE_STREAM_API_KEY=your_stream_api_key_here
```

**Important**: The `VITE_STREAM_API_KEY` should be the same as the `STREAM_API_KEY` in your backend `.env` file.

## Installation

```bash
npm install
npm run dev
```

## Troubleshooting

If the chat page is not loading:

1. Make sure both backend and frontend have the correct Stream API keys
2. Check that the backend server is running on port 5001
3. Verify that you're logged in and the authentication is working
4. Check the browser console for any error messages
