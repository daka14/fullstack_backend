const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req, res) => { 
    if(req.method==='POST') 
        {return JSON.stringify(req.body)}})
    
app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res),
    ].join(' ')
  }))
let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
        id: "2",
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: "3",
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: "4",
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]
const now = new Date()
console.log(now.toString())

app.get('/info', (request, response) => {
    response.send(
        
            `<div>
            <p>
            Phonebook has info for ${persons.length} persons
            </p>
            <p>
            ${now.toString()}
            </p>
            </div>`
       
            )
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)    
  if (person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
  })
  const generateId = () => {
    const maxId = 10000
    return Math.floor(Math.random() * maxId)
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body

    
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    if (persons.filter(person => person.name === body.name).length >0){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId().toString(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })



const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})