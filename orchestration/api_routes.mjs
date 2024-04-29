import {
	service_deposit,
	service_getRegisteredZKPPublic,
	service_timberProxy,
	service_verify
} from "./api_services.mjs"

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

router.use("/timber", service_timberProxy);

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

router.get("/registeredZKPPublic", service_getRegisteredZKPPublic);
router.get("/verify", service_verify);

export default router;
