# 📋 Cadastro de Cliente com Busca de CEP

Formulário de cadastro de cliente com **preenchimento automático de endereço** a partir do CEP, utilizando a API pública [ViaCEP](https://viacep.com.br/).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📖 Sobre o Projeto

Este projeto foi desenvolvido como prática de **consumo de API REST**, **manipulação de DOM** e **validação de formulários** em JavaScript puro, sem uso de frameworks.

Ao digitar um CEP válido, o sistema consulta automaticamente a API do **ViaCEP** e preenche os campos de endereço, deixando apenas o número para o usuário informar.

---

## 📁 Estrutura do Projeto

```
cadastro-cliente/
├── index.html      → Estrutura do formulário
├── style.css       → Estilização visual
├── script.js       → Lógica e consumo da API
└── README.md       → Documentação
```

---

## 🚀 Funcionalidades

- ✅ Máscara automática no campo CEP (`00000-000`)
- ✅ Busca automática do endereço ao sair do campo CEP
- ✅ Preenchimento dos campos: **Logradouro, Bairro, Cidade e UF**
- ✅ Indicador visual de carregamento (*loading*)
- ✅ Tratamento de erros (CEP inválido, não encontrado, falha de conexão)
- ✅ Validação antes de salvar
- ✅ Salvamento no `localStorage`
- ✅ Mensagem de sucesso animada
- ✅ Layout responsivo

---

## 🖥️ Demonstração

> Ao digitar o CEP `20040-020`, o formulário é preenchido automaticamente com:
>
> - **Logradouro:** Rua da Assembleia
> - **Bairro:** Centro
> - **Cidade:** Rio de Janeiro
> - **UF:** RJ

---

## 🎨 Explicação do CSS (`style.css`)

### 1. Reset básico
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```
Remove margens e paddings padrão do navegador e define uma fonte única para todo o projeto.

### 2. Fundo da página
```css
body {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
```
- Usa **Flexbox** para centralizar o formulário na tela.
- `min-height: 100vh` garante que o fundo ocupe a tela inteira.
- `linear-gradient` cria o degradê azul de fundo.

### 3. Formulário (card branco)
```css
form {
    background: #fff;
    padding: 30px 35px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    max-width: 480px;
}
```
- `border-radius` arredonda os cantos.
- `box-shadow` cria profundidade (efeito de card flutuante).
- `max-width` limita a largura em telas grandes.

### 4. Inputs e foco
```css
input:focus {
    border-color: #2a5298;
    box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.15);
}
```
Destaca o campo ativo com borda azul e um "halo" suave ao redor.

### 5. Campos somente leitura
```css
input[readonly] {
    background-color: #f5f7fa;
    color: #555;
    cursor: not-allowed;
}
```
Diferencia visualmente os campos preenchidos automaticamente pelo ViaCEP.

### 6. Botão com hover
```css
button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(30, 60, 114, 0.4);
}
```
Efeito de **elevação** ao passar o mouse, dando sensação de interatividade.

### 7. Loading animado
```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```
Animação de **pulsar** (aparece/some) enquanto o CEP está sendo buscado.

### 8. Mensagem de sucesso
```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
```
Faz a mensagem surgir suavemente de cima para baixo.

### 9. Responsividade
```css
@media (max-width: 500px) {
    form { padding: 20px; }
    h1 { font-size: 22px; }
}
```
Ajusta padding e tamanhos de fonte para **celulares**.

---

## ⚙️ Explicação do JavaScript (`script.js`)

### 1. Seleção de elementos
```javascript
const form = document.getElementById('cadastroForm');
const cepInput = document.getElementById('cep');
const loading = document.getElementById('loading');
```
Guarda referências aos elementos do HTML para manipulá-los depois.

### 2. Esconde mensagens ao carregar
```javascript
loading.style.display = 'none';
successMessage.style.display = 'none';
```
Garante que o *loading* e a mensagem de sucesso comecem ocultos.

### 3. Máscara do CEP
```javascript
cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = valor;
});
```
- Remove tudo que não é número (com `\D`).
- Insere o hífen automaticamente após o 5º dígito.

### 4. Função `buscarEndereco()`
```javascript
async function buscarEndereco() {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido. Digite 8 números.');
        return;
    }
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
}
```
- **`async/await`**: espera a resposta da API sem travar a página.
- **`fetch`**: faz a requisição HTTP ao ViaCEP.
- **`.json()`**: converte a resposta em objeto JavaScript.
- Se `data.erro` for `true`, o CEP não existe.

### 5. Preenchimento dos campos
```javascript
logradouroInput.value = data.logradouro || '';
bairroInput.value = data.bairro || '';
cidadeInput.value = data.localidade || '';
ufInput.value = data.uf || '';
```
O operador `|| ''` evita que apareça `undefined` caso o campo venha vazio.

### 6. Tratamento de erros
```javascript
try {
    // requisição
} catch (error) {
    alert('Erro ao buscar o CEP...');
} finally {
    loading.style.display = 'none';
}
```
- `try`: tenta executar.
- `catch`: captura falhas (ex: sem internet).
- `finally`: sempre executa (esconde o *loading*).

### 7. Envio do formulário
```javascript
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // validação
    // salvar no localStorage
    // mostrar mensagem
});
```
- **`e.preventDefault()`**: impede o recarregamento da página.
- Valida se todos os campos estão preenchidos.
- Salva os dados no `localStorage`.

### 8. Salvamento no localStorage
```javascript
const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
clientes.push(cliente);
localStorage.setItem('clientes', JSON.stringify(clientes));
```
- `localStorage` armazena dados no navegador (não expira).
- `JSON.parse` / `JSON.stringify` convertem entre objeto e texto.

### 9. Reset automático
```javascript
setTimeout(() => {
    form.reset();
    successMessage.style.display = 'none';
}, 2000);
```
Após 2 segundos, limpa o formulário e esconde a mensagem.

---

## 🌐 API ViaCEP

**Endpoint:**
```
https://viacep.com.br/ws/{CEP}/json/
```

**Exemplo de resposta (CEP 20040-020):**
```json
{
  "cep": "20040-020",
  "logradouro": "Rua da Assembleia",
  "bairro": "Centro",
  "localidade": "Rio de Janeiro",
  "uf": "RJ"
}
```

**Resposta quando o CEP não existe:**
```json
{ "erro": true }
```

---

## ▶️ Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/cadastro-cliente.git
   ```
