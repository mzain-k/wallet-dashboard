import { createConfig, http } from 'wagmi'
import { sepolia, polygon, arbitrum } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, polygon, arbitrum],
  connectors: [
    injected(),
  ],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_SEPOLIA_URL),
    [polygon.id]: http(import.meta.env.VITE_ALCHEMY_POLYGON_URL),
    [arbitrum.id]: http(import.meta.env.VITE_ALCHEMY_ARBITRUM_URL),
  },
})