'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
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

let counter;

/////////////////////////////////////////////////

// My Answer

//To remove the inner HTML code for display movements
containerMovements.innerHTML = '';


//To Display total Movements
const calcPrintBalance = function(acc){
  const movements = acc.movements;
  acc.balance = movements.reduce((acc,mov) => acc + mov , 0);
  labelBalance.textContent = `${acc.balance}€`;
}

//Display Movements
const displayMovements = function (movements , sort = false){

  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
  movs.forEach(function (mov, i){
    //To find the type either deposit or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //To create a dynamic HTML variable
  const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
  <div class="movements__value">${mov}€</div>
</div>`;

//To change the original HTML file
    containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}



//To Display totalIncome
const calcDisplaySummary = function (acc){
  let movements = acc.movements;
  const incomes = movements.filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov,0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = movements.filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov,0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = movements.filter(mov => mov > 0)
  .map(mov => mov * acc.interestRate / 100)
  .filter(mov => mov >= 1)
  .reduce((acc,mov) => acc + mov,0);
  labelSumInterest.textContent = interest > 1 ? `${interest}€` : `0€`;

}

const createUserName = function (accs){
  accs.forEach(function(values){
    values.userName = values.owner.toLowerCase()
    .split(' ')
    .map(names => names[0])
    .join('');
  })
}

createUserName(accounts);

const displayUI = function (acc){

  //To remove the inner HTML code for display movements
  containerMovements.innerHTML = '';
  
  
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcPrintBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
}

const logoutScreen = function()
{
  containerApp.style.opacity = 0;
}

//Event Handlers
let currentAccount;
btnLogin.addEventListener('click', function(e){
  containerMovements.innerHTML = '';
  // Prevent form from submitting
  e.preventDefault();
  // createUserName(accounts);
  counter = false;

  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    console.log('LOGIN');
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

     //Display UI
    displayUI(currentAccount);
    

  }
}
);

//Event handler for the transfer button

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
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
    receiverAcc.movements.push(transferAmount);

    //Clear the Input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  
    //DisplayUI
    displayUI(currentAccount);
  }
  });

  //Event handler for close account button

  btnClose.addEventListener('click', function(e){
    e.preventDefault();
    console.log(accounts);

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
    
    const amount = Number(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1))
    currentAccount.movements.push(amount);
    inputLoanAmount.value = '';

    displayUI(currentAccount);
  });

  btnSort.addEventListener('click', function(e){
    e.preventDefault();

    counter = counter ? false : true;
    counter ? displayMovements(currentAccount.movements,counter) : displayMovements(currentAccount.movements);

  });
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//For my reference

// for (let i=0; i<movements.length;i++){
//   console.log(i);
//   console.log(movements[i]);
// }

// for (let [index,value] of movements.entries()){
//   console.log(index,value);
// }

// arr.at(0)
//arr.slice(0)

// console.log(movements.slice(-1)[0]);
// console.log(movements.at(-1));

// const buddies = new Map([
//   ['chromepet','Bala'],
//   ['keelkatalai','Shravan'],
//   [600001, 'no one']
// ])

// buddies.forEach(function(names,areas,maps){
//   console.log(names, areas, maps);
// })

// const bud = new Set([1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3]);
// console.log(bud);
// bud.forEach(function(values,keys,buds){
//   console.log(``);
// });

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and 
stored the data into an array (one array for each). For now, they are just interested in knowing whether a 
dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less 
than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does 
the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create 
a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice 
to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years 
old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function(dogsJulia, dogsKate){
//   const correctedJulia = dogsJulia.slice(1,-2);
//   console.log(correctedJulia);
//   const totalArray = [...correctedJulia , ...dogsKate];
//   totalArray.forEach(function(value,i){
//     console.log(`Dog number ${i+1} ${value >=3 ? 'is an adult, and is '+value+' years old' : 'is still a puppy 🐶'}`);

//   })
// }

// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);

// const a = [1,2,3,4,5];
// // let b =a.map(function(arrays){
// //   let i;
// //   let fact=1;
// //   for(i=1;i<=arrays;i++){    
// //     fact=fact*i;
// //   }
// //   return fact;
// // });
// // console.log(b);

// console.log(a.map ( i => i*5));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const withdrawal = movements.filter(values => values < 0);

// console.log(withdrawal);

// const a = [1,2,3,4,5];

// const max = a.reduce(function(acc,i){
//   console.log(acc,i);
//   if (acc > i) return i;
//   else {
//     return i;
//   }
// },a[0]);

// // 1 1 return:1 acc:1
// // 1 2 return:1 acc:1
// // 1 3 return:1 acc:1
// // 1 4 return:1 acc:1
// // 1 5 return:1 acc:1


// console.log(max);

// MAX = ARRAY 1st Element

// Check MAX element to next Element (MAX < next)

// True : MAX = next element

// False : continue

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages 
and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the 
following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, 
humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at 
  least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we 
  calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (dAge){
// const humanAge = dAge.map(dA => dA <= 2 ? 2 * dA : 16 + dA * 4);
// const filterAge = humanAge.filter(hA => hA >= 18);
// const avgAge = filterAge.reduce((acc, age, index, array) => acc + age/array.length, 0);
// console.log(humanAge);
// console.log(filterAge);
// console.log(avgAge);
// }



// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const a = [1,2,3,-1,-2,-3]

// console.log(a.filter(a => a < 0));

// console.log(a.find(a => a < 0));

// const a = Array.from({length : 100},() => Math.random());
// console.log(a);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too 
little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too 
little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the 
recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and 
add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: 
recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have 
multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky 
(on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with 
all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs 
eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended 
(just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition 
  used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between 
them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > 
(recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 
90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

//My Answer

//1

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and 
// add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: 
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

dogs.forEach(dog => dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28));
console.log(dogs);

//2
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have 
// multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky 
// (on purpose) 🤓

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(`Sarah's dog is eating too ${sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'}`);

//3
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with 
// all owners of dogs who eat too little ('ownersEatTooLittle').
// 0: {weight: 22, curFood: 250, owners: ['Alice', 'Bob'], recommendedFood: 284}
// 1: {weight: 8, curFood: 200, owners: ['Matilda'], recommendedFood: 133}
// 2: {weight: 13, curFood: 190, owners: ['Sarah', 'John'], recommendedFood: 191}
// 3: {weight: 32, curFood: 340, owners: ['Michael'], recommendedFood: 376}

// const [ownersEatTooMuch,ownersEatTooLittle] = [[],[]];

const [ownersEatTooMuch, ownersEatTooLittle] = 
[dogs.filter(dog => dog.curFood > dog.recommendedFood).flatMap(dog => dog.owners),
dogs.filter(dog => dog.curFood < dog.recommendedFood).flatMap(dog => dog.owners)];
console.log(ownersEatTooMuch,ownersEatTooLittle);

//4
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs 
// eat too much!" and "Sarah and John and Michael's dogs eat too little!"

const displayOwner = function (owners){
  console.log(`${owners.join(' and ')}'s dog eat too ${owners === ownersEatTooMuch ? 'much' : 'little'}`);
}

displayOwner(ownersEatTooMuch);
displayOwner(ownersEatTooLittle);

//5
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended 
// (just true or false)

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//6
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)

console.log(dogs.some(dog => dog.curFood > (dog.recommendedFood * 0.90) && dog.curFood < (dog.recommendedFood * 1.10)));

//7
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition 
//   used in 6.)

const okayDogs = dogs.filter(dog => dog.curFood > (dog.recommendedFood * 0.90) && dog.curFood < (dog.recommendedFood * 1.10));
console.log(okayDogs);

//8
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order 
// (keep in mind that the portions are inside the array's objects)

const sortedDogs = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood);
console.log(sortedDogs);















