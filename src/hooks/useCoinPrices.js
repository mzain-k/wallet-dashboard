import { useState, useEffect } from 'react'

export function useCoinPrices() {
  const [prices, setPrices] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,polygon-ecosystem-token&vs_currencies=usd`
        )
        const data = await res.json()
        setPrices({
          ETH: data['ethereum']?.usd || 0,
          POL: data['polygon-ecosystem-token']?.usd || 0,
          MATIC: data['polygon-ecosystem-token']?.usd || 0,
        })
      } catch (err) {
        console.error('Price fetch failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
  }, [])

  return { prices, isLoading }
}