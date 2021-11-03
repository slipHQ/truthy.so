// From https://github.com/slipHQ/run-wasm/blob/main/example-nextjs/utils/index.ts

export interface CustomKeyBinding {
  label: string;
  keybinding: any;
  callback: () => void;
  editor: any;
}

export const addKeyBinding = ({
  label,
  keybinding,
  callback,
  editor,
}: CustomKeyBinding) => {
  return editor?.addAction({
    id: label,
    label,
    keybindings: [keybinding],
    precondition:
      "!suggestWidgetVisible && !markersNavigationVisible && !findWidgetVisible",
    run: callback,
  });
};
