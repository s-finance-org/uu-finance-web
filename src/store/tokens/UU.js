import BN from 'bignumber.js'

import { ModelToken, ModelValueEther } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

import storeWallet from '../wallet'
import notify from '../notify'
import i18n from '../../i18n'

const abi = [{
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "address",
		"name": "swap",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "address",
		"name": "depo",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "nvi",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "address",
		"name": "gauge",
		"type": "address"
	}],
	"name": "AddLPT",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "AddReward",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "Approval",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "tip",
		"type": "uint256"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "agent",
		"type": "address"
	}],
	"name": "ClaimTo",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousGovernor",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "newGovernor",
		"type": "address"
	}],
	"name": "GovernorshipTransferred",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "RemoveLPT",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "remain",
		"type": "uint256"
	}],
	"name": "RemoveReward",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "agent",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "gauge",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "tip",
		"type": "uint256"
	}],
	"name": "Settle",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "Transfer",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint256",
		"name": "upPrice",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "timestamp",
		"type": "uint256"
	}],
	"name": "UpdatePrice",
	"type": "event"
}, {
	"inputs": [],
	"name": "DOMAIN_TYPEHASH",
	"outputs": [{
		"internalType": "bytes32",
		"name": "",
		"type": "bytes32"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "PERMIT_TYPEHASH",
	"outputs": [{
		"internalType": "bytes32",
		"name": "",
		"type": "bytes32"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "swap",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "depo",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "nvi",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "gauge",
		"type": "address"
	}],
	"name": "addLPT",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}],
	"name": "allowance",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "approve",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "balanceOf",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "minVol",
		"type": "uint256"
	}],
	"name": "burn",
	"outputs": [{
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "calcPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "claim",
	"outputs": [{
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "claim",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "claimTo",
	"outputs": [{
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "tip",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "acct",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "claimable",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "acct",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "claimed",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "decimals",
	"outputs": [{
		"internalType": "uint8",
		"name": "",
		"type": "uint8"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "decrement",
		"type": "uint256"
	}],
	"name": "decreaseAllowance",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}, {
		"internalType": "address",
		"name": "addr",
		"type": "address"
	}],
	"name": "getConfig",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}],
	"name": "getConfig",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}, {
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "getConfig",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "governor",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "increment",
		"type": "uint256"
	}],
	"name": "increaseAllowance",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "governor_",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "up_",
		"type": "address"
	}],
	"name": "initialize",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "governor_",
		"type": "address"
	}],
	"name": "initialize",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "initialize2",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "lastUpdateTimeSpan",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}],
	"name": "lpt2uu",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "lptBalance",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "lptN",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "lptPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "lpts",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "minMint",
		"type": "uint256"
	}],
	"name": "mint",
	"outputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "name",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}],
	"name": "netValue",
	"outputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "netValue",
	"outputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"name": "nonces",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "deadline",
		"type": "uint256"
	}, {
		"internalType": "uint8",
		"name": "v",
		"type": "uint8"
	}, {
		"internalType": "bytes32",
		"name": "r",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "s",
		"type": "bytes32"
	}],
	"name": "permit",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "removeLPT",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "removeReward",
	"outputs": [{
		"internalType": "uint256",
		"name": "remain",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "renounceGovernorship",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "rewardN",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "rewards",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "setConfig",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}, {
		"internalType": "address",
		"name": "addr",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "setConfig",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes32",
		"name": "key",
		"type": "bytes32"
	}, {
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "setConfig",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "j",
		"type": "uint256"
	}],
	"name": "settle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "acct",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "j",
		"type": "uint256"
	}],
	"name": "settleable",
	"outputs": [{
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "tip",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "symbol",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "totalClaimed",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "totalNetValue",
	"outputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "totalSupply",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "transfer",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "sender",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "transferFrom",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "newGovernor",
		"type": "address"
	}],
	"name": "transferGovernorship",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "reward",
		"type": "address"
	}],
	"name": "tryAddReward",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "up",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "vol",
		"type": "uint256"
	}],
	"name": "up2uu",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"name": "upAllowance",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "volume",
		"type": "uint256"
	}],
	"name": "upApprove_",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "upBalanceOf",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "string",
		"name": "name_",
		"type": "string"
	}, {
		"internalType": "address",
		"name": "verifyingContract",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "rawAmount",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "deadline",
		"type": "uint256"
	}, {
		"internalType": "uint8",
		"name": "v",
		"type": "uint8"
	}, {
		"internalType": "bytes32",
		"name": "r",
		"type": "bytes32"
	}, {
		"internalType": "bytes32",
		"name": "s",
		"type": "bytes32"
	}],
	"name": "upPermit_",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "upPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "upPriceFactor",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "upTotalSupply",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "sender",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "volume",
		"type": "uint256"
	}],
	"name": "upTransferFrom_",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "sender",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "volume",
		"type": "uint256"
	}],
	"name": "upTransfer_",
	"outputs": [{
		"internalType": "bool",
		"name": "success",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "updatePrice",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "amt",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "lpt",
		"type": "address"
	}],
	"name": "uu2lpt",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "uu2up",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}]

