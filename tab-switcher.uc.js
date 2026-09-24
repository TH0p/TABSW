// ==UserScript==
// @name                 Zen Single Tab Switcher
// @description          Muda o atalho de alternar abas de Ctrl+Tab para Tab
// @version              1.1.0
// @author               Custom
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_ID = "zenSingleTabSwitcher";

  // Evita duplicar listeners ao recarregar
  if (window[SCRIPT_ID] && typeof window[SCRIPT_ID].destroy === "function") {
    window[SCRIPT_ID].destroy();
  }

  // Alvo global: windowRoot captura eventos antes dos processos filhos das páginas
  const target = window.windowRoot || window;

  function isInput(targetEl) {
    const el = targetEl || document.activeElement;
    if (!el) return false;

    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;
    if (el.id === "urlbar-input" || el.closest?.("#urlbar, #searchbar, .findbar-textbox, findbar")) return true;

    return false;
  }

  function onKeyDown(event) {
    // Apenas a tecla TAB
    if (event.key !== "Tab") return;

    // Se estiver segurando Ctrl, Alt ou Meta (Cmd), não interfere
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    // Se o usuário estiver digitando em campo de texto ou na URL bar, mantém o TAB normal
    if (isInput(event.target)) return;

    // Impede o foco de pular para o próximo botão/link do site
    event.preventDefault();
    event.stopImmediatePropagation();

    // Shift + TAB = volta (-1) | Apenas TAB = avança (+1)
    const direction = event.shiftKey ? -1 : 1;

    try {
      if (window.gBrowser?.tabContainer?.advanceSelectedTab) {
        window.gBrowser.tabContainer.advanceSelectedTab(direction, true);
      } else if (window.gBrowser?.advanceSelectedTab) {
        window.gBrowser.advanceSelectedTab(direction, true);
      }
    } catch (e) {
      console.error("[ZenTabSwitcher] Erro ao trocar aba:", e);
    }
  }

  target.addEventListener("keydown", onKeyDown, true);

  window[SCRIPT_ID] = {
    destroy() {
      target.removeEventListener("keydown", onKeyDown, true);
      delete window[SCRIPT_ID];
    }
  };

  console.log("[ZenTabSwitcher] Carregado com sucesso via windowRoot!");
})();
