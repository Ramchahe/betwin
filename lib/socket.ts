import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Handle joining a game
      socket.on("joinGame", (data) => {
        const { gameType, betAmount } = data

        // Logic to match players or start a game
        // For now, we'll just emit a gameStart event
        socket.emit("gameStart", {
          gameId: `game_${Date.now()}`,
          opponent: "Player2",
          betAmount,
        })
      })

      // Handle game moves
      socket.on("makeMove", (data) => {
        const { gameId, move } = data

        // Process the move and update game state
        // Then broadcast the updated state to all players in the game
        socket.emit("gameUpdate", {
          gameId,
          // Updated game state
        })
      })

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return res.socket.server.io
}
