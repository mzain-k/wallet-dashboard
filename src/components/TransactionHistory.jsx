import { useTransactionHistory } from '../hooks/useTransactionHistory'

const CHAIN_LABELS = {
  sepolia: 'Sepolia (Testnet)',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
}

function TxList({ label, txs }) {
  return (
    <div>
      <h4>{label}</h4>
      {txs.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        txs.map((tx) => (
          <div key={tx.uniqueId}>
            <span>{tx.metadata?.blockTimestamp?.slice(0, 10)}</span>
            {' | '}
            <span>To: {tx.to?.slice(0, 8)}...</span>
            {' | '}
            <span>{tx.value} {tx.asset}</span>
          </div>
        ))
      )}
    </div>
  )
}

function TransactionHistory({ address }) {
  const { history, isLoading } = useTransactionHistory(address)

  if (isLoading) return <p>Loading transaction history...</p>

  return (
    <div>
      <h3>Transaction History</h3>
      {Object.entries(CHAIN_LABELS).map(([key, label]) => (
        <TxList
          key={key}
          label={label}
          txs={history[key] || []}
        />
      ))}
    </div>
  )
}

export default TransactionHistory