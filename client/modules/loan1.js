async function addLoan() {
    const descriptionValue = document.getElementById('loanDescription').value;
    const totalAmountValue = document.getElementById('loanTotalAmount').value;
    const monthlyPaymentValue = document.getElementById('monthlyPayment').value;
    const categoryValue = document.getElementById('loanCategory').value;
  
    try {
      const response = await fetch('http://localhost:5500/loans/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: descriptionValue,
          totalAmount: totalAmountValue,
          monthlyPayment: monthlyPaymentValue,
          category: categoryValue,
        })
      });
  
      if (!response.ok) {
        throw new Error('Lainan lisääminen epäonnistui');
      }
  
      loadLoans();
      clearLoanFields();
    } catch (error) {
      console.error('Virhe lisättäessä lainaa:', error);
    }
  }
  
  async function loadLoans() {
    try {
      const response = await fetch('http://localhost:5500/loans/get');
      const loans = await response.json();
      showLoans(loans);
    } catch (error) {
      console.error('Virhe ladattaessa lainoja:', error);
    }
  }
  
  function showLoans(loans) {
    const loanList = document.getElementById('loanList');
    loanList.innerHTML = '';
  
    loans.forEach(loan => {
      const li = document.createElement('li');
      li.textContent = `Kuvaus: ${loan.description} | Kokonaismäärä: ${loan.totalAmount} | Kuukausierä: ${loan.monthlyPayment} | Kategoria: ${loan.category}`;
      loanList.appendChild(li);
    });
  }
  
  function clearLoanFields() {
    document.getElementById('loanDescription').value = '';
    document.getElementById('loanTotalAmount').value = '';
    document.getElementById('monthlyPayment').value = '';
    document.getElementById('loanCategory').value = '';
  }

  export { addLoan, loadLoans, showLoans, clearLoanFields }