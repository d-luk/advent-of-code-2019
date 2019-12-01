const fs = require('fs');

const fileContents = fs.readFileSync('./input.txt', 'utf8');
const moduleMasses = fileContents.split('\r\n').map(x => parseInt(x));

const calculateFuel = mass => Math.max(Math.floor(mass / 3) - 2, 0);
const sum = values => values.reduce((result, fuel) => result + fuel, 0);

const moduleFuels = moduleMasses.map(mass => calculateFuel(mass));
const totalModuleFuel = sum(moduleFuels);

console.log('Result part 1: ' + totalModuleFuel);

const adjustedFuels = moduleFuels.map(moduleFuel => {
    let requiredFuel = moduleFuel;
    let fuelToCompensate = moduleFuel;

    while (fuelToCompensate > 0) {
        const additionalFuel = calculateFuel(fuelToCompensate);

        requiredFuel += additionalFuel;
        fuelToCompensate = additionalFuel;
    }

    return requiredFuel;
});

const totalAdjustedFuels = sum(adjustedFuels);

console.log('Result part 2: ' + totalAdjustedFuels);
