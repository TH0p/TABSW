// ==UserScript==
// @name                 Zen Single Tab Switcher
// @description          Substitui o atalho Ctrl+Tab por apenas TAB (e Shift+Tab para voltar)
// @version              1.0.0
// @author               Custom
// @include              chrome://browser/content/browser.xhtml
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_ID = "zenSingleTabSwitcher";

  // Descarrega instância anterior caso o Sine faça recarregamento dinâmico
  if (window[SCRIPT_ID] && typeof window[SCRIPT_ID].destroy === "function") {
    window[SCRIPT_ID].destroy();
  }

  // Executa apenas na janela principal do Zen Browser
  if (!window.gBrowser) {
    return;
  }

  const CONFIG = {
    // Permite que Shift + TAB volte para a aba anterior
    enableShiftTabPrevious: true,
    // Impede a troca de abas caso o foco esteja em um campo editável (URL bar, inputs, etc.)
    ignoreWhenEditingText: true
  };

  /**
   * Verifica se o elemento ativo é um campo de entrada de texto.
   */
  function isEditingText(target) {
    if (!CONFIG.ignoreWhenEditingText) return false;

    const activeEl = document.activeElement;
    const candidates = [target, activeEl].filter(Boolean);

    for (const el of candidates) {
      const tag = (el.tagName || "").toLowerCase();

      // Campos HTML de entrada
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return true;
      }

      // Elementos com contentEditable (Google Docs, editores ricos)
      if (el.isContentEditable) {
        return true;
      }

      // Elementos de busca/URL do próprio Zen Browser
      if (
        el.id === "urlbar-input" ||
        el.classList?.contains("urlbar-input") ||
        el.closest?.("#urlbar, #searchbar, .findbar-textbox, findbar")
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Captura o evento de teclado na fase de captura
   */
  function onKeyDown(event) {
    // Só processa a tecla TAB
    if (event.key !== "Tab") {
      return;
    }

    // Não interfere se Ctrl, Alt ou Meta (Cmd no macOS / Win no Windows) estiverem pressionados
    // Isso mantém atalhos nativos do sistema (como Alt+Tab) funcionando normalmente
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Não alterna abas se o usuário estiver digitando em um campo de texto ou na URL bar
    if (isEditingText(event.target)) {
      return;
    }

    // Determina a direção: TAB = próxima aba (+1), Shift + TAB = aba anterior (-1)
    let direction = 1;
    if (event.shiftKey) {
      if (!CONFIG.enableShiftTabPrevious) {
        return;
      }
      direction = -1;
    }

    // Interrompe o comportamento padrão (mover o foco entre botões/links na página)
    event.preventDefault();
    event.stopImmediatePropagation();

    // Executa a troca de abas nativa do Zen
    try {
      if (window.gBrowser?.tabContainer?.advanceSelectedTab) {
        window.gBrowser.tabContainer.advanceSelectedTab(direction, true);
      } else if (window.gBrowser?.advanceSelectedTab) {
        window.gBrowser.advanceSelectedTab(direction, true);
      }
    } catch (error) {
      console.error("[ZenTabSwitcher] Erro ao alternar abas:", error);
    }
  }

  // Registra o listener na fase de captura (true) para interceptar o evento
  window.addEventListener("keydown", onKeyDown, true);

  // Expõe o método de limpeza exigido para suporte a descarregamento no Sine
  window[SCRIPT_ID] = {
    destroy: function () {
      window.removeEventListener("keydown", onKeyDown, true);
      delete window[SCRIPT_ID];
      console.log("[ZenTabSwitcher] Mod descarregado com sucesso.");
    }
  };

  console.log("[ZenTabSwitcher] Mod ativo: [TAB] avança de aba e [Shift + TAB] retrocede.");
})();