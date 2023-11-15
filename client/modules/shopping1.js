async function addShopping() {
    const descriptionValue = document.getElementById('shoppingDescription').value;
    const budgetAmountValue = document.getElementById('budjetAmount').value;
    const spentAmountValue = document.getElementById('spentAmount').value;
    const savingsValue = document.getElementById('shoppingSavings').value;
    const dateValue = document.getElementById('shoppingDate').value;
  
    try {
      const response = await fetch('http://localhost:5500/shoppings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: descriptionValue,
          budjetAmount: budgetAmountValue,
          spentAmount: spentAmountValue,
          savings: savingsValue,
          date: dateValue
        })
      });
  
      if (!response.ok) {
        throw new Error('Ostoksen lisääminen epäonnistui');
      }
  
      loadShoppings();
      clearShoppingFields();
    } catch (error) {
      console.error('Virhe lisättäessä ostosta:', error);
    }
  }
  
  async function loadShoppings() {
    try {
      const response = await fetch('http://localhost:5500/shoppings/get');
      const shoppings = await response.json();
      showShoppings(shoppings);
    } catch (error) {
      console.error('Virhe ladattaessa ostoksia:', error);
    }
  }
  
  function showShoppings(shoppings) {
    const shoppingList = document.getElementById('shoppingList');
    shoppingList.innerHTML = '';
  
    shoppings.forEach(shopping => {
      const li = document.createElement('li');
      li.textContent = `Kuvaus: ${shopping.description} | Budjetoitu määrä: ${shopping.budgetAmount} | Käytetty määrä: ${shopping.spentAmount} | Säästöt: ${shopping.savings} | Päivämäärä: ${shopping.date}`;
      shoppingList.appendChild(li);
    });
  }
  
  function clearShoppingFields() {
    document.getElementById('shoppingDescription').value = '';
    document.getElementById('budjetAmount').value = '';
    document.getElementById('spentAmount').value = '';
    document.getElementById('shoppingSavings').value = '';
    document.getElementById('shoppingDate').value = '';
  }
  
  export { addShopping, loadShoppings, showShoppings, clearShoppingFields }