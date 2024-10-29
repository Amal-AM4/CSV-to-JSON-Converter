document.getElementById('convertButton').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const csvData = e.target.result;
        const jsonData = csvToJson(csvData);
        downloadJson(jsonData);
    };

    reader.readAsText(file);
});

function csvToJson(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim()); // Trim headers

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',').map(value => value.trim()); // Trim each value

        // Check if the current line has the same number of columns as headers
        if (currentLine.length === headers.length) {
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }
            result.push(obj);
        } else {
            console.warn(`Line ${i + 1} does not match header length: ${lines[i]}`);
        }
    }

    return JSON.stringify(result, null, 2); // Pretty-print JSON
}

function downloadJson(jsonData) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000); // Current time in seconds
    const downloadLink = document.getElementById('downloadLink');

    downloadLink.href = url;
    downloadLink.download = `data_${timestamp}.json`; // Updated filename
    downloadLink.style.display = 'block';
    downloadLink.innerText = 'Download JSON';
}
