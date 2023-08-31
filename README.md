# OAK-onramp-dapp

Home page
http://13.56.134.190

1. User signup into the web application by accepting the Teams & Conditions.
	> We are using Bridge API to create terms and service link, and when user accepts terms and condition, this will send to request to Bridge server and redirects to Signup page with unique indentifier code.
	> User has to fill form fields First name, Last name, Full Address, Email, Password, Phone and SSN. When user submits form, then user filled details along with the identifier code will we send to the bridge API and user is created in the Bridge account.
	> Bridge API send us the user unique ID that we are saving in the database
	> This unique user ID will be used for further API calls.
2. On successful signup, user can login into the system using Email and Password.
3. On successful login, 
	> User can connect the crypto wallet using Rainbow account authentication.
		> In response from the rainbow API we are getting the user crypto wallet address of the connected account. Users crypto address will be saved in the database for further transfers
	> User can connect external bank account. To link external bank accounts,  we are using PLAID API.
		> The PLAID API will give us the account number and routing number of the connected account.  This Account Details will be saved in the database in encrypted form.
	> This account details will be used to buy crypto.
4. Was the crypto account is connected successfully, user can now view the balance in the crypto account
5. Option to disconnect connected wallet.

Overview for Swap

Installation

Hardhat, Truffle (npm)

$ npm install @openzeppelin/contracts
OpenZeppelin Contracts features a stable API, which means that your contracts won't break unexpectedly when upgrading to a newer minor version.

Foundry (git)

Warning When installing via git, it is a common error to use the master branch. This is a development branch that should be avoided in favor of tagged releases. The release process involves security measures that the master branch does not guarantee.
Warning Foundry installs the latest version initially, but subsequent forge update commands will use the master branch.
$ forge install OpenZeppelin/openzeppelin-contracts
Add @openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/ in remappings.txt.

When a user signs up -> our backend triggers an event where 1 OAK token is being sent via rainbow wallet rails. We currently trigger it via through number of contracts avaible OpenZeppelin  which is fired from AWS.


ERC20 ReadMe:
ERC 20

Note
This document is better viewed at https://docs.openzeppelin.com/contracts/api/token/erc20
This set of interfaces, contracts, and utilities are all related to the ERC20 Token Standard.

Tip
For an overview of ERC20 tokens and a walk through on how to create a token contract read our ERC20 guide.
There are a few core contracts that implement the behavior specified in the EIP:

{IERC20}: the interface all ERC20 implementations should conform to.

{IERC20Metadata}: the extended ERC20 interface including the name, symbol and decimals functions.

{ERC20}: the implementation of the ERC20 interface, including the name, symbol and decimals optional standard extension to the base interface.

Additionally there are multiple custom extensions, including:

{ERC20Burnable}: destruction of own tokens.

{ERC20Capped}: enforcement of a cap to the total supply when minting tokens.

{ERC20Pausable}: ability to pause token transfers.

{ERC20Permit}: gasless approval of tokens (standardized as ERC2612).

{ERC20FlashMint}: token level support for flash loans through the minting and burning of ephemeral tokens (standardized as ERC3156).

{ERC20Votes}: support for voting and vote delegation.

{ERC20Wrapper}: wrapper to create an ERC20 backed by another ERC20, with deposit and withdraw methods. Useful in conjunction with {ERC20Votes}.

{ERC4626}: tokenized vault that manages shares (represented as ERC20) that are backed by assets (another ERC20).

Finally, there are some utilities to interact with ERC20 contracts in various ways:

{SafeERC20}: a wrapper around the interface that eliminates the need to handle boolean return values.

Other utilities that support ERC20 assets can be found in codebase:

ERC20 tokens can be timelocked (held tokens for a beneficiary until a specified time) or vested (released following a given schedule) using a {VestingWallet}.

Note
This core set of contracts is designed to be unopinionated, allowing developers to access the internal functions in ERC20 (such as _mint) and expose them as external functions in the way they prefer.
Core

{{IERC20}}

{{IERC20Metadata}}

{{ERC20}}

Extensions

{{ERC20Burnable}}

{{ERC20Capped}}

{{ERC20Pausable}}

{{ERC20Permit}}

{{ERC20Votes}}

{{ERC20Wrapper}}

{{ERC20FlashMint}}

{{ERC4626}}

Utilities

{{SafeERC20}}
