const axios = require('axios')
const { expect } = require("chai");

describe('Full scenario - (depositA / depositA / depositB / depositB / Transfer / Withdraw)', () => {
  let escrowShieldAddress, erc20Address, bankAAccount, BankBaccount
  let erc20
  let orchestrationURLBankA, orchestrationURLBankB
  let bankASigner, bankBSigner

  before(async () => {
    [bankASigner, bankBSigner] = await ethers.getSigners()
    escrowShieldAddress = '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9'
    erc20Address = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
    accountBankA = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    orchestrationURLBankA = 'http://localhost:3000'
    orchestrationURLBankB = 'http://localhost:3000'

    erc20 = await hre.ethers.getContractAt('contracts/ERC20.sol:ERC20', erc20Address)
    await erc20.connect(bankASigner).approve(escrowShieldAddress, 10000000000)

    /*
      Initial Setup
      1) Deploy contracts
      2) Mint tokens
      3) Approve tokens
      OUTPUTS: 
        - ERC20 Address
        - EscrowShield Address
    */
    
  })

  it('Should BankA deposit 100 units to EscrowShield', async () => {
    const allowance = await erc20.allowance(accountBankA, escrowShieldAddress);
    const balanceOf = await erc20.balanceOf(accountBankA);
    expect(allowance).to.greaterThan(0)
    expect(balanceOf).to.greaterThan(0)

    const INITIAL_AMOUNT = 100

    const response = await axios.post(`${orchestrationURLBankA}/deposit`, { amount: INITIAL_AMOUNT})
    expect(response.status).to.equal(200)
    expect(response.data.tx.event).to.equal('NewLeaves')
  });

});
