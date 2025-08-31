import { Router, type Request, type Response } from "express"
import solanaService from "../services/solana.service"

const router = Router()

// Input validation middleware
const validatePublicKey = (req: Request, res: Response, next: any) => {
  const { publicKey } = req.params
  if (!publicKey || !solanaService.isValidPublicKey(publicKey)) {
    return res.status(400).json({
      error: "Invalid public key",
      message: "Please provide a valid Solana public key",
    })
  }
  next()
}

/**
 * POST /api/mobile/transaction/create
 * Create an unsigned Solana transfer transaction
 */
router.post("/transaction/create", async (req: Request, res: Response) => {
  try {
    const { fromPublicKey, toPublicKey, lamports } = req.body

    // Validate input
    if (!fromPublicKey || !toPublicKey || typeof lamports !== "number") {
      return res.status(400).json({
        error: "Invalid input",
        message: "fromPublicKey, toPublicKey, and lamports are required",
      })
    }

    if (!solanaService.isValidPublicKey(fromPublicKey)) {
      return res.status(400).json({
        error: "Invalid fromPublicKey",
        message: "Please provide a valid Solana public key for sender",
      })
    }

    if (!solanaService.isValidPublicKey(toPublicKey)) {
      return res.status(400).json({
        error: "Invalid toPublicKey",
        message: "Please provide a valid Solana public key for recipient",
      })
    }

    if (lamports <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be greater than 0",
      })
    }

    const unsignedTransaction = await solanaService.createTransaction(fromPublicKey, toPublicKey, lamports)

    res.json({
      unsignedTransaction,
      message: "Unsigned transaction created successfully",
    })
  } catch (error) {
    console.error("Create transaction error:", error)
    res.status(500).json({
      error: "Transaction creation failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
})

/**
 * POST /api/mobile/transaction/submit
 * Submit a signed transaction to the Solana network
 */
router.post("/transaction/submit", async (req: Request, res: Response) => {
  try {
    const { signedTransaction } = req.body

    // Validate input
    if (!signedTransaction || typeof signedTransaction !== "string") {
      return res.status(400).json({
        error: "Invalid input",
        message: "signedTransaction (base64 string) is required",
      })
    }

    // Validate base64 format
    try {
      Buffer.from(signedTransaction, "base64")
    } catch {
      return res.status(400).json({
        error: "Invalid transaction format",
        message: "signedTransaction must be a valid base64 encoded string",
      })
    }

    const signature = await solanaService.submitTransaction(signedTransaction)

    res.json({
      signature,
      message: "Transaction submitted successfully",
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    })
  } catch (error) {
    console.error("Submit transaction error:", error)
    res.status(500).json({
      error: "Transaction submission failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
})

/**
 * GET /api/mobile/balance/:publicKey
 * Get SOL balance for a wallet address
 */
router.get("/balance/:publicKey", validatePublicKey, async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params
    const balance = await solanaService.getBalance(publicKey)

    res.json({
      balance,
      publicKey,
      unit: "SOL",
    })
  } catch (error) {
    console.error("Get balance error:", error)
    res.status(500).json({
      error: "Balance retrieval failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
})

/**
 * POST /api/mobile/airdrop
 * Request an airdrop of SOL (Devnet only)
 */
router.post("/airdrop", async (req: Request, res: Response) => {
  try {
    const { publicKey, amount } = req.body

    // Validate input
    if (!publicKey || typeof amount !== "number") {
      return res.status(400).json({
        error: "Invalid input",
        message: "publicKey and amount are required",
      })
    }

    if (!solanaService.isValidPublicKey(publicKey)) {
      return res.status(400).json({
        error: "Invalid publicKey",
        message: "Please provide a valid Solana public key",
      })
    }

    if (amount <= 0 || amount > 2) {
      return res.status(400).json({
        error: "Invalid amount",
        message: "Amount must be between 0 and 2 SOL for devnet airdrops",
      })
    }

    const signature = await solanaService.requestAirdrop(publicKey, amount)

    res.json({
      signature,
      amount,
      publicKey,
      message: "Airdrop completed successfully",
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    })
  } catch (error) {
    console.error("Airdrop error:", error)
    res.status(500).json({
      error: "Airdrop failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
})

/**
 * GET /api/mobile/connection
 * Get Solana connection info for health checks
 */
router.get("/connection", async (req: Request, res: Response) => {
  try {
    const connectionInfo = await solanaService.getConnectionInfo()
    res.json({
      status: "connected",
      ...connectionInfo,
    })
  } catch (error) {
    console.error("Connection check error:", error)
    res.status(500).json({
      error: "Connection check failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
})

const mobileRoutes = router
export default mobileRoutes
