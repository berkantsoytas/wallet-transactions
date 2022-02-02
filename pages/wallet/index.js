import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import { tokens } from '@public/tokens';
import { injected } from '@components/connector';

import abi from '../../public/abi.json';

export default function index({ address }) {
  const { active, account, library, connector, chainId, activate, deactivate } = useWeb3React();
  const web3 = new Web3(library);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {}
  }

  async function disconnect() {
    try {
      await deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  async function getBalance() {
    let accountWeb3 = await web3.eth.getAccounts().then((accounts) => accounts[0]);

    for (let tokenAddress of tokens) {
      const contract = new web3.eth.Contract(abi, tokenAddress);
      const tokenBalance = await contract.methods.balanceOf(accountWeb3).call();
      console.log(`${tokenAddress} balance: ${tokenBalance}`);
    }
  }

  async function sendTransications() {
    try {
      web3.eth.getChainId().then((chainId) => {
        if (chainId === 97) {
          web3.eth
            .sendTransaction({
              from: account,
              to: address,
              value: web3.utils.toWei('10', 'wei'),
            })
            .catch((e) => {
              if (e.code === 4001) {
                console.log('Kullanıcı tarafından reddedildi');
              }
            });
        }
      });
    } catch (e) {}
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={connect}
        className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
      >
        Connect to MetaMask
      </button>

      <br />

      {active ? (
        <span>
          Connected with <b>{account}</b>
          <br />
          <span>
            Chain ID: <b>{chainId}</b>
          </span>
          <br />
          <span></span>
        </span>
      ) : (
        <span>Not connected</span>
      )}

      {active && (
        <div className="flex row-span-3">
          <br />
          <button
            className="py-2 mr-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            onClick={disconnect}
          >
            Disconnect
          </button>
          <br />
          <button
            className="py-2 mr-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            onClick={sendTransications}
          >
            Send Token
          </button>
          <br />
          <button
            className="py-2 mr-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            onClick={getBalance}
          >
            Get Balance
          </button>
        </div>
      )}
    </div>
  );
}
