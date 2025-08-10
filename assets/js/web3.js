// Web3 Wallet Connection and Utilities
let currentAccount = null;
let isConnecting = false;

// Main wallet connection function
async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;
  
  const connectBtn = document.getElementById('connect-btn');
  connectBtn.textContent = 'Connecting...';
  connectBtn.disabled = true;

  if (typeof window.ethereum !== 'undefined') {
    try {
      console.log('MetaMask detected');
      
      // Request account access
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      currentAccount = accounts[0];
      console.log('Connected account:', currentAccount);
      
      // Get network info
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);
      console.log('Connected to:', networkName);
      
      updateWalletUI();
      showNotification('✅ Wallet connected successfully!', 'success');
      
      // Listen for account changes
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
    } catch (error) {
      console.error('Connection error:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      }
      
      showNotification('❌ ' + errorMessage, 'error');
    }
  } else {
    showNotification('❌ MetaMask not detected', 'error');
    setTimeout(() => {
      if (confirm('MetaMask is required for Web3 features. Install now?')) {
        window.open('https://metamask.io/download/', '_blank');
      }
    }, 1000);
  }
  
  isConnecting = false;
  connectBtn.disabled = false;
}

// Disconnect wallet
function disconnectWallet() {
  currentAccount = null;
  updateWalletUI();
  showNotification('Wallet disconnected', 'info');
  
  // Remove event listeners
  if (typeof window.ethereum !== 'undefined') {
    ethereum.removeListener('accountsChanged', handleAccountsChanged);
    ethereum.removeListener('chainChanged', handleChainChanged);
  }
}

// Update UI based on wallet state
function updateWalletUI() {
  const connectBtn = document.getElementById('connect-btn');
  const walletInfo = document.getElementById('wallet-info');
  const walletAddress = document.getElementById('wallet-address');
  const walletNetwork = document.getElementById('wallet-network');
  
  if (!connectBtn) return; // Safety check
  
  if (currentAccount) {
    connectBtn.style.display = 'none';
    walletInfo.style.display = 'block';
    
    // Format address for display
    const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
    walletAddress.textContent = shortAddress;
    
    // Update network info
    updateNetworkInfo();
  } else {
    connectBtn.style.display = 'inline-block';
    connectBtn.textContent = '🔗 Connect Web3 Wallet';
    walletInfo.style.display = 'none';
  }
}

// Update network information
async function updateNetworkInfo() {
  if (typeof window.ethereum !== 'undefined' && currentAccount) {
    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);
      const walletNetwork = document.getElementById('wallet-network');
      if (walletNetwork) {
        walletNetwork.textContent = networkName;
      }
    } catch (error) {
      console.error('Network info error:', error);
    }
  }
}

// Handle account changes
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    disconnectWallet();
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    updateWalletUI();
    showNotification('Account switched', 'info');
  }
}

// Handle network changes
function handleChainChanged(chainId) {
  console.log('Network changed to:', getNetworkName(chainId));
  updateNetworkInfo();
  showNotification(`Network switched to ${getNetworkName(chainId)}`, 'info');
}

// Get network name from chain ID
function getNetworkName(chainId) {
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0x89': 'Polygon',
    '0x38': 'BSC Mainnet',
    '0xa': 'Optimism',
    '0xa4b1': 'Arbitrum One',
    '0x2105': 'Base',
    '0xaa36a7': 'Sepolia Testnet',
    '0x13881': 'Polygon Mumbai'
  };
  return networks[chainId] || `Chain ${parseInt(chainId, 16)}`;
}

// Copy text to clipboard with feedback
async function copyToClipboard(text, label = 'Address') {
  try {
    await navigator.clipboard.writeText(text);
    
    // Visual feedback
    const button = event.target;
    const originalText = button.textContent;
    const originalBg = button.style.backgroundColor;
    
    button.textContent = '✅ Copied!';
    button.style.backgroundColor = '#4CAF50';
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = originalBg;
      button.style.transform = 'scale(1)';
    }, 2000);
    
    showNotification(`${label} copied to clipboard!`, 'success');
    
  } catch (err) {
    console.error('Copy failed:', err);
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification(`${label} copied!`, 'success');
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      showNotification(`Copy this ${label}: ${text}`, 'info');
    }
    
    document.body.removeChild(textArea);
  }
}

// Show notification messages
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.web3-notification');
  if (existing) existing.remove();
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `web3-notification ${type}`;
  notification.textContent = message;
  
  // Style notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    zIndex: '10000',
    maxWidth: '300px',
    wordWrap: 'break-word',
    transition: 'all 0.3s ease',
    transform: 'translateX(100%)',
    opacity: '0'
  });
  
  // Type-specific styling
  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196F3'
  };
  notification.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Get wallet balance (optional feature)
async function getWalletBalance() {
  if (typeof window.ethereum !== 'undefined' && currentAccount) {
    try {
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [currentAccount, 'latest']
      });
      
      // Convert from wei to ETH
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
      return ethBalance.toFixed(4);
      
    } catch (error) {
      console.error('Balance fetch error:', error);
      return 'Error';
    }
  }
  return '0.0000';
}

// Initialize on page load
window.addEventListener('load', async () => {
  console.log('Web3 script loaded');
  
  // Check if wallet is already connected
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        updateWalletUI();
        console.log('Wallet already connected:', currentAccount);
        
        // Set up event listeners
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
      }
    } catch (error) {
      console.error('Initial connection check failed:', error);
    }
  }
  
  // Initialize UI
  updateWalletUI();
});

// Prevent multiple initialization
if (!window.web3Initialized) {
  window.web3Initialized = true;
  console.log('Web3 utilities initialized');
}