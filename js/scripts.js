/* Igor Pedrosa - Portfólio (CP3)
   Funcionalidades:
   1. Tema claro/escuro (persistido em localStorage)
   2. Formulário com validação, feedback visível e mensagens salvas em localStorage
   3. Desenho em <canvas> da página Gráficos
*/
(function () {
    "use strict";

    var CHAVE_TEMA = "portfolio:tema";
    var CHAVE_MENSAGENS = "portfolio:mensagens";

    /* ---------- localStorage seguro ---------- */
    function ler(chave, padrao) {
        try {
            var bruto = localStorage.getItem(chave);
            return bruto === null ? padrao : JSON.parse(bruto);
        } catch (e) {
            return padrao;
        }
    }

    function gravar(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (e) {
            return false;
        }
    }

    /* ---------- 1. Tema ---------- */
    function aplicarTema(escuro) {
        document.body.classList.toggle("tema-escuro", escuro);
        var botao = document.getElementById("alternar-tema");
        if (botao) {
            botao.textContent = escuro ? "☀ Tema claro" : "🌙 Tema escuro";
            botao.setAttribute("aria-pressed", String(escuro));
        }
    }

    function iniciarTema() {
        var header = document.querySelector("header");
        if (!header) return;

        var acoes = document.createElement("div");
        acoes.className = "topo-acoes";
        var botao = document.createElement("button");
        botao.type = "button";
        botao.id = "alternar-tema";
        acoes.appendChild(botao);
        header.insertBefore(acoes, header.firstChild);

        var salvo = ler(CHAVE_TEMA, null);
        var escuro = salvo !== null
            ? salvo === "escuro"
            : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        aplicarTema(escuro);

        botao.addEventListener("click", function () {
            var agora = !document.body.classList.contains("tema-escuro");
            aplicarTema(agora);
            gravar(CHAVE_TEMA, agora ? "escuro" : "claro");
        });
    }

    /* ---------- 2. Formulário ---------- */
    var NOMES_CATEGORIA = { duvida: "Dúvida", projeto: "Projeto", outro: "Outro" };
    var NOMES_TIPO = { academico: "Acadêmico", profissional: "Profissional", outro: "Outro" };
    var LIMITE_MENSAGEM = 500;

    var regras = {
        nome: function (f) {
            var v = f.nome.value.trim();
            if (!v) return "Informe seu nome.";
            if (v.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
            return "";
        },
        email: function (f) {
            var v = f.email.value.trim();
            if (!v) return "Informe seu e-mail.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Digite um e-mail válido, como nome@exemplo.com.";
            return "";
        },
        telefone: function (f) {
            var v = f.telefone.value.trim();
            if (!v) return "";
            var digitos = v.replace(/\D/g, "");
            if (digitos.length < 10 || digitos.length > 11) return "Telefone deve ter DDD + 8 ou 9 dígitos.";
            return "";
        },
        assunto: function (f) {
            var v = f.assunto.value.trim();
            if (!v) return "Informe o assunto.";
            if (v.length < 3) return "O assunto deve ter pelo menos 3 caracteres.";
            return "";
        },
        categoria: function (f) {
            return f.categoria.value ? "" : "Selecione uma categoria.";
        },
        tipo: function (f) {
            return f.querySelector('input[name="tipo"]:checked') ? "" : "Escolha o tipo de contato.";
        },
        mensagem: function (f) {
            var v = f.mensagem.value.trim();
            if (!v) return "Escreva uma mensagem.";
            if (v.length < 10) return "A mensagem deve ter pelo menos 10 caracteres.";
            if (v.length > LIMITE_MENSAGEM) return "A mensagem pode ter no máximo " + LIMITE_MENSAGEM + " caracteres.";
            return "";
        },
        aceite: function (f) {
            return f.aceite.checked ? "" : "É necessário aceitar para enviar.";
        }
    };

    function camposDe(form, nome) {
        return form.querySelectorAll('[name="' + nome + '"]');
    }

    function validarCampo(form, nome) {
        var msg = regras[nome](form);
        var span = document.getElementById("erro-" + nome);
        if (span) span.textContent = msg;
        camposDe(form, nome).forEach(function (el) {
            if (el.type === "radio" || el.type === "checkbox") {
                el.setAttribute("aria-invalid", msg ? "true" : "false");
                return;
            }
            el.classList.toggle("invalido", !!msg);
            el.classList.toggle("valido", !msg && el.value.trim() !== "");
            el.setAttribute("aria-invalid", msg ? "true" : "false");
        });
        return msg === "";
    }

    function mostrarFeedback(texto, tipo) {
        var caixa = document.getElementById("feedback");
        caixa.textContent = texto;
        caixa.className = "feedback " + tipo;
        caixa.hidden = false;
        caixa.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function formatarData(iso) {
        return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    }

    function renderizarMensagens() {
        var lista = document.getElementById("lista-mensagens");
        var vazio = document.getElementById("sem-mensagens");
        var limpar = document.getElementById("limpar-mensagens");
        var mensagens = ler(CHAVE_MENSAGENS, []);

        lista.innerHTML = "";
        mensagens.forEach(function (m) {
            var li = document.createElement("li");

            var meta = document.createElement("p");
            meta.className = "meta";
            meta.textContent = formatarData(m.criadaEm) + " · " +
                (NOMES_CATEGORIA[m.categoria] || m.categoria) + " · " +
                (NOMES_TIPO[m.tipo] || m.tipo);

            var titulo = document.createElement("strong");
            titulo.textContent = m.assunto + " — " + m.nome + " (" + m.email + ")";

            var texto = document.createElement("p");
            texto.className = "texto";
            texto.textContent = m.mensagem;

            var remover = document.createElement("button");
            remover.type = "button";
            remover.textContent = "Remover";
            remover.addEventListener("click", function () {
                gravar(CHAVE_MENSAGENS, ler(CHAVE_MENSAGENS, []).filter(function (x) { return x.id !== m.id; }));
                renderizarMensagens();
            });

            li.appendChild(meta);
            li.appendChild(titulo);
            li.appendChild(texto);
            li.appendChild(remover);
            lista.appendChild(li);
        });

        vazio.hidden = mensagens.length > 0;
        limpar.hidden = mensagens.length === 0;
    }

    function iniciarFormulario() {
        var form = document.getElementById("form-contato");
        if (!form) return;

        var contador = document.getElementById("contador-mensagem");
        var campos = Object.keys(regras);

        // Validação ao sair do campo / ao alterar
        campos.forEach(function (nome) {
            camposDe(form, nome).forEach(function (el) {
                el.addEventListener("blur", function () { validarCampo(form, nome); });
                el.addEventListener("change", function () { validarCampo(form, nome); });
                el.addEventListener("input", function () {
                    if (el.classList.contains("invalido")) validarCampo(form, nome);
                });
            });
        });

        form.mensagem.addEventListener("input", function () {
            contador.textContent = form.mensagem.value.length + " / " + LIMITE_MENSAGEM;
        });

        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            var invalidos = campos.filter(function (nome) { return !validarCampo(form, nome); });

            if (invalidos.length) {
                mostrarFeedback("Corrija " + invalidos.length + (invalidos.length === 1 ? " campo" : " campos") + " destacado(s) e tente novamente.", "erro-geral");
                var primeiro = camposDe(form, invalidos[0])[0];
                if (primeiro) primeiro.focus();
                return;
            }

            var mensagens = ler(CHAVE_MENSAGENS, []);
            mensagens.unshift({
                id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
                criadaEm: new Date().toISOString(),
                nome: form.nome.value.trim(),
                email: form.email.value.trim(),
                telefone: form.telefone.value.trim(),
                data: form.data.value,
                assunto: form.assunto.value.trim(),
                categoria: form.categoria.value,
                tipo: form.querySelector('input[name="tipo"]:checked').value,
                mensagem: form.mensagem.value.trim()
            });

            if (!gravar(CHAVE_MENSAGENS, mensagens)) {
                mostrarFeedback("Não foi possível salvar: o armazenamento do navegador está indisponível.", "erro-geral");
                return;
            }

            var nome = form.nome.value.trim().split(" ")[0];
            form.reset();
            limparMarcas(form);
            mostrarFeedback("Obrigado, " + nome + "! Sua mensagem foi enviada e salva neste navegador.", "sucesso");
            renderizarMensagens();
        });

        form.addEventListener("reset", function () {
            setTimeout(function () {
                limparMarcas(form);
                document.getElementById("feedback").hidden = true;
            }, 0);
        });

        document.getElementById("limpar-mensagens").addEventListener("click", function () {
            if (window.confirm("Apagar todas as mensagens salvas?")) {
                gravar(CHAVE_MENSAGENS, []);
                renderizarMensagens();
            }
        });

        renderizarMensagens();
    }

    function limparMarcas(form) {
        form.querySelectorAll(".erro").forEach(function (s) { s.textContent = ""; });
        form.querySelectorAll(".invalido, .valido").forEach(function (el) {
            el.classList.remove("invalido", "valido");
        });
        form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
        var c = document.getElementById("contador-mensagem");
        if (c) c.textContent = "0 / " + LIMITE_MENSAGEM;
    }

    /* ---------- 3. Canvas (página Gráficos) ---------- */
    function iniciarCanvas() {
        var canvas = document.getElementById("desenho");
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "blue";
        ctx.fillRect(30, 30, 150, 80);

        ctx.beginPath();
        ctx.arc(300, 80, 45, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();

        ctx.fillStyle = "gray";
        ctx.fillRect(130, 160, 220, 30);
    }

    document.addEventListener("DOMContentLoaded", function () {
        iniciarTema();
        iniciarFormulario();
        iniciarCanvas();
    });
})();
