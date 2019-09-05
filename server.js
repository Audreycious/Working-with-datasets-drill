require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIELIST = require('./movies-data-small')
const cors = require('cors')
const helmet = require('helmet')
const app = express()


const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
        }
    next()
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

function handleGetMovies(req, res) {
    let response = MOVIELIST;
    if (req.query.genre) {
        response = response.filter(movie => (movie.genre.toLowerCase()) === (req.query.genre.toLowerCase()))
    }
    if (req.query.country) {
        response = response.filter(movie => (movie.country.toLowerCase()) === (req.query.country.toLowerCase()))
    }
    if (req.query.avg_vote) {
        response = response.filter(movie => (parseInt(movie.avg_vote)) >= (parseInt(req.query.avg_vote)))
    }

    res.json(response)
}
    
app.get('/movie', handleGetMovies)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  
})