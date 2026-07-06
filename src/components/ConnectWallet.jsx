import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
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