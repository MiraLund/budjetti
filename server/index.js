const express = require('express')
const asyncErrors = require('express-async-errors')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 10000

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

// convert json string to json object (from request)
app.use(express.json())

const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://Mira:Pippuri2@democluster.cabsksr.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log("Database test connected")
})

const incomeSchema = new mongoose.Schema({
  income: Number,
  category: String,
  netIncome: Number,
  taxRate: Number,
  date: Date
})

const Income = mongoose.model('Income', incomeSchema)

const paymentSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: Date
})

const Payment = mongoose.model('Payment', paymentSchema)

const reportSchema = new mongoose.Schema({
  month: String,
  year: Number,
  netIncome: Number,
  totalExpenses: Number,
  savings: Number,
  budgetStatus: String
})

const Report = mongoose.model('Report', reportSchema)

app.get('/', (req, res) => {
  res.send('Tervetuloa budjettisovellukseen!');
})

// Income Routes
app.post('/incomes', async (request, response) => {
  try {
    console.log('Handling income POST request...')

    const { income, category, netIncome, taxRate, date } = request.body
    console.log('Request Body:', request.body)

    console.log('Values:', income, category, netIncome, taxRate, date)
    const newIncome = new Income({ income, category, netIncome, taxRate, date })
    const savedIncome = await newIncome.save()
    console.log('Saved Income:', savedIncome)

    response.json(savedIncome)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/incomes',  async (request, response) => {
  try {
    const incomes = await Income.find({})
    response.json(incomes)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/incomes/:id', async (request, response) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(request.params.id)
    if (deletedIncome) {
      response.json(deletedIncome)
    } else {
      response.status(404).json({ error: 'Income not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// Payment Routes
app.post('/payments', async (request, response) => {
  try {
    const { description, amount, category, date } = request.body
    const newPayment = new Payment({ description, amount, category, date })
    const savedPayment = await newPayment.save()
    response.json(savedPayment)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/payments',  async (request, response) => {
  try {
    const payments = await Payment.find({})
    response.json(payments)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/payments/:id', async (request, response) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(request.params.id)
    if (deletedPayment) {
      response.json(deletedPayment)
    } else {
      response.status(404).json({ error: 'Payment not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

// Report Routes
app.post('/reports', async (request, response) => {
  try {
    const { month, year, netIncome, totalExpenses, savings, budgetStatus } = request.body
    const newReport = new Report({ month, year, netIncome, totalExpenses, savings, budgetStatus })
    const savedReport = await newReport.save()
    response.json(savedReport)
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/reports', async (request, response) => {
  try {
    const reports = await Report.find({})
    response.json(reports)
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/reports/:id', async (request, response) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(request.params.id)
    if (deletedReport) {
      response.json(deletedReport)
    } else {
      response.status(404).json({ error: 'Report not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
});

// app listen port 10000
app.listen(port, () => {
  console.log('Example app listening on port 10000')
})