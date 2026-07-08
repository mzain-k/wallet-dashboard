import { useAccount, useConnect, useDisconnect } from 'wagmi'

function ConnectWallet() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="text-sm text-red-400 hover:text-red-300 border border-red-400/30 px-4 py-2 rounded-xl transition-colors"
      >
        Disconnect
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-blue-500 hover:bg-blue-400 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
    >
      Connect Wallet
    </button>
  )
}

export default ConnectWallet