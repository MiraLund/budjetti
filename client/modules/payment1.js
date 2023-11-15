async function addPayment() {
    const descriptionValue = document.getElementById('paymentDescription').value;
    const amountValue = document.getElementById('paymentAmount').value;
    const categoryValue = document.getElementById('paymentCategory').value;
    const dateValue = document.getElementById('paymentDate').value;
  
    try {
      const response = await fetch('http://localhost:5500/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: descriptionValue,
          amount: amountValue,
          category: categoryValue,
          date: dateValue
        })
      });
  
      if (!response.ok) {
        throw new Error('Maksun lisääminen epäonnistui');
      }
  
      loadPayments();
      clearPaymentFields();
    } catch (error) {
      console.error('Virhe lisättäessä maksua:', error);
    }
  }
  
  async function loadPayments() {
    try {
      const response = await fetch('http://localhost:5500/payments');
      const payments = await response.json();
      showPayments(payments);
    } catch (error) {
      console.error('Virhe ladattaessa maksuja:', error);
    }
  }
  
  function showPayments(payments) {
    const paymentList = document.getElementById('paymentList');
    paymentList.innerHTML = '';
  
    payments.forEach(payment => {
      const li = document.createElement('li');
      li.textContent = `Kuvaus: ${payment.description} | Määrä: ${payment.amount} | Kategoria: ${payment.category} | Päivämäärä: ${payment.date}`;
      paymentList.appendChild(li);
    });
  }
  
  function clearPaymentFields() {
    document.getElementById('paymentDescription').value = '';
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentCategory').value = '';
    document.getElementById('paymentDate').value = '';
  }

