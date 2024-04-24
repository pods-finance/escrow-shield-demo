import { service_deposit } from "./api_services.mjs";

import { service_transfer } from "./api_services.mjs";

import { service_withdraw } from "./api_services.mjs";

import {
	service_allCommitments,
	service_getCommitmentsByState,
	service_reinstateNullifiers,
	service_getBalance,
	service_getBalanceByState,
} from "./api_services.mjs";

import express from "express";

const router = express.Router();

// eslint-disable-next-line func-names
router.post("/deposit", service_deposit);

// eslint-disable-next-line func-names
router.post("/transfer", service_transfer);

// eslint-disable-next-line func-names
router.post("/withdraw", service_withdraw);

// commitment getter routes
router.get("/getAllCommitments", service_allCommitments);
router.get("/getCommitmentsByVariableName", service_getCommitmentsByState);
router.get("/getBalance", service_getBalance);
router.get("/getBalanceByState", service_getBalanceByState);
// nullifier route
router.post("/reinstateNullifiers", service_reinstateNullifiers);

export default router;
