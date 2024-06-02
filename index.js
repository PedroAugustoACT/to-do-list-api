const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/config.json').development;
const TarefaModel = require('./models/tarefa');

const sequelize = new Sequelize(dbConfig);
const Tarefa = TarefaModel(sequelize, Sequelize.DataTypes);

const app = express();
app.use(cors());
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.get('/tarefas', async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll();
        res.json(tarefas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/tarefas/:id', async (req, res) => {
    try {
        const tarefa = await Tarefa.findByPk(req.params.id);
        if (tarefa) {
            res.json(tarefa);
        } else {
            res.status(404).send('Tarefa não encontrada');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/tarefas', async (req, res) => {
    try {
        const { nome, descricao, status } = req.body;
        const tarefa = await Tarefa.create({ nome, descricao, status, data_criacao: new Date() });
        res.json(tarefa);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/tarefas/:id', async (req, res) => {
    try {
        const { nome, descricao, status } = req.body;
        const tarefa = await Tarefa.findByPk(req.params.id);
        if (tarefa) {
            await tarefa.update({ nome, descricao, status });
            res.json(tarefa);
        } else {
            res.status(404).send('Tarefa não encontrada');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/tarefas/:id', async (req, res) => {
    try {
        const tarefa = await Tarefa.findByPk(req.params.id);
        if (tarefa) {
            await tarefa.destroy();
            res.status(204).send();
        } else {
            res.status(404).send('Tarefa não encontrada');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/tarefas/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const tarefas = await Tarefa.findAll({
            where: { status: status }
        });
        res.json(tarefas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
