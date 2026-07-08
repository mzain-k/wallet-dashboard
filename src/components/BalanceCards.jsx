import { useBalance } from 'wagmi'
import { sepolia, polygon, arbitrum } from 'wagmi/chains'

const CHAINS = [
  { chain: sepolia, label: 'Sepolia', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { chain: polygon, label: 'Polygon', color: 'bg-violet-500', textColor: 'text-violet-400' },
  { chain: arbitrum, label: 'Arbitrum', color: 'bg-blue-500', textColor: 'text-blue-400' },
]

function BalanceCard({ address, chain, label, color, textColor }) {
  const { data: balance, isLoading } = useBalance({ address, chainId: chain.id })

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <span className="text-white/50 text-sm">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
      ) : (
        <div>
          <p className={`text-2xl font-bold ${textColor}`}>
            {parseFloat(balance?.formatted || 0).toFixed(4)}
          </p>
          <p className="text-white/30 text-sm mt-1">{balance?.symbol}</p>
        </div>
      )}
    </div>
  )
}

function BalanceCards({ address }) {
  return (
    <div>
      <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3">Balances</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHAINS.map(({ chain, label, color, textColor }) => (
          <BalanceCard
            key={chain.id}
            address={address}
            chain={chain}
            label={label}
            color={color}
            textColor={textColor}
          />
        ))}
      </div>
    </div>
  )
}

export default BalanceCards