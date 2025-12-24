const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURAÇÕES
app.use(express.json());
app.use(cors()); // Libera para todas as origens (Hostinger inclusa)

const DATABASE_FILE = path.join(__dirname, 'vendas.json');

// FUNÇÃO: LER DADOS (Garante que sempre retorna um array)
function lerDados() {
  try {
    if (!fs.existsSync(DATABASE_FILE)) {
      fs.writeFileSync(DATABASE_FILE, '[]', 'utf-8');
      return [];
    }
    const dados = fs.readFileSync(DATABASE_FILE, 'utf-8');
    return JSON.parse(dados || '[]');
  } catch (error) {
    console.error("Erro ao ler arquivo:", error);
    return [];
  }
}

// FUNÇÃO: SALVAR DADOS
function salvarDados(dados) {
  try {
    const json = JSON.stringify(dados, null, 2);
    fs.writeFileSync(DATABASE_FILE, json, 'utf-8');
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
  }
}

// ROTA GET: BUSCAR VENDAS
app.get('/vendas', (req, res) => {
  const vendas = lerDados();
  res.json(vendas);
});

// ROTA POST: CRIAR VENDA (Ajustada para ser mais robusta)
app.post('/vendas', (req, res) => {
  const novaVenda = req.body;

  if (!novaVenda || Object.keys(novaVenda).length === 0) {
    return res.status(400).json({ erro: "Dados da venda não enviados" });
  }

  const vendas = lerDados();
  novaVenda.id = Date.now();
  vendas.push(novaVenda);
  
  salvarDados(vendas);
  
  res.status(201).json(novaVenda);
  console.log('✅ Venda criada com sucesso');
});

// ROTAS PUT E DELETE (Mantidas como no seu original, estão corretas)
app.put('/vendas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dadosAtualizados = req.body;
  let vendas = lerDados();
  const index = vendas.findIndex(v => v.id === id);

  if (index !== -1) {
    vendas[index] = { ...vendas[index], ...dadosAtualizados };
    salvarDados(vendas);
    res.json(vendas[index]);
  } else {
    res.status(404).json({ erro: 'Venda não encontrada' });
  }
});

app.delete('/vendas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let vendas = lerDados();
  vendas = vendas.filter(v => v.id !== id);
  salvarDados(vendas);
  res.json({ mensagem: 'Venda deletada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
