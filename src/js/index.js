document.addEventListener("DOMContentLoaded", function () {
  // Objetivo:
  // Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.
  // Passos:
  // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
  const formulario = document.querySelector(".form-group");
  const descricaoInput = document.getElementById("description");
  const codigoHTML = document.getElementById("html-code");
  const codigoCSS = document.getElementById("css-code");
  const secaoPreview = document.getElementById("preview-section");

  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault(); // evita o recarregamento da página

    // 2. Obter o valor digitado pelo usuário no campo de texto.
    const descricao = descricaoInput.value.trim();

    if (!descricao) {
      return;
    }

    // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
    mostrarCarregamento(true);

    // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
    try {
      const resposta = await fetch(
        "https://gabriel-sralcantara.app.n8n.cloud/webhook/fundo-magico",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descricao }),
        },
      );

      const dados = await resposta.json();

      codigoHTML.textContent = dados.html || "";
      codigoCSS.textContent = dados.css || "";

      secaoPreview.style.display = "block";
      secaoPreview.innerHTML = dados.html || "";

      let tagEstilo = document.getElementById("estilo-dinamico");
      //se essa tag já existe, ela vai ser removida antes de criar uma nova
      if (tagEstilo) {
        tagEstilo.remove();
      }

      if (dados.css) {
        tagEstilo = document.createElement("style");
        tagEstilo.id = "estilo-dinamico";
        tagEstilo.textContent = dados.css;
        document.head.appendChild(tagEstilo);
      }
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      codigoHTML.textContent = "Não conseguimos gerar o HTML, tente novamente.";
      codigoCSS.textContent = "Não conseguimos gerar o CSS, tente novamente.";
      secaoPreview.innerHTML = "";
    } finally {
      mostrarCarregamento(false);
    }
  });

  function mostrarCarregamento(estaCarregando) {
    const botaoEnviar = document.getElementById("generate-btn");
    if (estaCarregando) {
      botaoEnviar.textContent = "Carregando Background...";
    } else {
      botaoEnviar.textContent = "Gerar Background Mágico";
    }
  }

  // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).

  // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
  //    - Mostrar o HTML e CSS gerado em uma área de preview.
  //    - Inserir o CSS retornado dinamicamente na página para aplicar o background.

  // 7. Remover o indicador de carregamento após o recebimento da resposta.;
});
