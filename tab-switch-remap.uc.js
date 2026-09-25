// ==Mod== Tab Switch Remap
// Troca o atalho nativo Ctrl+Tab por apenas Tab (sem modificador) para
// avançar para a próxima aba. Shift+Tab volta para a aba anterior.
//
// Comportamento seguro: o mod NÃO intercepta o Tab quando o foco está
// visivelmente em um campo editável da interface do Zen (barra de
// endereço, campos de busca da sidebar, findbar, caixas de texto de
// configurações, etc). Isso evita quebrar a digitação nesses lugares.
//
// Limitação conhecida: dentro do CONTEÚDO de uma página web (ex: um
// formulário de um site), o Zen/Firefox isola o processo da página
// (Fission) e um script de chrome não consegue verificar com certeza
// se o campo focado ali é editável. Nesse caso o mod ainda vai trocar
// de aba ao apertar Tab. Se isso atrapalhar seu uso em formulários,
// segure Ctrl (ex: Ctrl+algo) enquanto digita, ou ajuste o mod para
// checar `event.getModifierState` conforme sua necessidade.

(function () {
  const PREVENT_ON_EDITABLE_SELECTOR =
    "input, textarea, select, [contenteditable='true'], .textbox-input, #urlbar-input, .searchbar-textbox";

  function isChromeEditableTarget(target) {
    if (!target || !target.closest) return false;
    try {
      return !!target.closest(PREVENT_ON_EDITABLE_SELECTOR);
    } catch (e) {
      return false;
    }
  }

  function onKeyDown(event) {
    // Só reage ao Tab puro ou Shift+Tab. Ignora se Ctrl/Alt/Meta estiverem pressionados,
    // para não conflitar com outros atalhos que usam Tab como parte da combinação.
    if (event.key !== "Tab") return;
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const target = event.originalTarget || event.target;
    if (isChromeEditableTarget(target)) return;

    const win = target && target.ownerGlobal ? target.ownerGlobal : window;
    const tabbrowser = win.gBrowser;
    if (!tabbrowser || !tabbrowser.tabContainer) return;

    event.preventDefault();
    event.stopPropagation();

    const direction = event.shiftKey ? -1 : 1;
    tabbrowser.tabContainer.advanceSelectedTab(direction, true);
  }

  window.addEventListener("keydown", onKeyDown, true);

  console.log("[tab-switch-remap] Mod carregado: Tab troca de aba, Shift+Tab volta.");
})();
