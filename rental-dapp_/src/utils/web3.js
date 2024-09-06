import Web3 from 'web3';
import RentalContract from './RentalHomeContract.json';

let web3;
let contract;

export const connectToBlockchain = async () => {
  if (web3) return;

  try {
    web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    

    const contractAddress = '0x975fDA2C4A6Feb19cE7717d58604AB280A1A25E4'; 
    

    contract = new web3.eth.Contract(
        RentalContract.abi,
        contractAddress
    );
  } catch (error) {
    console.error('Failed to connect to blockchain:', error);
  }
};

export const getContract = () => contract;

export const getWeb3 = () => web3;

export default web3;