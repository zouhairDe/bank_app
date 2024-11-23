const generateCreditCardNumber = (base: string): string => {
    base += generateRandomSuffix();

    let cardNumber = base.slice(0, 15);
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

function generateRandomSuffix(): string {
    const timestamp = Date.now().toString();
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return timestamp + randomDigits;
}

export default generateCreditCardNumber;
