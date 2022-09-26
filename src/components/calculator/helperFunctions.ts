export const solveParentheses = (obj: any) => {
    obj = { ...obj };
    const keys = Object.keys(obj);
    if (keys.length !== 1) {
        keys.forEach((key) => {
            if (key === "input") {
                return;
            }
            const t = solveParentheses(obj[key]);

            obj.input = obj.input.replace(`(${obj[key].input})`, t);
        });
        return solveFlat(obj.input);
    } else {
        return solveFlat(obj.input);
    }
};

const solveFlat = (input: string) => {
    const ops = [
        { a: "^", b: "" },
        { a: "*", b: "/" },
        { a: "+", b: "-" },
    ];
    const opsArr = ["^", "*", "/", "+", "-"];

    let arr: (string | number)[] = [];
    let start = 0;
    let operator;
    let i;
    for (i = 0; i < input.length; i++) {
        if (opsArr.includes(input[i]!)) {
            operator = input[i];
            arr.push(input.slice(start, i));
            arr.push(operator!);
            start = i + 1;
        }
    }
    arr.push(input.slice(start, i));

    ops.forEach((op) => {
        const _arr = [...arr];

        let hasOpA = _arr.indexOf(op.a);
        let hasOpB = _arr.indexOf(op.b);
        let hasOp = -1;
        if (hasOpA === -1 && hasOpB === -1) {
            hasOp = -1;
        } else if (hasOpA !== -1 && hasOpB === -1) {
            hasOp = hasOpA;
        } else if (hasOpB !== -1 && hasOpA === -1) {
            hasOp = hasOpB;
        } else {
            hasOp = hasOpA > hasOpB ? hasOpB : hasOpA;
        }

        while (hasOp !== -1) {
            const answer = solve(
                Number(_arr[hasOp - 1]!),
                Number(_arr[hasOp + 1]!),
                String(_arr[hasOp]!)
            );
            _arr.splice(hasOp - 1, 3, answer);

            hasOpA = _arr.indexOf(op.a);
            hasOpB = _arr.indexOf(op.b);
            if (hasOpA === -1 && hasOpB === -1) {
                hasOp = -1;
            } else if (hasOpA !== -1 && hasOpB === -1) {
                hasOp = hasOpA;
            } else if (hasOpB !== -1 && hasOpA === -1) {
                hasOp = hasOpB;
            } else {
                hasOp = hasOpA > hasOpB ? hasOpB : hasOpA;
            }
        }
        arr = _arr;
    });
    if (arr.length !== 1) {
        throw new Error("Bad syntax");
    }

    return arr[0];
};

const solve = (a: number, b: number, operater: string) => {
    switch (operater) {
        case "*":
            return a * b;
        case "/":
            return a / b;
        case "+":
            return a + b;
        case "-":
            return a - b;

        default:
            return a + b;
    }
};

export const getParentheses = (input: string) => {
    let start = 0;
    let deepness = 0;
    const result: any = { input: input };
    let operationIndex = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === "(") {
            if (deepness === 0) {
                start = i + 1;
            }
            deepness += 1;
        }
        if (input[i] === ")") {
            deepness -= 1;

            if (deepness === 0) {
                const newInput = input.slice(start, i);
                const test = getParentheses(newInput);

                result[operationIndex] = test;
                operationIndex += 1;
            }
        }
    }

    return result;
};
