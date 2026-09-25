# Tab Switch Remap (Zen Browser)

Troca o atalho nativo **Ctrl+Tab** por apenas **Tab** para avançar de aba.
**Shift+Tab** volta para a aba anterior.

## O que este mod NÃO faz

Ele não intercepta Tab quando o foco está visivelmente em um campo de
texto da interface do próprio Zen (barra de endereço, busca da sidebar,
findbar etc.) — nesses lugares o Tab continua funcionando normalmente.

Dentro do **conteúdo de páginas web** (formulários de sites), o Zen isola
o processo da página e o mod não consegue verificar com 100% de certeza
se você está digitando ali. Nesse cenário específico, apertar Tab vai
trocar de aba em vez de mover o foco para o próximo campo do formulário.
É a única forma de ter "Tab puro" funcionando globalmente sem reescrever
o motor de foco do navegador.

## Instalação

### Opção 1 — Via Sine (se já tiver o Sine instalado)

1. Abra `about:preferences#sineMods` no Zen.
2. Ative a opção que permite instalar mods com JavaScript não-verificado
   ("unsafe JS" / mods não publicados).
3. Como este mod não está publicado numa URL de repositório, use a opção
   de importar/instalar mod local do Sine, apontando para esta pasta
   (`tab-switch-remap/`, contendo `theme.json` e `chrome.js`).
4. Reinicie o Zen (ou peça ao Sine para recompilar os mods).

Se o Sine não aceitar a pasta local diretamente (o esquema exato do
`theme.json` pode variar entre versões do Sine), use a Opção 2 abaixo,
que é o mecanismo que o próprio Sine usa por baixo dos panos e tem
garantia de funcionar.

### Opção 2 — Manual via fx-autoconfig (garantida)

1. No Zen, abra `about:support` e clique em **Abrir pasta** ao lado de
   "Pasta do perfil".
2. Se ainda não tiver o fx-autoconfig instalado (necessário para o Sine
   também funcionar), siga a instalação dele primeiro.
3. Dentro da pasta do perfil, entre em `chrome/JS/` (crie se não existir).
4. Copie o arquivo `chrome.js` para dentro dessa pasta e renomeie para
   `tab-switch-remap.uc.js`.
5. Volte em `about:support` e clique em **Limpar cache de inicialização**.
6. Reinicie o Zen.

## Testando

Abra algumas abas, clique em qualquer lugar da página (fora de um campo
de texto) e aperte Tab — deve avançar para a próxima aba. Shift+Tab
volta para a anterior.
