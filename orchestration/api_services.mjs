/* eslint-disable prettier/prettier, camelcase, prefer-const, no-unused-vars */
import config from "config";
import assert from "assert";

import withdraw from "./withdraw.mjs";

import transfer from "./transfer.mjs";

import deposit from "./deposit.mjs";

import { startEventFilter, getSiblingPath } from "./common/timber.mjs";
import fs from "fs";
import logger from "./common/logger.mjs";
import { decrypt } from "./common/number-theory.mjs";
import {
	getAllCommitments,
	getCommitmentsByState,
	reinstateNullifiers,
	getBalance,
	getBalanceByState,
} from "./common/commitment-storage.mjs";
import web3 from "./common/web3.mjs";
import axios from 'axios'
import { getContractInstance } from './common/contract.mjs'

/**
      NOTE: this is the api service file, if you need to call any function use the correct url and if Your input contract has two functions, add() and minus().
      minus() cannot be called before an initial add(). */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let leafIndex;
let encryption = {};
// eslint-disable-next-line func-names

export async function EscrowShield() {
	try {
		await web3.connect();
	} catch (err) {
		throw new Error(err);
	}
}
// eslint-disable-next-line func-names
export async function service_deposit(req, res, next) {
	try {
		await web3.connect();
		await new Promise((resolve) => setTimeout(() => resolve(), 3000));
	} catch (err) {
		console.log(err)
		throw new Error(err);
	}
	try {
		await startEventFilter("EscrowShield");
		const { amount } = req.body;
		const balances_msgSender_newOwnerPublicKey =
			req.body.balances_msgSender_newOwnerPublicKey || 0;
		const { tx, encEvent } = await deposit(
			amount,
			balances_msgSender_newOwnerPublicKey
		);
		// prints the tx
		console.log(tx);
		res.send({ tx, encEvent });
		// reassigns leafIndex to the index of the first commitment added by this function
		if (tx.event) {
			leafIndex = tx.returnValues[0];
			// prints the new leaves (commitments) added by this function call
			console.log(`Merkle tree event returnValues:`);
			console.log(tx.returnValues);
		}
		if (encEvent.event) {
			encryption.msgs = encEvent[0].returnValues[0];
			encryption.key = encEvent[0].returnValues[1];
			console.log("EncryptedMsgs:");
			console.log(encEvent[0].returnValues[0]);
		}
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

// eslint-disable-next-line func-names
export async function service_transfer(req, res, next) {
	try {
		await web3.connect();
		await new Promise((resolve) => setTimeout(() => resolve(), 3000));
	} catch (err) {
		throw new Error(err);
	}
	try {
		await startEventFilter("EscrowShield");
		const { recipient } = req.body;
		const { amount } = req.body;
		const balances_msgSender_newOwnerPublicKey =
			req.body.balances_msgSender_newOwnerPublicKey || 0;
		const balances_recipient_newOwnerPublicKey =
			req.body.balances_recipient_newOwnerPublicKey || 0;
		const { tx, encEvent } = await transfer(
			recipient,
			amount,
			balances_msgSender_newOwnerPublicKey,
			balances_recipient_newOwnerPublicKey
		);
		// prints the tx
		console.log(tx);
		res.send({ tx, encEvent });
		// reassigns leafIndex to the index of the first commitment added by this function
		if (tx.event) {
			leafIndex = tx.returnValues[0];
			// prints the new leaves (commitments) added by this function call
			console.log(`Merkle tree event returnValues:`);
			console.log(tx.returnValues);
		}
		if (encEvent.event) {
			encryption.msgs = encEvent[0].returnValues[0];
			encryption.key = encEvent[0].returnValues[1];
			console.log("EncryptedMsgs:");
			console.log(encEvent[0].returnValues[0]);
		}
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

// eslint-disable-next-line func-names
export async function service_withdraw(req, res, next) {
	try {
		await web3.connect();
		await new Promise((resolve) => setTimeout(() => resolve(), 3000));
	} catch (err) {
		throw new Error(err);
	}
	try {
		await startEventFilter("EscrowShield");
		const { amount } = req.body;
		const balances_msgSender_newOwnerPublicKey =
			req.body.balances_msgSender_newOwnerPublicKey || 0;
		const { tx, encEvent } = await withdraw(
			amount,
			balances_msgSender_newOwnerPublicKey
		);
		// prints the tx
		console.log(tx);
		res.send({ tx, encEvent });
		// reassigns leafIndex to the index of the first commitment added by this function
		if (tx.event) {
			leafIndex = tx.returnValues[0];
			// prints the new leaves (commitments) added by this function call
			console.log(`Merkle tree event returnValues:`);
			console.log(tx.returnValues);
		}
		if (encEvent.event) {
			encryption.msgs = encEvent[0].returnValues[0];
			encryption.key = encEvent[0].returnValues[1];
			console.log("EncryptedMsgs:");
			console.log(encEvent[0].returnValues[0]);
		}
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

export async function service_allCommitments(req, res, next) {
	try {
		const commitments = await getAllCommitments();
		res.send({ commitments });
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}
export async function service_getBalance(req, res, next) {
	try {
		const sum = await getBalance();
		res.send({ " Total Balance": sum });
	} catch (error) {
		console.error("Error in calculation :", error);
		res.status(500).send({ error: err.message });
	}
}

export async function service_getBalanceByState(req, res, next) {
	try {
		const { name, mappingKey } = req.body;
		const balance = await getBalanceByState(name, mappingKey);
		res.send({ " Total Balance": balance });
	} catch (error) {
		console.error("Error in calculation :", error);
		res.status(500).send({ error: err.message });
	}
}

export async function service_getCommitmentsByState(req, res, next) {
	try {
		const { name, mappingKey } = req.body;
		const commitments = await getCommitmentsByState(name, mappingKey);
		res.send({ commitments });
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

export async function service_reinstateNullifiers(req, res, next) {
	try {
		await reinstateNullifiers();
		res.send("Complete");
		await sleep(10);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

export async function service_timberProxy (req, res) {
	try {
		const forwardPath = req.path.replace("/timber", "");
		logger.info(`[PROXY] ${req.method} ${req.hostname}${req.path} -> ${process.env.TIMBER_URL}${forwardPath}`);

		const response = await axios({
			method: req.method,
			url: `${process.env.TIMBER_URL}${forwardPath}`,
			data: req.body
		})

		return res.status(response.status).send(response.data);
	} catch (err) {
		logger.error(err);
		res.send({ errors: [err.message] });
	}
}

export async function service_getZKPPublicKey(req, res, next) {
	try {
		let { address } = req.params;
		if (!web3.connection().utils.isAddress(address)) {
			return res.status(422).send({ errors: [`Invalid address, received: ${address}`] });
		}

		address = web3.connection().utils.toChecksumAddress(address);

		const instance = await getContractInstance("EscrowShield");
		const publicKey = await instance.methods.zkpPublicKeys(address).call();

		return res.send({ address, publicKey });
	} catch (err) {
		logger.error(err);
		res.status(400).send({ errors: [err.message] });
	}
}

export async function service_verify(req, res, next) {
	try {
		const { proof, inputs, verificationKeys } = req.body;
		const errors = []

		if (!Array.isArray(proof)) {
			errors.push({
				name: 'proof',
				message: `proof is not an array`,
				received: proof
			})
		}

		if (!Array.isArray(inputs)) {
			errors.push({
				name: 'inputs',
				message: `inputs is not an array`,
				received: inputs
			})
		}

		if (!Array.isArray(verificationKeys)) {
			errors.push({
				name: 'verificationKeys',
				message: `verificationKeys is not an array`,
				received: verificationKeys
			})
		}

		if (errors.length > 0) {
			return res.status(422).send({ errors });
		}

		const verifier = await getContractInstance("Verifier");
		logger.info(`Verifier ${verifier.options.address}`);
		logger.info({ proof, inputs, verifier });
		const result = await verifier.methods.verify(proof, inputs, verificationKeys).call();
		logger.info(`VerifierResponse: ${JSON.stringify(result)}`);
		return res.send({ result });
	} catch (err) {
		logger.error(err);
		res.status(400).send({ errors: [err.message] });
	}
}
