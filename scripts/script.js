// Function to toggle the visibility of the table
function toggleTable() {
    const table = document.getElementById('data-table');
    if (table.style.display === 'none') {
        table.style.display = 'table';
    } else {
        table.style.display = 'none';
    }
}

// Load data from JSON file and display it in the table
fetch('data/cases.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.CASE_NO}</td>
                <td>${item.S16_DECI}</td>
                <td>${item.S16_D_DATE}</td>
                <td>${item.DPO}</td>
                <td>${item.APLY_USE}</td>
                <td>${item.LOCAT_ADDR}</td>
            `;
            tableBody.appendChild(row);
        });
    });

// Chart.js setup for trends
const ctx = document.getElementById('trend-chart').getContext('2d');

fetch('data/cases.json')
    .then(response => response.json())
    .then(data => {
        const trends = {};

        // Calculate trends based on date and decision
        data.forEach(item => {
            const date = item.S16_D_DATE;
            const decision = item.S16_DECI;
            if (!trends[date]) trends[date] = { approved: 0, rejected: 0, revoked: 0 };

            if (decision.includes('Approved')) trends[date].approved++;
            else if (decision.includes('Rejected')) trends[date].rejected++;
            else if (decision.includes('Revoked')) trends[date].revoked++;
        });

        const labels = Object.keys(trends);
        const approvedCounts = labels.map(date => trends[date].approved);
        const rejectedCounts = labels.map(date => trends[date].rejected);
        const revokedCounts = labels.map(date => trends[date].revoked);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Approved Cases',
                        data: approvedCounts,
                        borderColor: 'green',
                        fill: false
                    },
                    {
                        label: 'Rejected Cases',
                        data: rejectedCounts,
                        borderColor: 'red',
                        fill: false
                    },
                    {
                        label: 'Revoked Cases',
                        data: revokedCounts,
                        borderColor: 'orange',
                        fill: false
                    }
                ]
            }
        });
    });

// Calculate probabilities
fetch('data/cases.json')
    .then(response => response.json())
    .then(data => {
        const totalCases = data.length;
        const approvedCases = data.filter(item => item.S16_DECI.includes('Approved')).length;
        const rejectedCases = data.filter(item => item.S16_DECI.includes('Rejected')).length;

        const probabilitiesDiv = document.getElementById('probabilities-summary');
        probabilitiesDiv.innerHTML = `
            <p>Total Cases: ${totalCases}</p>
            <p>Approved Cases: ${approvedCases} (${(approvedCases / totalCases * 100).toFixed(2)}%)</p>
            <p>Rejected Cases: ${rejectedCases} (${(rejectedCases / totalCases * 100).toFixed(2)}%)</p>
        `;
    });
