import { injected } from '@components/connector';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

export default function index({ address }) {
  const { active, account, library, connector, chainId, activate, deactivate } = useWeb3React();

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

  async function sendTransications() {
    try {
      const web3 = new Web3(library);
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
          <div>Chain ID: {chainId}</div>
        </span>
      ) : (
        <span>Not connected</span>
      )}

      {active && (
        <div>
          <br />
          <button onClick={disconnect}>Disconnect </button>
          <br />
          <button onClick={sendTransications}>Send Token</button>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  console.log('[NODEJS ONLY] ENV_VARİABLE', process.env.ADDRESS);
  return {
    props: {
      address: process.env.ADDRESS,
    },
  };
}
