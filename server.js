require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 8080; // Usando a variável de ambiente para a porta
const app = express();

app.use(express.json());
app.use(cors());

// Verificar se a variável de ambiente está definida
if (!process.env.MONGO_URI) {
    console.error("Erro: a variável MONGO_URI não está definida no arquivo .env.");
    process.exit(1);
}

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Definição dos modelos
const Aluno = mongoose.model('Aluno', {
    nome: { type: String, required: true },
    turma: { type: String },
});

const Desafio = mongoose.model('Desafio', {
    nome: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: Number, default: 1 },
});

const Equipe = mongoose.model('Equipe', {
    nome: { type: String, required: true },
    membros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aluno' }],
});

// Rota de teste
// GET
app.get('/', (req, res) => {
    res.send('Servidor rodando e conectado ao MongoDB!');
});

app.get('/api/equipes', async (req, res) => {
    try {
        const equipes = await Equipe.find().populate('membros'); // Popula o campo membros com dados dos Alunos
        res.status(200).json(equipes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as equipes', details: error.message });
    }
});
app.get('/api/equipes/:id', async (req, res) => {
    try {
        const equipe = await Equipe.findById(req.params.id).populate('membros'); // Popula o campo membros com dados dos Alunos
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada' });
        }
        res.status(200).json(equipe);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a equipe', details: error.message });
    }
});
app.get('/api/alunos', async (req, res) => {
    try {
        const alunos = await Aluno.find();
        res.status(200).json(alunos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os alunos', details: error.message });
    }
});
app.get('/api/alunos/:id', async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        res.status(200).json(aluno);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o aluno', details: error.message });
    }
});


//POST
app.post('/api/alunos', async (req, res) => {
    try {
        const alunos = req.body;

        // Verificar se é um array
        if (!Array.isArray(alunos)) {
            return res.status(400).json({ error: 'O corpo da requisição deve ser um array de alunos.' });
        }

        // Validar se cada aluno tem um nome
        for (let aluno of alunos) {
            if (!aluno.nome) {
                return res.status(400).json({ error: `O campo nome é obrigatório para todos os alunos. Erro no aluno: ${JSON.stringify(aluno)}` });
            }
        }

        // Criar novas instâncias de Aluno e salvar no banco
        const novosAlunos = await Aluno.insertMany(alunos);

        // Retornar os alunos criados
        res.status(201).json(novosAlunos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar os alunos', details: error.message });
    }
});

app.post('/api/equipes', async (req, res) => {
    try {
        const { nome, membros } = req.body;

        // Verificação se o nome da equipe está presente
        if (!nome) {
            return res.status(400).json({ error: 'O campo nome da equipe é obrigatório.' });
        }

        // Verificação se os membros são fornecidos e se são um array
        if (!Array.isArray(membros) || membros.length === 0) {
            return res.status(400).json({ error: 'A equipe deve ter pelo menos um membro.' });
        }

        // Verificação se todos os membros passados têm IDs válidos
        const alunosExistem = await Aluno.find({ _id: { $in: membros } });

        if (alunosExistem.length !== membros.length) {
            return res.status(400).json({ error: 'Um ou mais IDs de alunos são inválidos.' });
        }

        // Criar uma nova instância de Equipe com os IDs dos alunos
        const novaEquipe = new Equipe({ nome, membros });

        // Salvar no banco de dados
        await novaEquipe.save();

        // Retornar a equipe criada
        res.status(201).json(novaEquipe);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar a equipe', details: error.message });
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
