// ====== Seleção dos elementos ======
const form = document.getElementById('cadastroForm');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const ufInput = document.getElementById('uf');
const numeroInput = document.getElementById('numero');
const loading = document.getElementById('loading');
const successMessage = document.getElementById('successMessage');

// ====== Esconde mensagens ao carregar a página ======
loading.style.display = 'none';
successMessage.style.display = 'none';

// ====== Máscara e limpeza do CEP ======
cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = valor;
});

// ====== Função de buscar endereço (chamada no onblur do input) ======
async function buscarEndereco() {
    const cep = cepInput.value.replace(/\D/g, ''); // só números

    // Valida se o CEP tem 8 dígitos
    if (cep.length !== 8) {
        if (cep.length > 0) {
            alert('CEP inválido. Digite 8 números.');
        }
        limparCamposEndereco();
        return;
    }

    // Mostra o "loading" e limpa os campos
    loading.style.display = 'block';
    limparCamposEndereco();

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        // ViaCEP retorna { erro: true } quando o CEP não existe
        if (data.erro) {
            alert('CEP não encontrado. Verifique e tente novamente.');
            limparCamposEndereco();
            return;
        }

        // Preenche os campos com os dados retornados
        logradouroInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        ufInput.value = data.uf || '';

        // Foca no campo número, já que o usuário precisa preencher
        numeroInput.focus();

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar o CEP. Verifique sua conexão e tente novamente.');
        limparCamposEndereco();
    } finally {
        // Esconde o "loading" independente de sucesso ou erro
        loading.style.display = 'none';
    }
}

// ====== Limpa os campos de endereço ======
function limparCamposEndereco() {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    ufInput.value = '';
}

// ====== Envio do formulário ======
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação simples
    if (
        !cepInput.value.trim() ||
        !logradouroInput.value.trim() ||
        !bairroInput.value.trim() ||
        !cidadeInput.value.trim() ||
        !ufInput.value.trim() ||
        !numeroInput.value.trim()
    ) {
        alert('Por favor, preencha todos os campos antes de salvar.');
        return;
    }

    // Monta o objeto com os dados do cliente
    const cliente = {
        cep: cepInput.value.trim(),
        logradouro: logradouroInput.value.trim(),
        bairro: bairroInput.value.trim(),
        cidade: cidadeInput.value.trim(),
        uf: ufInput.value.trim(),
        numero: numeroInput.value.trim()
    };

    console.log('Cliente cadastrado:', cliente);

    // Aqui você pode enviar para uma API, salvar no localStorage, etc.
    // Exemplo com localStorage:
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    clientes.push(cliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Mostra mensagem de sucesso
    successMessage.style.display = 'block';
    successMessage.textContent = 'Cadastro realizado com sucesso!';

    // Reseta o formulário após 2 segundos
    setTimeout(() => {
        form.reset();
        successMessage.style.display = 'none';
    }, 2000);
});
