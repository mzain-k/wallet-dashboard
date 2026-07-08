import { useAccount } from 'wagmi'
import ConnectWallet from './components/ConnectWallet'
import TransactionHistory from './components/TransactionHistory'

function App() {
  const { address, isConnected } = useAccount()

  return (
    <div>
      <h1>Wallet Dashboard</h1>
      <ConnectWallet />
      {isConnected && <TransactionHistory address={address} />}
    </div>
  )
}

export default App