import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { sepolia, polygon, arbitrum } from 'wagmi/chains'

const CHAINS = [
  { chain: sepolia, label: 'Sepolia (Testnet)' },
  { chain: polygon, label: 'Polygon' },
  { chain: arbitrum, label: 'Arbitrum' },
]

function ChainBalance({ address, chain, label }) {
  const { data: balance, isLoading } = useBalance({ address, chainId: chain.id })

  return (
    <div>
      <span>{label}: </span>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>{balance?.formatted} {balance?.symbol}</span>
      )}
    </div>
  )
}

function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <hr />
        <h3>Balances</h3>
        {CHAINS.map(({ chain, label }) => (
          <ChainBalance
            key={chain.id}
            address={address}
            chain={chain}
            label={label}
          />
        ))}
        <hr />
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name === 'Injected' ? 'Connect MetaMask' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  )
}

export default ConnectWallet