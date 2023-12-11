const express = require('express')
const asyncErrors = require('express-async-errors')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 10000 //process.env.POR määrittää portin automaattisesti

app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

app.use(express.json())

// Tietokannan yhdistäminen 
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://Mira:Pippuri2@democluster.cabsksr.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log("Database test connected")
})

// Lisätään schema ja model tuloille 
const incomeSchema = new mongoose.Schema({
  income: Number,
  category: String,
  netIncome: Number,
  taxRate: Number,
  date: Date
})

const Income = mongoose.model('Income', incomeSchema)

// Lisätään schema ja model maksuille 
const paymentSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  category: String,
  date: Date
})

const Payment = mongoose.model('Payment', paymentSchema)

// Tulojen reitit

// Lisätään tulo
app.post('/incomes', async (request, response) => {
  try {
    console.log('Handling income POST request...')

    const { income, netIncome, taxRate, category, date } = request.body
    console.log('Request Body:', request.body)

    console.log('Values:', income, netIncome, taxRate, category, date)
    const newIncome = new Income({ income, netIncome, taxRate, category, date })
    const savedIncome = await newIncome.save()
    console.log('Saved Income:', savedIncome)

    response.json(savedIncome)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Haetaan kaikki tulot
app.get('/incomes',  async (request, response) => {
  try {
    const incomes = await Income.find({})
    response.json(incomes)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Haetaan tuloja hakuehdoilla
app.get('/incomes/search', async (request, response) => {
  try {
    console.log('Handling income search request...')
    response.setHeader('Cache-Control', 'no-store')

    // Haetaan hakuehdoista vuosi, kuukausi ja kategoria
    const year = request.query.year
    const month = request.query.month
    const category = request.query.category

    // Jos vuosi on annettu, lisätään hakuehtoihin
    const searchConditions = {}
    if (year) {
      searchConditions.year = year
    }
    // Jos kuukausi on annettu asetetaan hakuehdoksi kuukauden ensimmäinen ja viimeinen päivä
    if (month) {
      const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
      const endDate = moment(startDate).endOf('month')

      // Hakuehtoihin lisätään päivämäärä
      searchConditions.date = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }
    // Jos kategoria on annettu lisätään hakuehtoihin
    if (category) {
      searchConditions.category = category
    }
    // Haetaan tulot
    const incomes = await Income.find(searchConditions)
    response.json(incomes)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// Päivitetään tulo
app.put('/incomes/:id', async (request, response) => {
  console.log('Handling income PUT request...')
  try {
    const incomeId = request.params.id
    const incomeBody = request.body

    console.log('Updating income with ID:', incomeId)
    console.log('Received data:', incomeBody)

    // Haetaan tulo tietokannasta ja päivitetään se
    const income = await Income.findOneAndUpdate(
      { _id: incomeId },
      incomeBody,
      { new: true, useFindAndModify: false }
    )

    // Jos tulo löytyy, palautetaan se
    if (income) {
      console.log('Updated income:', income)
      response.json(income)
    } else {
      console.log('Income not found')
      response.status(404).json({ error: 'Income not found' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// Poistetaan tulo
app.delete('/incomes/:id', async (request, response) => {
  try {
    // Haetaan tulo tietokannasta ja poistetaan se
    const deletedIncome = await Income.findByIdAndDelete(request.params.id)
    if (deletedIncome) {
      // Jos tulo löytyy, palautetaan se poistoa varten
      console.log('Deleted income:', deletedIncome)
      response.json(deletedIncome)
    } else {
      response.status(404).json({ error: 'Income not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
});


// Maksujen reitit

// Lisätään maksu
app.post('/payments', async (request, response) => {
  try {
    const { amount, description, category, date } = request.body
    const newPayment = new Payment({ amount, description, category, date })
    const savedPayment = await newPayment.save()
    response.json(savedPayment)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Haetaan kaikki maksut
app.get('/payments',  async (request, response) => {
  try {
    const payments = await Payment.find({})
    response.json(payments)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Haetaan maksut hakuehtojen perusteella
app.get('/payments/search', async (request, response) => {
  try {
    console.log('Handling income search request...')
    response.setHeader('Cache-Control', 'no-store')

    // Haetaan hakuehdoista vuosi, kuukausi ja kategoria
    const year = request.query.year
    const month = request.query.month
    const category = request.query.category

    // Jos vuosi on annettu, lisätään hakuehtoihin
    const searchConditions = {}
    if (year) {
      searchConditions.year = year
    }
    // Jos kuukausi on annettu asetetaan hakuehdoksi kuukauden ensimmäinen ja viimeinen päivä
    if (month) {
      const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
      const endDate = moment(startDate).endOf('month')

      // Hakuehtoihin lisätään päivämäärä
      searchConditions.date = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }
    // Jos kategoria on annettu lisätään hakuehtoihin
    if (category) {
      searchConditions.category = category
    }

    // Haetaan maksut
    const payments = await Payment.find(searchConditions)
    response.json(payments)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// Päivitetään maksu
app.put('/payments/:id', async (request, response) => {
  console.log('Handling payment PUT request...');
  try {
    const paymentId = request.params.id
    const paymentBody = request.body

    console.log('Updating payment with ID:', paymentId)
    console.log('Received data:', paymentBody)

    // Haetaan maksu tietokannasta ja päivitetään se
    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId },
      paymentBody,
      { new: true, useFindAndModify: false }
    );

    console.log('Updated payment:', payment)
    
    // Jos maksu löytyy, palautetaan se
    if (payment) {
      response.json(payment)
    } else {
      console.log('Payment not found')
      response.status(404).json({ error: 'Payment not found' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// Poistetaan maksu
app.delete('/payments/:id', async (request, response) => {
  try {
    // Haetaan maksu tietokannasta ja poistetaan se
    const deletedPayment = await Payment.findByIdAndDelete(request.params.id)
    if (deletedPayment) {
      // Jos maksu löytyy, palautetaan se poistoa varten
      response.json(deletedPayment)
    } else {
      response.status(404).json({ error: 'Payment not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Kuunnellaan porttia 10000
app.listen(port, () => {
  console.log('Example app listening on port 10000')
})
