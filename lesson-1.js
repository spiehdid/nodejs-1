const colors = require("colors/safe");

const isPrime = (number) => {
  if (number < 2) return false;

  for (let i = 2; i <= number / 2; i++) {
    if (number % i === 0) return false;
  }

  return true;
};

//process.argv это массив строк (string[]), поэтому typeof process.argv[N]  всегда будет 'string'
const isArgsTypeOfNumber = (...args) => {
  for (const key in args) {
    if (isNaN(args[key]) || !args[key].trim()) {
      console.log(colors.red(`Argument '${args[key]}' - is not a number`));
      return false;
    }
  }
  return true;
}

let count = 1;
let isPrimeNumber = false;
let primeCount = 0;

const from = Number(process.argv[2]);
const to = +process.argv[3];

if (!(isFinite(from) && isFinite(to))) {
  console.error(colors.red("Входные параметры должны быть числами!!!"));
  process.exit(1);
}

if (!isArgsTypeOfNumber(from, to)) process.exit(); // Если один из аргументов не число завершаем программу

for (let number = from; number <= to; number++) {
  let colorer = colors.green;

  if (isPrime(number)) {
    primeCount++;
    if (count % 2 === 0) {
      colorer = colors.yellow;
      count += 1;
    } else if (count % 3 === 0) {
      colorer = colors.red;
      count = 1;
    } else {
      count += 1;
    }

    console.log(colorer(number));

    isPrimeNumber = true;
  }
}

if (!isPrimeNumber) console.log(colors.red('There are no prime numbers'))
if (primeCount === 0) {
  console.error(colors.red("В последовательности нет простых чисел!!!"));
}
