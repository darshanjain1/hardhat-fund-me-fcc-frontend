import { ethers } from "./ethers-5.1.esm.min.js"
import { contractAddress, abi } from "./constants.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
connectButton.onclick = connect
fundButton.onclick = fund
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
  if (window.ethereum) {
    // provider / connection to the blockchain
    //  signer / someone with gas
    // contract's ABI & address to which we are interacting with4
    const value = ethers.utils.parseEther("0.025")
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const fundContract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await fundContract.fund({ value })
      console.log('transactionResponse', transactionResponse)
      const transactionReceipt = await transactionResponse.wait()
      console.log('transactionReceipt', transactionReceipt)
      console.log("funding done...")
    } catch (error) {
      console.log('error occured while funding', error)
    }
}
}