import { useBalance } from 'wagmi'
import { sepolia, polygon, arbitrum } from 'wagmi/chains'
import { useCoinPrices } from '../hooks/useCoinPrices'

const CHAINS = [
  { chain: sepolia, label: 'Sepolia', color: 'bg-purple-500', textColor: 'text-purple-400', isTestnet: true },
  { chain: polygon, label: 'Polygon', color: 'bg-violet-500', textColor: 'text-violet-400', isTestnet: false },
  { chain: arbitrum, label: 'Arbitrum', color: 'bg-blue-500', textColor: 'text-blue-400', isTestnet: false },
]

function BalanceCard({ address, chain, label, color, textColor, prices, isTestnet }) {
  const { data: balance, isLoading } = useBalance({ address, chainId: chain.id })

  const amount = parseFloat(balance?.formatted || 0)
  const symbol = balance?.symbol || ''
  const usdValue = !isTestnet && prices[symbol]
    ? (amount * prices[symbol]).toFixed(2)
    : null

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <span className="text-white/50 text-sm">{label}</span>
        {isTestnet && (
          <span className="ml-auto text-xs text-yellow-500/70 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            Testnet
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
      ) : (
        <div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {amount.toFixed(4)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/30 text-sm">{symbol}</p>
            {usdValue !== null && (
              <p className="text-white/40 text-sm">· ${usdValue}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function BalanceCards({ address }) {
  const { prices } = useCoinPrices()

  return (
    <div>
      <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3">Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHAINS.map(({ chain, label, color, textColor, isTestnet }) => (
          <BalanceCard
            key={chain.id}
            address={address}
            chain={chain}
            label={label}
            color={color}
            textColor={textColor}
            prices={prices}
            isTestnet={isTestnet}
          />
        ))}
      </div>
    </div>
  )
}

export default BalanceCards