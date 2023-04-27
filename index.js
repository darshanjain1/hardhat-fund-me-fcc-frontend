// import { ethers } from "./ethers-5.1.esm.min.js"
import { contractAddress, abi } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const contractBalanceButton = document.getElementById("contractBalance")
const withdrawButton = document.getElementById("withdrawButton")
contractBalanceButton.onclick = getBalance
connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw

function getRequiredVariables() {
  let provider = new ethers.providers.Web3Provider(ethereum);
  let signer = provider.getSigner();
  let fundContract = new ethers.Contract(contractAddress, abi, signer)
  return { provider, signer, fundContract }
}

async function connect() {
  if (window.ethereum) {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    }
    catch (err) {
      console.log('err occured while connecting to metamask', err)
    }
    connectButton.innerHTML = "Connected!";
  } else
    connectButton.innerHTML =
      "Please install metamask!";
}

async function fund() {
  // provider / connection to the blockchain
  //  signer / someone with gas
  // contract's ABI & address to which we are interacting with4
  if (window.ethereum) {
    const { provider, signer, fundContract } = getRequiredVariables()
    const value = document.getElementById("fundAmount").value
    try {
      const transactionResponse = await fundContract.fund({ value: ethers.utils.parseEther(value) })
      await listenForTransactionMine(transactionResponse, provider)
      console.log("funding done...")
    } catch (error) {
      console.log('error occured while funding', error)
    }
  }
}

async function withdraw() {
  if (window.ethereum) {
    const { provider, signer, fundContract } = getRequiredVariables()
    try {
      const transactionResponse = await fundContract.withdraw()
      await listenForTransactionMine(transactionResponse,provider)
      console.log('transactionResponse', transactionResponse);
    }
    catch (err) {
      console.log('error occurend while witdhrawing', err);
    }
  }
}


async function getBalance() {
  if (window.ethereum) {
    const { provider, signer, fundContract } = getRequiredVariables()
    const balance = ethers.utils.formatEther(await provider.getBalance(fundContract.address))
    document.getElementById("displayContractBalance").innerText = balance
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log('mining...')
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (receipt) => {
      console.log(`block confirmation is`, receipt.confirmations);
      resolve()
    })
  })
}