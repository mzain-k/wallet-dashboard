import { useState, useEffect } from 'react'

const ALCHEMY_URLS = {
  sepolia: import.meta.env.VITE_ALCHEMY_SEPOLIA_URL,
  polygon: import.meta.env.VITE_ALCHEMY_POLYGON_URL,
  arbitrum: import.meta.env.VITE_ALCHEMY_ARBITRUM_URL,
}

async function fetchTransfers(url, address) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromAddress: address,
        category: ['external', 'erc20'],
        maxCount: '0xa',
        withMetadata: true,
        order: 'desc',
      }],
    }),
  })
  const data = await res.json()
  return data.result?.transfers || []
}

export function useTransactionHistory(address) {
  const [history, setHistory] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    async function load() {
      setIsLoading(true)
      const [sepolia, polygon, arbitrum] = await Promise.all([
        fetchTransfers(ALCHEMY_URLS.sepolia, address),
        fetchTransfers(ALCHEMY_URLS.polygon, address),
        fetchTransfers(ALCHEMY_URLS.arbitrum, address),
      ])
      setHistory({ sepolia, polygon, arbitrum })
      setIsLoading(false)
    }

    load()
  }, [address])

  return { history, isLoading }
}