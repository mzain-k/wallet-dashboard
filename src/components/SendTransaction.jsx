import { useState } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt, useSwitchChain, useAccount } from 'wagmi'
import { parseEther, isAddress } from 'viem'
import { sepolia, polygon, arbitrum } from 'wagmi/chains'

const CHAINS = [
  { chain: sepolia, label: 'Sepolia (Testnet)', color: 'bg-purple-500' },
  { chain: polygon, label: 'Polygon', color: 'bg-violet-500' },
  { chain: arbitrum, label: 'Arbitrum', color: 'bg-blue-500' },
]

function SendTransaction() {
  const { chainId } = useAccount()
  const { sendTransaction, data: txHash, isPending, error } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })
  const { switchChain } = useSwitchChain()

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedChainId, setSelectedChainId] = useState(sepolia.id)
  const [showConfirm, setShowConfirm] = useState(false)

  const selectedChain = CHAINS.find(c => c.chain.id === selectedChainId)

  function handleReview(e) {
    e.preventDefault()
    if (!isAddress(to)) return alert('Invalid wallet address')
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return alert('Invalid amount')
    setShowConfirm(true)
  }

  async function handleSend() {
    try {
        if (chainId !== selectedChainId) {
        await switchChain({ chainId: selectedChainId })
        }
        sendTransaction({
        to,
        value: parseEther(amount),
        chainId: selectedChainId,
        })
        setShowConfirm(false)
        setTo('')
        setAmount('')
    } catch (err) {
        console.error('Send failed:', err)
        setShowConfirm(false)
    }
  }

  return (
    <div>
      <h2 className="text-white/40 text-xs uppercase tracking-widest mb-3">Send</h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">

        {/* Chain selector */}
        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-xs">Network</label>
          <div className="flex gap-2">
            {CHAINS.map(({ chain, label, color }) => (
              <button
                key={chain.id}
                onClick={() => setSelectedChainId(chain.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${
                  selectedChainId === chain.id
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 text-white/40 hover:text-white/70'
                }`}
              >
                <div className={`w-2 h-2 ${color} rounded-full`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-xs">Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={to}
            onChange={e => setTo(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-xs">Amount</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              {selectedChain?.chain.nativeCurrency?.symbol}
            </span>
          </div>
        </div>

        {/* Review button */}
        <button
          onClick={handleReview}
          disabled={isPending || isConfirming}
          className="bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded-xl text-sm"
        >
          Review Transaction
        </button>

        {/* Status */}
        {isPending && (
          <p className="text-yellow-400 text-sm text-center">Waiting for MetaMask approval...</p>
        )}
        {isConfirming && (
          <p className="text-blue-400 text-sm text-center">Transaction confirming on chain...</p>
        )}
        {isSuccess && (
          <div className="text-center">
            <p className="text-green-400 text-sm">Transaction confirmed!</p>
            
            <a  href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs underline"
            >
              View on Etherscan
            </a>
          </div>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center">Error: {error.shortMessage || error.message}</p>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Confirm Transaction</h3>
            <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Network</span>
                <span>{selectedChain?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">To</span>
                <span className="font-mono">{to.slice(0, 8)}...{to.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Amount</span>
                <span className="text-green-400 font-semibold">{amount} {selectedChain?.chain.nativeCurrency?.symbol}</span>
              </div>
            </div>
            <p className="text-white/40 text-xs">MetaMask will open for final approval. You can still reject it there.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-white/10 text-white/60 hover:text-white py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SendTransaction