//DEPENDENCIES
const { Op } = require('sequelize')
const stages = require ('express').Router()
const db = require('../models')

const { Stage, Event } = db

//INDEX ROUTE
stages.get('/', async (req, res) => {
    try {
        const foundStages = await Stage.findAll({
            order:[['start_time', 'ASC']],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
})

//SHOW ROUTE
stages.get('/:id', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: {stage_name: req.params.name},
            include:{ 
                model: Event, 
                as: "events",
            }
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
})

//CREATE ROUTE
stages.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body) 
        res.status(200).json({
            message: "Successfully inserted a new Stage",
            data: newStage
        })

    } catch (error){
        res.status(500).json(error)
    }
})

//UPDATE ROUTE
stages.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
            res.status(200).json({
                message: `Successfully updated ${updatedStages} Stage(s)`,
            })
    } catch (error){
        res.status(500).json(error)
    }
})

//DELETE ROUTE
stages.delete('/:id', async (req, res) => {
    try {
        const deletedStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
            res.status(200).json({
                message: `Successfully deleted ${deletedStages} Stage(s)`,
            })
    } catch (error){
        res.status(500).json(error)
    } 
})


//EXPORT
module.exports = stages