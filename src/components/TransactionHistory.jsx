import { useTransactionHistory } from '../hooks/useTransactionHistory'

const CHAINS = {
  sepolia: { label: 'Sepolia', color: 'bg-purple-500' },
  polygon: { label: 'Polygon', color: 'bg-violet-500' },
  arbitrum: { label: 'Arbitrum', color: 'bg-blue-500' },
}

const EXPLORERS = {
  sepolia: 'https://sepolia.etherscan.io/tx',
  polygon: 'https://polygonscan.com/tx',
  arbitrum: 'https://arbiscan.io/tx',
}

function TxRow({ tx, chainKey }) {
  const explorerUrl = `${EXPLORERS[chainKey]}/${tx.hash}`

  return (
    
    <a  href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors"
    >
      <div className="flex flex'col gap-1">
        <span className="text-sm font-mono text-white/70">
          To: {tx.to?.slice(0, 6)}...{tx.to?.slice(-4)}
        </span>
        <span className="text-xs text-white/30">
          {tx.metadata?.blockTimestamp?.slice(0, 10)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-green-400">
          {parseFloat(tx.value || 0).toFixed(4)} {tx.asset}
        </span>
        <span className="text-white/20 text-xs">↗</span>
      </div>
    </a>
  )
}

function ChainTxCard({ chainKey, txs }) {
  const { label, color } = CHAINS[chainKey]

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <h3 className="font-semibold text-sm">{label}</h3>
        <span className="ml-auto text-xs text-white/30">{txs.length} txns</span>
      </div>
      {txs.length === 0 ? (
        <p className="text-white/30 text-sm">No transactions found</p>
      ) : (
        txs.map((tx) => <TxRow key={tx.uniqueId} tx={tx} chainKey={chainKey} />)
      )}
    </div>
  )
}

function TransactionHistory({ address }) {
  const { history, isLoading } = useTransactionHistory(address)

  return (
    <div>
      <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3">Transaction History</h2>
      {isLoading ? (
        <p className="text-white/30 text-sm">Loading transactions...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(CHAINS).map((key) => (
            <ChainTxCard key={key} chainKey={key} txs={history[key] || []} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionHistory