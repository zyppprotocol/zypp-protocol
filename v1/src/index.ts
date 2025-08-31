import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import mobileRoutes from "./routes/mobile.api"

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Zypp Protocol Backend API",
  })
})

// API routes
app.use("/api/mobile", mobileRoutes)

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Zypp Protocol Backend API running on port ${PORT}`)
  console.log(`📱 Mobile endpoints available at http://localhost:${PORT}/api/mobile`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
})

export default app
