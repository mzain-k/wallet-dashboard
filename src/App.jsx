import { useAccount } from 'wagmi'
import ConnectWallet from './components/ConnectWallet'
import BalanceCards from './components/BalanceCards'
import SendTransaction from './components/SendTransaction'
import TransactionHistory from './components/TransactionHistory'

function App() {
  const { address, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">W</div>
          <span className="font-semibold text-lg">WalletDash</span>
        </div>
        <ConnectWallet />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center mt-32 gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl">💼</div>
            <h1 className="text-3xl font-bold">Your Multichain Dashboard</h1>
            <p className="text-white/50 text-center max-w-md">
              Connect your wallet to view balances and transaction history across Ethereum, Polygon, and Arbitrum.
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm">Connected Wallet</p>
                <p className="font-mono text-sm mt-1">{address}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>

            <BalanceCards address={address} />
            <SendTransaction />
            <TransactionHistory address={address} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App