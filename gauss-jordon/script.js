// Matrix input creation and solver logic remain unchanged.
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

    const { steps, solutionType, solutions } = gaussJordanElimination(matrix);
    displayResults(steps, solutionType, solutions);
}

function gaussJordanElimination(matrix) {
        let steps = [];
        const rows = matrix.length;
        const cols = matrix[0].length;

        for (let i = 0; i < rows; i++) {
            // Make the pivot 1
            let pivot = matrix[i][i];
            if (pivot === 0) {
                for (let k = i + 1; k < rows; k++) {
                    if (matrix[k][i] !== 0) {
                        [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
                        steps.push({
                            matrix: JSON.parse(JSON.stringify(matrix)),
                            description: `Swap row R${i + 1} with row R${k + 1}`
                        });
                        pivot = matrix[i][i];
                        break;
                    }
                }
            }

            if (pivot !== 0) {
                for (let j = 0; j < cols; j++) {
                    matrix[i][j] /= pivot;
                }
                steps.push({
                    matrix: JSON.parse(JSON.stringify(matrix)),
                    description: `R${i + 1} = R${i + 1} / ${pivot.toFixed(2)}`
                });
            }

            // Make all other entries in the column 0
            for (let k = 0; k < rows; k++) {
                if (k !== i) {
                    const factor = matrix[k][i];
                    for (let j = 0; j < cols; j++) {
                        matrix[k][j] -= factor * matrix[i][j];
                    }
                    steps.push({
                        matrix: JSON.parse(JSON.stringify(matrix)),
                        description: `R${k + 1} = R${k + 1} - (${factor.toFixed(2)} * R${i + 1})`
                    });
                }
            }
        }

        // Analyze solution type
        let solutionType = "Unique solution";
        for (let i = 0; i < rows; i++) {
            const isZeroRow = matrix[i].slice(0, cols - 1).every(val => val === 0);
            if (isZeroRow && matrix[i][cols - 1] !== 0) {
                solutionType = "No solution";
                break;
            } else if (isZeroRow && matrix[i][cols - 1] === 0) {
                solutionType = "Infinite solutions";
            }
        }

        let solutions = [];
        if (solutionType === "Unique solution") {
            solutions = matrix.map(row => row[cols - 1]);
        }

        return { steps, solutionType, solutions };
    }

function displayResults(steps, solutionType, solutions) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<h2>Steps:</h2>';

    steps.forEach(step => {
        outputDiv.innerHTML += `<div class="step-description">${step.description}</div>`;
        let stepTable = '<table class="output-table">';
        step.matrix.forEach(row => {
            stepTable += '<tr>';
            row.forEach(cell => {
                stepTable += `<td>${cell.toFixed(2)}</td>`;
            });
            stepTable += '</tr>';
        });
        stepTable += '</table>';
        outputDiv.innerHTML += stepTable;
    });

    outputDiv.innerHTML += '<h3>Final Results:</h3>';
    if (solutionType === "Unique solution") {
        solutions.forEach((solution, index) => {
            outputDiv.innerHTML += `<p>Variable x<sub>${index + 1}</sub> = ${solution.toFixed(2)}</p>`;
        });
    } else {
        outputDiv.innerHTML += `<p class="solution-description">${solutionType}</p>`;
    }

    outputDiv.classList.remove('hidden');
}