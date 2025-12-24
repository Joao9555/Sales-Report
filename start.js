const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Verificar se db.json existe
const dbPath = path.join(__dirname, 'db.json');

if (!fs.existsSync(dbPath)) {
  console.log('⚠️ db.json não encontrado! Criando arquivo...');
  fs.writeFileSync(dbPath, JSON.stringify({ vendas: [] }, null, 2));
  console.log('✅ db.json criado com sucesso!');
}

// 2. Iniciar JSON Server
console.log('🚀 Iniciando JSON Server...');

const jsonServer = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '3000'], {
  shell: true,
  stdio: 'inherit'
});

jsonServer.on('error', (error) => {
  console.error('❌ Erro ao iniciar JSON Server:', error);
});

jsonServer.on('close', (code) => {
  console.log(`⚠️ JSON Server encerrado com código ${code}`);
});

// 3. Iniciar sistema de backup (opcional)
require('./backup.js');

console.log('\n✅ Sistema iniciado!');
console.log('📍 Acesse: http://localhost:3000/vendas');
console.log('\n⚠️ IMPORTANTE: Não feche esta janela!\n');