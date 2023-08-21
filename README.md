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
