'use strict';

// BANKIST APP //

// Data
const account1 = {
    owner: 'Billu Billeshwar',
    transactions: [200, 455.23, -306.5, 2500, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    transactionDates: [
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
        '2021-02-23T21:31:17.178Z',
        '2021-02-19T07:42:02.383Z',
    ],
    currency: 'CAD',
    locale: 'en-CA',
};

const account2 = {
    owner: 'Tillu Taylor',
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    transactionDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'en-UK',
};

const account3 = {
    owner: 'Gullu Gaitonde',
    transactions: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    transactionDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'en-UK',
};

const account4 = {
    owner: 'Pappu Parik',
    transactions: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    transactionDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
    ],
    currency: 'INR',
    locale: 'in-HI',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome'),
    labelDate = document.querySelector('.date'),
    labelBalance = document.querySelector('.balance__value'),
    labelSumIn = document.querySelector('.summary__value--in'),
    labelSumOut = document.querySelector('.summary__value--out'),
    labelSumInterest = document.querySelector('.summary__value--interest'),
    labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app'),
    containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn'),
    btnTransfer = document.querySelector('.form__btn--transfer'),
    btnLoan = document.querySelector('.form__btn--loan'),
    btnClose = document.querySelector('.form__btn--close'),
    btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user'),
    inputLoginPin = document.querySelector('.login__input--pin'),
    inputTransferTo = document.querySelector('.form__input--to'),
    inputTransferAmount = document.querySelector('.form__input--amount'),
    inputLoanAmount = document.querySelector('.form__input--loan-amount'),
    inputCloseUsername = document.querySelector('.form__input--user'),
    inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS //
// Function: Display transactions to UI
const displayTransactions = (account, sort = false) => {
    containerTransactions.innerHTML = '';
    const txns = sort
        ? account.transactions.slice().sort((a, b) => a - b)
        : account.transactions;

    txns.forEach((currentItem, i) => {
        const type = currentItem < 0 ? 'withdrawal' : 'deposit';
        const date = new Date(account.transactionDates[i]);
        // date
        const displayDate = formatTxnDate(date, account.locale);
        // transaction amount
        const txnAmt = formatCurrency(
            currentItem,
            account.locale,
            account.currency
        );
        const html = `
            <div class="transactions__row">
                <div class="transactions__type transactions__type--${type}">${i} ${type}</div>
                <div class="transactions__date">${displayDate}</div>
                <div class="transactions__value">${txnAmt}</div>
            </div>
        `;

        containerTransactions.insertAdjacentHTML('afterbegin', html);
    });
};

// Function: Calculate summary and display to UI
const calcDisplaySummary = (account) => {
    const { transactions, interestRate } = account;
    // incoming transactions
    const incomes = transactions
        .filter((transaction) => transaction > 0)
        .reduce((acc, cur) => acc + cur, 0);
    labelSumIn.textContent = formatCurrency(
        incomes,
        account.locale,
        account.currency
    );

    // outgoing transactions
    const expenses = transactions
        .filter((transaction) => transaction < 0)
        .reduce((acc, cur) => acc + cur, 0);
    labelSumOut.textContent = formatCurrency(
        Math.abs(expenses),
        account.locale,
        account.currency
    );

    // imaginary interest
    const interest = transactions
        .filter((transaction) => transaction > 0)
        .map((deposit) => deposit * (interestRate / 100))
        .filter((int) => int >= 1)
        .reduce((acc, cur) => acc + cur, 0);
    labelSumInterest.textContent = formatCurrency(
        interest,
        account.locale,
        account.currency
    );
};

// Function: Create Username
const createUsername = (accounts) => {
    accounts.forEach((account) => {
        account.username = account.owner
            .toLowerCase()
            .split(' ')
            .map((name) => name[0])
            .join('');
    });
};

// Function: Calculate account balance & display to UI
const displayAccountBalance = (account) => {
    const { transactions } = account;
    account.balance = transactions.reduce((acc, cur) => acc + cur, 0);
    labelBalance.textContent = new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(account.balance);
};

// Function: Update UI
const updateUI = (account) => {
    // Display transactions
    displayTransactions(account);
    // Display balance
    displayAccountBalance(account);
    // Display summary
    calcDisplaySummary(account);
};

// Function: Format transaction date
const formatTxnDate = (date, locale) => {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date);
    // return statements under 7days
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesderday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    // return date if 7+days using Internationalize API
    const dateOptions = {
        day: 'numeric',
        month: 'short',
        // year: '2-digit',
        year: 'numeric',
    };
    const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(
        date
    );
    return formattedDate;
};

// Function: Format currency format
const formatCurrency = (amount, locale, currency) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};

// Create account usernames
createUsername(accounts);

// Get all transactions in all accounts usning flat method
const overallBalance = accounts
    .map((acc) => acc.transactions)
    .flat()
    .reduce((acc, cur) => acc + cur, 0);
// Get all transactions in all accounts usning flatMap method
const overallBalance2 = accounts
    .flatMap((acc) => acc.transactions)
    .reduce((acc, cur) => acc + cur, 0);

// EVENT LISTENERS //
// Event Listener: Login button
let currentAccount;
btnLogin.addEventListener('click', (e) => {
    // Prevent form from subbmitting
    e.preventDefault();
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI & welcome message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        // Clear input fields
        inputLoginUsername.value = '';
        inputLoginPin.value = '';
        inputLoginPin.blur(); // removes focus

        // Display Date
        const now = new Date();
        const locale = currentAccount.locale;
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        };
        labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
            now
        );

        // Update UI
        updateUI(currentAccount);
    } else {
        console.log('Incorrect credentials');
    }
});

// Event Listener: Transfer money
btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiver = inputTransferTo.value;
    const receiverAcc = accounts.find(
        (account) => account.username === receiver
    );

    // clear inputs
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();

    // Check if account has enough money to transfer
    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // create transaction
        currentAccount.transactions.push(-amount);
        receiverAcc.transactions.push(amount);
        // Add transaction date
        currentAccount.transactionDates.push(new Date().toISOString());
        receiverAcc.transactionDates.push(new Date().toISOString());
        // update UI
        updateUI(currentAccount);
    } else {
        console.log('Error, something went wrong!');
    }
});

// Event Listener: Close account button
btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    // Check if user entered correct credentaials
    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        // find the index of currentAccount
        const index = accounts.findIndex(
            (acc) => acc.username === currentAccount.username
        );
        // remove currentAccount from accounts arr
        accounts.splice(index, 1);
        // hide UI
        containerApp.style.opacity = 0;
    } else {
        console.log('Incorrect credentials!');
    }

    // Clear input fields
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputClosePin.blur(); // removes focus
});

// Event Listener: Loan Btn
btnLoan.addEventListener('click', (e) => {
    e.preventDefault();
    const loanReqAmt = Math.floor(inputLoanAmount.value);

    if (
        loanReqAmt > 0 &&
        // loan gets approved, if user has 1 transaction equal or greater than 10% of requested amount
        currentAccount.transactions.some(
            (transaction) => transaction >= loanReqAmt * 0.1
        )
    ) {
        // setTimeout to simulate loan processing
        setTimeout(() => {
            // add amount to transactions
            currentAccount.transactions.push(loanReqAmt);
            // add transaction date
            currentAccount.transactionDates.push(new Date().toISOString());
            // update UI
            updateUI(currentAccount);
        }, 3000);
    } else {
        console.log('Loan amount too high!');
    }

    // Clear input
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
});

// Event Listener: Sort button
let sorted = false;
btnSort.addEventListener('click', () => {
    displayTransactions(currentAccount, !sorted);
    sorted = !sorted;
});