2. Abra a pasta no VS Code.
3. Abra o `index.html` no navegador (ou use a extensão *Live Server*).
4. Digite um CEP válido, como `20040-020`, e veja o endereço ser preenchido.

---

## 🧠 Conceitos Aplicados

| Área | Conceito |
|------|----------|
| HTML | Formulário, inputs, labels, `readonly` |
| CSS  | Flexbox, gradiente, animações, responsividade |
| JS   | DOM, eventos, `fetch`, `async/await`, `try/catch`, `localStorage` |
| API  | Consumo REST (ViaCEP) |
| Git  | Versionamento e documentação |

---

## 🔮 Melhorias Futuras

- [ ] Integração com banco de dados real (MySQL/PostgreSQL)
- [ ] Back-end com Node.js + Express
- [ ] Validação visual (borda vermelha em campos inválidos)
- [ ] Dark mode
- [ ] Cadastro de múltiplos clientes com listagem
- [ ] Exportação para PDF/Excel

---

## 👨‍💻 Autor

**Jefferson Honorio da Silva**  
Turma Técnica de Desenvolvimento de Sistemas — Firjan SENAI/SESI Maracanã  
Nº `00412025.2054-1`

---

## 📄 Licença

Este projeto é de **uso educacional**. Sinta-se à vontade para estudar, modificar e reutilizar o código.
