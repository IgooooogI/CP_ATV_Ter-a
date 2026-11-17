# Site Pessoal — Igor Pedrosa (CP4)

Portfólio pessoal desenvolvido com HTML5, CSS3, JavaScript e Bootstrap 5.3.3.

## Páginas
- `index.html`: apresentação pessoal e interesses.
- `curriculo.html`: formação, experiências, habilidades e objetivo.
- `formulario.html`: formulário com validação, contador, feedback e armazenamento local das mensagens.
- `multimidia.html`: vídeo, áudio e conteúdo incorporado.
- `graficos.html`: desenho em Canvas e formas em SVG.

## Recursos JavaScript
- Alternância entre tema claro e escuro, com preferência salva em `localStorage`.
- Validação dos campos do formulário e contador de caracteres.
- Mensagens armazenadas no navegador (`localStorage`), preservadas após atualizar a página (F5), com opção de remoção.
- Desenho gerado dinamicamente no Canvas.

## Acessibilidade e responsividade
- Estrutura semântica, link para pular ao conteúdo, navegação identificada e indicação da página atual.
- Textos alternativos/descrições para imagens, Canvas e SVG.
- Foco de teclado visível, rótulos associados aos campos e mensagens de validação anunciadas.
- Layout responsivo com CSS Grid, Flexbox e media queries.
- Respeito à preferência por movimento reduzido.

## Bootstrap
Bootstrap 5.3.3 integrado por CDN (CSS e JavaScript Bundle). Classes utilizadas incluem `container`, `nav`, `nav-pills`, `nav-link`, `btn`, `form-control`, `form-select`, `table`, `table-bordered`, `table-striped` e `img-fluid`.

## Publicação
O projeto pode ser publicado no GitHub Pages pela branch principal, na raiz do repositório. Para a entrega, envie todos os arquivos e crie a tag `cp4-entrega` após conferir a versão final.

**Observação:** o formulário demonstra validação e persistência local no navegador; ele não envia e-mails nem grava mensagens em um servidor. O conteúdo salvo fica apenas no navegador utilizado.
