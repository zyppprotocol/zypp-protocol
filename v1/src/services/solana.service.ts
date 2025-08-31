import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js"

export class SolanaService {
  private connection: Connection
  private readonly DEVNET_RPC = "https://api.devnet.solana.com"

  constructor() {
    this.connection = new Connection(this.DEVNET_RPC, "confirmed")
  }

  /**
   * Create an unsigned Solana transfer transaction
   */
  async createTransaction(fromPublicKey: string, toPublicKey: string, lamports: number): Promise<string> {
    try {
      const fromPubkey = new PublicKey(fromPublicKey)
      const toPubkey = new PublicKey(toPublicKey)

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash("confirmed")

      // Create transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })

      // Create transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: fromPubkey,
      }).add(transferInstruction)

      // Serialize unsigned transaction to base64
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      })

      return serializedTransaction.toString("base64")
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Submit a signed transaction to the Solana network
   */
  async submitTransaction(signedTransactionBase64: string): Promise<string> {
    try {
      // Decode the base64 signed transaction
      const signedTransactionBuffer = Buffer.from(signedTransactionBase64, "base64")

      // Submit the raw signed transaction
      const signature = await sendAndConfirmRawTransaction(this.connection, signedTransactionBuffer, {
        commitment: "confirmed",
        maxRetries: 3,
      })

      return signature
    } catch (error) {
      console.error("Error submitting transaction:", error)
      throw new Error(`Failed to submit transaction: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Get SOL balance for a wallet address
   */
  async getBalance(publicKeyString: string): Promise<number> {
    try {
      const publicKey = new PublicKey(publicKeyString)
      const balanceInLamports = await this.connection.getBalance(publicKey, "confirmed")

      // Convert lamports to SOL
      return balanceInLamports / LAMPORTS_PER_SOL
    } catch (error) {
      console.error("Error getting balance:", error)
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Request an airdrop of SOL (Devnet only)
   */
  async requestAirdrop(publicKeyString: string, amount: number): Promise<string> {
    try {
      const publicKey = new PublicKey(publicKeyString)
      const lamports = amount * LAMPORTS_PER_SOL

      // Maximum airdrop limit on devnet is typically 2 SOL
      if (amount > 2) {
        throw new Error("Airdrop amount cannot exceed 2 SOL on devnet")
      }

      const signature = await this.connection.requestAirdrop(publicKey, lamports)

      // Confirm the airdrop transaction
      await this.connection.confirmTransaction(signature, "confirmed")

      return signature
    } catch (error) {
      console.error("Error requesting airdrop:", error)
      throw new Error(`Failed to request airdrop: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Validate if a string is a valid Solana public key
   */
  isValidPublicKey(publicKeyString: string): boolean {
    try {
      new PublicKey(publicKeyString)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get connection info for health checks
   */
  async getConnectionInfo() {
    try {
      const version = await this.connection.getVersion()
      const slot = await this.connection.getSlot()
      return {
        rpcUrl: this.DEVNET_RPC,
        version,
        currentSlot: slot,
      }
    } catch (error) {
      throw new Error(`Connection check failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

const solanaService = new SolanaService()
export default solanaService
