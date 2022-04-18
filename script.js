'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Manoj Sathiaraj',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: '2806',

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Shravan Chennai',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: '0207',

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-US',
};

const account3 = {
  owner: 'Balasubramanian Gurunathan',
  movements: [500, 255.23, -106.5, 55000, -633.21, -1332.9, 80.97, 1800],
  interestRate: 1.2, // %
  pin: '1209',

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', // de-DE
};

const account4 = {
  owner: 'Saranyan Sankrith',
  movements: [1900, 45.23, -310.5, 1000, -643.21, -135.9, 7.97, 1800],
  interestRate: 1.2, // %
  pin: '1001',

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', // de-DE
};

const account5 = {
  owner: 'Nishaanth Karthikeyan',
  movements: [1700, 457.23, -310.5, 25550, -771.21, -135.9, 91.97, 1765],
  interestRate: 1.2, // %
  pin: '0110',

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', // de-DE
};

const accounts = [account1, account2, account3, account4, account5];

const options = {
  hour : 'numeric',
  minute : 'numeric',
  day: 'numeric',
  month:'numeric',
  year : 'numeric'
};

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelWelcomeDetails = document.querySelector('.welcome-details');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

let counter;
containerMovements.innerHTML = '';
let timerFlag;

// Functions

//To format the movements (amount)
const formatMov = function (acc, currentMovement){
  return new Intl.NumberFormat(acc.locale, {
    style : 'currency',
    currency : acc.currency,
    }).format(currentMovement);
};

//To Display total Movements
const calcPrintBalance = function(acc){
  const movements = acc.movements;
  acc.balance = movements.reduce((acc,mov) => acc + mov , 0);
  labelBalance.textContent = `${formatMov(acc, acc.balance)}`;
};

//Display Movements
const displayMovements = function (acc , sort = false){

  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
  movs.forEach(function (mov, i){
    //To find the type either deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //To format number --> For displaying the movements(amount)
    const formattedMov = formatMov(acc, mov);

    //To create a dynamic HTML variable
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${new Intl.DateTimeFormat('en-US',options).format(new Date(acc.movementsDates[i]))}</div>
    <div class="movements__value">${formattedMov}</div> 
    </div>`;

    //To change the original HTML file
    containerMovements.insertAdjacentHTML('afterbegin',html);

  })
};

//To Display totalIncome
const calcDisplaySummary = function (acc){
  let movements = acc.movements;
  const incomes = movements.filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov,0);
  labelSumIn.textContent = `${formatMov(acc, incomes)}`;

  const outcomes = movements.filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov,0);
  labelSumOut.textContent = `${formatMov(acc, outcomes)}`;

  const interest = movements.filter(mov => mov > 0)
  .map(mov => mov * acc.interestRate / 100)
  .filter(mov => mov >= 1)
  .reduce((acc,mov) => acc + mov,0);
  labelSumInterest.textContent = interest > 1 ? `${formatMov(acc, incomes)}` : `${formatMov(acc, 0)}`;

};

const createUserName = function (accs){
  accs.forEach(function(values){
    values.userName = values.owner.toLowerCase()
    .split(' ')
    .map(names => names[0])
    .join('');
  })
};
createUserName(accounts);

const displayUI = function (acc){

const now = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-US',options).format(now);

  //To remove the inner HTML code for display movements
  containerMovements.innerHTML = '';
  
  //Display movements
  displayMovements(acc);

  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const logoutScreen = function()
{
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Please Login again to continue';
}

const setLogoutTimer = function(){
  let time = 600;
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(Math.trunc(time%60)).padStart(2,0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timerFlag);
      logoutScreen();
    }
    time--;
  }
  tick();
  timerFlag = setInterval(tick,1000);
}

///////////////////////////////////////
// Event handlers
let currentAccount;
btnLogin.addEventListener('click', function(e){
  containerMovements.innerHTML = '';
  labelWelcomeDetails.textContent = '';
  // Prevent form from submitting
  e.preventDefault();
  //Logout Timer operations
  if(timerFlag) clearInterval(timerFlag);
  setLogoutTimer();

  // createUserName(accounts);
  counter = false;

  const tempCopy = accounts.find(acc => acc.userName === inputLoginUsername.value);
  tempCopy != undefined ? currentAccount = tempCopy : '';
  console.log(currentAccount);

  if(currentAccount?.pin === inputLoginPin.value){
    console.log('LOGIN');
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
     //Display UI
    displayUI(currentAccount);
    

  }

  inputLoginUsername.value = inputLoginPin.value = '';
}
);

//Event handler for the transfer button

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  //Logout Timer operations
  if(timerFlag) clearInterval(timerFlag);
  setLogoutTimer();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  //Clear the input field
  inputTransferAmount.value = inputTransferTo.value = '';

  //Update movements of sender and receiver
  //Check if receiver account exist
  //Current user can't send money to current user himself
  //Check if the amount transfered is lesser than or equal to the current user's total balance
  if (receiverAcc && receiverAcc.userName != currentAccount.userName && transferAmount <= currentAccount.balance){
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(transferAmount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Clear the Input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  
    //DisplayUI
    displayUI(currentAccount);
  }
  });

//Event handler for close account button

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  //Logout Timer operations
  if(timerFlag) clearInterval(timerFlag);
  setLogoutTimer();

  if(inputCloseUsername.value === currentAccount.userName &&currentAccount.pin === Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc === currentAccount);
    accounts.splice(index,1);
    console.log(accounts);
    inputClosePin.value = inputCloseUsername.value = '';
    logoutScreen();
  }
  inputClosePin.value = inputCloseUsername.value = '';
} );

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  //Logout Timer operations
  if(timerFlag) clearInterval(timerFlag);
  setLogoutTimer();
  const amount = Math.floor(inputLoanAmount.value);

  setTimeout(function () {
    if(amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1))
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    

    displayUI(currentAccount);
  },2500);
  inputLoanAmount.value = '';
});

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  //Logout Timer operations
  if(timerFlag) clearInterval(timerFlag);
  setLogoutTimer();

  counter = counter ? false : true;
  counter ? displayMovements(currentAccount,counter) : displayMovements(currentAccount);

});

// document.querySelector('.balance').addEventListener('click',function(e){
// e.preventDefault();
// [...document.querySelectorAll('.movements__row')].forEach(function(row, index){
//   // index % 2 === 0 ? '' : row.style.backgroundColor = 'red';
//   const subArray = [...row.children];
//   subArray.forEach(function(value, i){
//     console.log(`i :${i} value: ${String(value)} `);
//   });
//   // console.log([...row.children]);
//   // console.log([...row.children].includes('.movements__type--deposit'));
// });

// })

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

