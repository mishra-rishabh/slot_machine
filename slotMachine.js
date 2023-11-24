const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 4;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

function deposit() {
    while(true) {
        let depositAmount = prompt("Enter a deposit amount: ");
        depositAmount = parseFloat(depositAmount);

        if(isNaN(depositAmount) || depositAmount <= 0) {
            console.log("Invalid Deposit Amount. Please Try Again!");
        } else {
            return depositAmount;
        }
    }
}

function getNumberOfLinesToBetOn() {
    while(true) {
        let numberOfLines = prompt("Enter the number of lines to bet on (1-3): ");
        numberOfLines = parseFloat(numberOfLines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid Number of Lines. Please Try Again!");
        } else {
            return numberOfLines;
        }
    }
}

function getBettingAmount(userBalance, linesToBetOn) {
    while(true) {
        let bettingAmountPerLine = prompt("Enter the betting amount per line: ");
        bettingAmountPerLine = parseFloat(bettingAmountPerLine);

        if(isNaN(bettingAmountPerLine) || bettingAmountPerLine <= 0 || bettingAmountPerLine > (userBalance / linesToBetOn)) {
            console.log("Invalid Betting Amount. Please Try Again!");
        } else {
            return bettingAmountPerLine;
        }
    }
}

function spinSlotMachine() {
    const symbolsArr = [];

    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for(let i = 0; i < count; i++) {
            symbolsArr.push(symbol);
        }
    }

    const reels = [];

    for(let i = 0; i < COLS; i++) {
        reels.push([]);
        
        const reelSymbols = [...symbolsArr];

        for(let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];

            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

function transposeReels(reels) {
    const rows = [];

    for(let i = 0; i < ROWS; i++) {
        rows.push([]);

        for(let j = 0; j < ROWS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

function printSlotMachine(rows) {
    for(const row of rows) {
        let rowString = "";
        
        for(const [i, symbol] of row.entries()) {
            rowString += symbol;

            if(i != row.length - 1) {
                rowString += " | ";
            }
        }

        console.log(rowString);
    }
}

function getWinnings(rows, bettingAmount, linesToBetOn) {
    let wiinings = 0;

    for(let row = 0; row < linesToBetOn; row++) {
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols) {
            if(symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if(allSame) {
            wiinings += bettingAmount * SYMBOL_VALUES[symbols[0]];
        }
    }

    return wiinings;
}

const game = () => {
    let balance = deposit();

    while(true) {
        console.log("Your Current Balance: ₹", balance);
        const numberOfLinesToBetOn = getNumberOfLinesToBetOn();
        const bettingAmount = getBettingAmount(balance, numberOfLinesToBetOn);
        balance -= bettingAmount * numberOfLinesToBetOn;
        const reels = spinSlotMachine();
        const rows = transposeReels(reels);
        printSlotMachine(rows);
        const winnings = getWinnings(rows, bettingAmount, numberOfLinesToBetOn);
        balance += winnings;
        console.log("Congratulations!! You won ₹" + winnings.toString() + " on your bet.");

        if(balance == 0) {
            console.log("Insufficient Balance to make a bet!!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?");

        if(playAgain != "y") {
            break;
        }
    }
}

game();