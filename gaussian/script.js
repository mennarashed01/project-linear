function createMatrixInput() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const matrixInputDiv = document.getElementById('matrix-input');

    let table = '<table>';
    for (let i = 0; i < rows; i++) {
        table += '<tr>';
        for (let j = 0; j < columns; j++) {
            table += `<td><input type="number" id="cell-${i}-${j}" step="1"></td>`;
        }
        table += '</tr>';
    }
    table += '</table>';

    matrixInputDiv.innerHTML = table;
    matrixInputDiv.classList.remove('hidden');

    document.getElementById('solve-button').classList.remove('hidden');
}

function solveMatrix() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    let matrix = [];

    // Collecting matrix input values
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns; j++) {
            matrix[i][j] = parseFloat(document.getElementById(`cell-${i}-${j}`).value) || 0;
        }
    }

    const { steps, solutions, solutionType } = gaussianElimination(matrix);
    displaySteps(steps, solutions, solutionType);
}

function gaussianElimination(matrix) {
    let steps = [];
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    for (let i = 0; i < numRows; i++) {
        if (matrix[i][i] === 0) {
            let swapped = false;
            for (let k = i + 1; k < numRows; k++) {
                if (matrix[k][i] !== 0) {
                    [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
                    steps.push({
                        matrix: JSON.parse(JSON.stringify(matrix)),
                        description: `Swap row R${i + 1} with row R${k + 1}`
                    });
                    swapped = true;
                    break;
                }
            }
            if (!swapped) continue;
        }

        let divisor = matrix[i][i];
        if (divisor !== 0) {
            for (let j = i; j < numCols; j++) {
                matrix[i][j] /= divisor;
            }
            steps.push({
                matrix: JSON.parse(JSON.stringify(matrix)),
                description: `Normalize row R${i + 1}`
            });
        }

        for (let k = i + 1; k < numRows; k++) {
            let factor = matrix[k][i];
            for (let j = i; j < numCols; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
            steps.push({
                matrix: JSON.parse(JSON.stringify(matrix)),
                description: `R${k + 1} = R${k + 1} - (${factor} * R${i + 1})`
            });
        }
    }

    let solutionType = "Unique solution";
    for (let i = 0; i < numRows; i++) {
        const isZeroRow = matrix[i].slice(0, numCols - 1).every(val => val === 0);
        if (isZeroRow && matrix[i][numCols - 1] !== 0) {
            solutionType = "No solution";
            break;
        } else if (isZeroRow && matrix[i][numCols - 1] === 0) {
            solutionType = "Infinite solutions";
        }
    }

    let solutions = new Array(numRows).fill(0);
    if (solutionType === "Unique solution") {
        for (let i = numRows - 1; i >= 0; i--) {
            solutions[i] = matrix[i][numCols - 1];
            for (let j = i + 1; j < numCols - 1; j++) {
                solutions[i] -= matrix[i][j] * solutions[j];
            }
        }
    }

    return { steps, solutions, solutionType };
}

function displaySteps(steps, solutions, solutionType) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h2>Steps:</h2>';
    
    steps.forEach(step => {
        outputDiv.innerHTML += `<div class="step-description">${step.description}</div>`;
        let stepTable = '<table class="output-table">';
        step.matrix.forEach(row => {
            stepTable += '<tr>';
            row.forEach(cell => {
                stepTable += `<td>${cell}</td>`;
            });
            stepTable += '</tr>';
        });
        stepTable += '</table>';
        outputDiv.innerHTML += stepTable;
    });

    outputDiv.innerHTML += '<h3>Final Results:</h3>';
    
    if (solutionType === "Unique solution") {
        solutions.forEach((solution, index) => {
            outputDiv.innerHTML += `<p>Variable x<sub>${index + 1}</sub> = ${solution}</p>`;
        });
    } else {
        outputDiv.innerHTML += `<p class="solution-type">${solutionType}</p>`;
    }

    outputDiv.classList.remove('hidden');
}