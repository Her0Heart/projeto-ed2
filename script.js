import API_TOKEN from './secrets.js';

// 1. Capturando os elementos HTML usando seus IDs
const campoInput = document.getElementById('character-input');
const botaoBuscar = document.getElementById('search-btn');
const secaoResultados = document.getElementById('results-section');

// 2. Configurações da SuperHero API
const ACCESS_TOKEN = API_TOKEN;

// 3. Função principal que busca os dados
function buscarPersonagem() {
    const nomePersonagem = campoInput.value.trim();

    if (nomePersonagem === '') {
        alert('Por favor, digite o nome de um personagem!');
        return;
    }

    secaoResultados.innerHTML = '<p>Acessando o banco de dados dos heróis...</p>';

    // Usando proxy para evitar erros de CORS (muito comum em localhost)
    const urlDaApi = `https://corsproxy.io/?https://superheroapi.com/api.php/${ACCESS_TOKEN}/search/${nomePersonagem}`;

    fetch(urlDaApi)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {
            secaoResultados.innerHTML = '';

            if (dados.response === 'error') {
                secaoResultados.innerHTML = `<p>Nenhum personagem encontrado com o nome "${nomePersonagem}".</p>`;
                return;
            }

            const personagem = dados.results[0];
            const urlImagem = personagem.image.url;
            
            const nomeCompleto = personagem.biography['full-name'] || 'Identidade secreta desconhecida';
            const editora = personagem.biography.publisher || 'Editora independente';
            
            const descricao = `
                <strong>Identidade Real:</strong> ${nomeCompleto} <br>
                <strong>Editora:</strong> ${editora} <br>
                <strong>Inteligência:</strong> ${personagem.powerstats.intelligence} | 
                <strong>Força:</strong> ${personagem.powerstats.strength}
            `;

            const cartaoHTML = `
                <article class="glass-effect">
                    <img src="${urlImagem}" alt="Imagem do ${personagem.name}">
                    <h2>${personagem.name}</h2>
                    <p>${descricao}</p>
                </article>
            `;

            secaoResultados.innerHTML = cartaoHTML;
        })
        .catch(function(erro) {
            console.error('Erro na requisição:', erro);
            secaoResultados.innerHTML = '<p>Ocorreu um erro ao buscar os dados. Verifique seu token no código.</p>';
        });
}

// 4. Capturando eventos de interação
botaoBuscar.addEventListener('click', buscarPersonagem);

campoInput.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        buscarPersonagem();
    }
});