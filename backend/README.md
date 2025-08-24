# Backend Setup

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key

# Server Configuration
PORT=5001
NODE_ENV=development

# Stream Chat Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_SCREAT_KEY=your_stream_secret_key
```

## Stream Chat Setup

1. Sign up for a Stream account at https://getstream.io/
2. Create a new app in the Stream dashboard
3. Copy your API Key and Secret Key
4. Add them to your `.env` file

## Installation

```bash
npm install
npm run dev
```
