async function addIncome() {
    const incomeValue = document.getElementById('income').value.trim();
    const taxRateValue = document.getElementById('taxRate').value.trim();
    const dateValue = document.getElementById('incomeDate').value.trim();
    const netIncomeInput = document.getElementById('netIncome');

    try {
        // Lisätään tarkistus, että syötteet eivät ole tyhjiä
        if (incomeValue === '' || taxRateValue === '' || dateValue === '') {
            throw new Error('Täytä kaikki tulojen lisäykseen tarvittavat kentät.');
        }

        const netIncome = calculateNetIncome(incomeValue, taxRateValue);
        netIncomeInput.value = netIncome;

        console.log('Lähetetään POST-pyyntö:');
        console.log('URL: http://localhost:5500/incomes');
        console.log('Body:', JSON.stringify({
            income: incomeValue,
            netIncome: netIncome,
            taxRate: taxRateValue,
            date: dateValue
        }));

        const response = await fetch('http://localhost:5500/incomes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                income: incomeValue,
                netIncome: netIncome,
                taxRate: taxRateValue,
                date: dateValue
            })
        });

        console.log('Vastaus saatu:', response);

        if (!response.ok) {
            throw new Error('Tulojen lisääminen epäonnistui');
        }

        loadIncomes();
        clearIncomeFields();
    } catch (error) {
        console.error('Virhe lisättäessä tuloa:', error.message);
    }
}


function calculateNetIncome(income, taxRate) {
    console.log('Calculating net income:', income, taxRate);
    const netIncome = (income - (income * taxRate / 100)).toFixed(2);
    console.log('Net income:', netIncome);
    return netIncome;
}

async function loadIncomes() {
    try {
        const response = await fetch('http://localhost:5500/incomes');
        const incomes = await response.json();
        showIncomes(incomes);
        
        // Nollaa netIncomeInput arvo
        const netIncomeInput = document.getElementById('netIncome');
        netIncomeInput.value = '';
    } catch (error) {
        console.error('Virhe ladattaessa tuloja:', error);
    }
}
  
  function showIncomes(incomes) {
    const incomeList = document.getElementById('incomeList');
    const netIncomeInput = document.getElementById('netIncome');
    incomeList.innerHTML = '';
  
    if (incomes && incomes.length > 0) {
      incomes.forEach(income => {
        const li = document.createElement('li');
        li.textContent = `Tulo: ${income.income} | Nettotulo: ${income.netIncome} | Veroprosentti: ${income.taxRate} | Päivämäärä: ${income.date}`;
        incomeList.appendChild(li);
  
        netIncomeInput.value = income.netIncome;
      });
    } else {
      netIncomeInput.value = ''; // Tyhjennä netIncomeInput, jos tietueita ei ole
    }
  }
  
  function clearIncomeFields() {
    document.getElementById('income').value = '';
    document.getElementById('netIncome').value = '';
    document.getElementById('taxRate').value = '';
    document.getElementById('incomeDate').value = '';
  }

