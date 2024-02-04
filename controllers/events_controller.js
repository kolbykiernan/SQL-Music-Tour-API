//DEPENDENCIES
const { Op } = require('sequelize')
const events = require ('express').Router()
const db = require('../models')

const { Event, MeetGreet, SetTime, Stage, Band } = db

//INDEX ROUTE
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order:[['start_time', 'ASC']],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
})

//SHOW ROUTE
events.get('/:id', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: {name: req.params.name},
            include: [
                { 
                model: MeetGreet, 
                as: "meet_greets", 
                include: {
                        model: Band, 
                        as: "bands", 
                    } 
                },
                { 
                model: SetTime, 
                as: "set_times",
                include: [
                        { 
                        model: Band,
                        as: "bands" 
                        },
                        { 
                        model: Stage,
                        as: "stages" 
                        }
                    ]
                },
                { 
                model: Stage, 
                as: "stages",
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
})

//CREATE ROUTE
events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body) 
        res.status(200).json({
            message: "Successfully inserted a new Event",
            data: newEvent
        })

    } catch (error){
        res.status(500).json(error)
    }
})

//UPDATE ROUTE
events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = await Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
            res.status(200).json({
                message: `Successfully updated ${updatedEvents} Event(s)`,
            })
    } catch (error){
        res.status(500).json(error)
    }
})

//DELETE ROUTE
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = await Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
            res.status(200).json({
                message: `Successfully deleted ${deletedEvents} Event(s)`,
            })
    } catch (error){
        res.status(500).json(error)
    } 
})


//EXPORT
module.exports = events