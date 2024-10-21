const generateCreditCardNumber = (base: string): string => {
    let cardNumber = base;
    while (cardNumber.length < 15) {
        cardNumber += Math.floor(Math.random() * 10);
    }

    const checkDigit = calculateLuhnCheckDigit(cardNumber);
    
    return cardNumber + checkDigit;
}

function calculateLuhnCheckDigit(cardNumber: string): number {
    let sum = 0;
    let shouldDouble = true;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (10 - (sum % 10)) % 10;
}

export default generateCreditCardNumber;

// Example usage:
const base = "421337";
// const creditCardNumber = generateCreditCardNumber(base);
// console.log("Generated Credit Card Number:", creditCardNumber);
