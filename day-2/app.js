const fs = require('fs');

const fileContents = fs.readFileSync('./input.txt', 'utf8');
const input = fileContents.split(',').map(x => parseInt(x));

const opcodes = {
    add: 1,
    multiply: 2,
    halt: 99,
}

const instructionSizes = {
    [opcodes.add]: 4,
    [opcodes.multiply]: 4,
    [opcodes.halt]: 1,
}

function runIntcode(originalIntcode, noun, verb) {
    // Make a copy so we don't modify the original
    const intcode = originalIntcode.slice();

    intcode[1] = noun;
    intcode[2] = verb;

    let halted = false;
    let pointer = 0;

    do {
        const opcode = intcode[pointer];
        const instructionSize = instructionSizes[opcode];
        const parameterCount = instructionSize - 1;
        const parametersStartAddress = pointer + 1;

        const parameters = parameterCount === 0 
            ? [] 
            : intcode.slice(
                parametersStartAddress,
                parametersStartAddress + parameterCount
              );

        applyInstruction(opcode, parameters, intcode);

        halted = opcode === opcodes.halt;
        pointer += instructionSize;

    } while (!halted);

    return intcode[0];
}

function applyInstruction(opcode, parameters, intcode) {
    if (opcode === opcodes.halt) {
        return;
    }

    const calculate = (() => {
        switch (opcode) {
            case opcodes.add:
                return (value1, value2) => value1 + value2;
            
            case opcodes.multiply:
                return (value1, value2) => value1 * value2;
    
            default:
                throw new Error('Unknown opcode: ' + opcode);
        }
    })();

    const [address1, address2, outputAddress] = parameters;

    const value1 = intcode[address1];
    const value2 = intcode[address2];

    intcode[outputAddress] = calculate(value1, value2);
}

console.log('Result part 1: ' + runIntcode(input, 12, 2));

function findNounAndVerb(desiredResult) {
    for (let noun = 0; noun < 99; noun++) {
        for (let verb = 0; verb < 99; verb++) {
            const result = runIntcode(input, noun, verb);
    
            if (result === desiredResult) {
                return {noun, verb};
            }
        }
    }

    throw new Error('No noun and verb can result in ' + desiredResult);
}

const {noun, verb} = findNounAndVerb(19690720);

console.log('Result part 2: ' + (100 * noun + verb));