export default ModelToken.create({
  code: 'UU',
  address: getDotenvAddress('UU_TOKEN'),
  abi,
  customSeries () {
    const { address, contract, supportedLptNum } = this

    return [
      { decodeType: supportedLptNum.type, call: [address, contract.methods.lptN().encodeABI()], target: supportedLptNum }
    ]
  },
  values: {
    /**
     * 支持的 lpt 数量
     * @type {Object}
     */
    supportedLptNum: ModelValueEther.create(),
    /**
     * 支持的 lpt 地址
     * @type {Array}
     */
    supportedLptAddresses: [],

    /**
     * 
     */
    burnMinVol: ModelValueEther.create(),
  },
  methods: {
    /**
     * TODO: 
     * lpt 铸造 UU
     * @param {*} lptAddress 
     * @param {*} vol 
     * @param {*} minVol 
     */
    async mint (lptAddress, vol, minVol) {
      const { contract, address, state } = this
      const walletAddress = storeWallet.address

      // 限制当前提交待确认的交易只有一份
      state.beforeUpdate()

      const { update, dismiss } = notify.notification({ message: '正准备拉起' })

      try {




      const sendOpts = {
        from: walletAddress,
      }

      
        const _method = await contract.methods.mint(lptAddress, vol, minVol)

        try {
          sendOpts.gas = await _method.estimateGas({
            from: walletAddress,
          })
        } catch(err) {
          console.error(err)
        }

console.log(lptAddress, vol, minVol)

        return _method.send(sendOpts)
          .once('transactionHash', hash => {
            dismiss()
            notify.handler(hash)
            state.afterUpdate()
          })
          .catch(err =>{
            console.log(err)

            notify.updateError({
              update,
              code: err.code,
              message: err.message
            })

            state.afterUpdate()
          })
      } catch (err) {
        console.error(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      }
    },

    /**
     * 销毁 UU 可获得的 lpt 量
     * - 更新 associatedTokens[].burnGainAmount
     * @param {Object} tokenObj
     * @return {Promise}
     */
    async getUU2LptVol (tokenObj) {
      const { contract, associatedTokens } = this

      // TODO: multi
      let minVolEther = await contract.methods.uu2lpt(tokenObj.amount.ether, tokenObj.address).call()
      const lptBalance = await contract.methods.lptBalance(tokenObj.address).call()

      // TODO: why?
      if(minVolEther == lptBalance) {
        minVolEther = await contract.methods.lpt2uu(tokenObj.address, minVolEther).call()
      }

      // TODO: TEMP
      if (!associatedTokens[tokenObj.address]) {
        associatedTokens[tokenObj.address] = {}
      }

      associatedTokens[tokenObj.address].burnGainAmount = ModelValueEther.create({
        decimals: tokenObj.decimals,
        value: minVolEther
      })
    },

    /**
     * lpt 在 UU 中的余额
     * - 更新 associatedTokens[].balance
     * @param {Object} tokenObj
     */
    async lptBalance (tokenObj) {
      const { contract, associatedTokens } = this


      // TODO: TEMP

      if (!associatedTokens[tokenObj.address]) {
        associatedTokens[tokenObj.address] = {}
      }
      let lptBalance = await contract.methods.lptBalance(tokenObj.address).call()
console.log('lptBalance', lptBalance)
      associatedTokens[tokenObj.address].balance = ModelValueEther.create({
        decimals: tokenObj.decimals,
        value: lptBalance
      })
    },

    /**
     * lpt 销毁 UU
     * TODO:
     * @param {Object} tokenObj
     */
    async burn (tokenObj) {
      const { contract, address, state, associatedTokens } = this
      const walletAddress = storeWallet.address

      // 限制当前提交待确认的交易只有一份
      state.beforeUpdate()

      const { update, dismiss } = notify.notification({ message: '正准备拉起' })

      try {
        // update burnGainAmount
        await this.getUU2LptVol(tokenObj)

        const sendOpts = {
          from: walletAddress,
        }

        const method = await contract.methods.burn(
          tokenObj.amount.ether,
          tokenObj.address,
          associatedTokens[tokenObj.address].burnGainAmount.ether
        )

        try {
          sendOpts.gas = await method.estimateGas({
            from: walletAddress,
          })
        } catch(err) {
          console.error(err)
        }

        return method.send(sendOpts)
          .once('transactionHash', hash => {
            dismiss()
            notify.handler(hash)
            state.afterUpdate()
          })
          .catch(err =>{
            console.log(err)

            notify.updateError({
              update,
              code: err.code,
              message: err.message
            })

            state.afterUpdate()
          })
      } catch (err) {
        console.error(err)

        notify.updateError({
          update,
          code: err.code,
          message: err.message
        })

        state.afterUpdate()
      }
    }
  }
})