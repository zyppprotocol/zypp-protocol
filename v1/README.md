# Zypp Protocol Backend - The DropFi Protocol

A Node.js/Express/TypeScript backend server for handling Solana transactions with offline signing capabilities.

## 🚀 Features

- **Core DropFi Functionality**: Create unsigned transactions for offline signing and submit pre-signed transactions
- **Solana Integration**: Full Web3.js integration with devnet support
- **RESTful API**: Clean REST endpoints for all operations
- **TypeScript**: Fully typed codebase with comprehensive error handling
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Production Ready**: Proper logging, graceful shutdown, and environment configuration

## 📋 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint
- `GET /api/status` - Network status and connection info

### Wallet Operations
- `GET /api/balance/:address` - Get wallet balance
- `POST /api/airdrop` - Request devnet airdrop

### Transaction Operations
- `POST /api/transfer` - Create and send signed transfer
- `POST /api/transaction/create` - **Core DropFi**: Create unsigned transaction
- `POST /api/transaction/submit` - **Core DropFi**: Submit signed transaction
- `GET /api/transaction/:signature` - Get transaction details

## 🛠 Installation & Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Run in development:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## 🔧 Environment Variables

\`\`\`env
PORT=3000
SOLANA_RPC_URL=https://api.devnet.solana.com
NODE_ENV=development
\`\`\`

## 📖 Usage Examples

### Create Unsigned Transaction (Core DropFi Feature)
\`\`\`bash
curl -X POST http://localhost:3000/api/transaction/create \
  -H "Content-Type: application/json" \
  -d '{
    "fromAddress": "SENDER_PUBLIC_KEY",
    "toAddress": "RECIPIENT_PUBLIC_KEY", 
    "amount": 0.1
  }'
\`\`\`

### Submit Signed Transaction (Core DropFi Feature)
\`\`\`bash
curl -X POST http://localhost:3000/api/transaction/submit \
  -H "Content-Type: application/json" \
  -d '{
    "signedTransaction": "BASE64_ENCODED_SIGNED_TRANSACTION"
  }'
\`\`\`

## 🏗 Project Structure

\`\`\`
src/
├── index.ts              # Main server entry point
├── config/
│   └── solana.ts         # Solana RPC connection setup
├── services/
│   └── solana.service.ts # Solana blockchain interactions
├── routes/
│   └── api.ts            # REST API endpoints
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    ├── keypair.ts        # Keypair helper functions
    └── validation.ts     # Request validation middleware
\`\`\`

## 🔒 Security Features

- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable origin whitelist
- **Helmet Security**: Security headers and CSP
- **Error Handling**: Sanitized error responses

## 🚦 Getting Started

The server will start on `http://localhost:3000` by default. Visit the root endpoint for API documentation and available endpoints.

## 📝 License

MIT License - see LICENSE file for details.
