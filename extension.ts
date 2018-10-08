import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const js2text = vscode.commands.registerTextEditorCommand("extension.js2text", (textEditor, edit) => {
    const selectionsTransformed = textEditor.selections.map(selection => {
      const text = textEditor.document.getText(selection);
      let copyOfEval = eval;
      let replacementText = copyOfEval(text) as any;
      if (typeof replacementText != "string") {
        replacementText = JSON.stringify(replacementText);
      }
      return {
        selection,
        replacementText
      };
    });

    textEditor.edit(editBuilder => {
      selectionsTransformed.forEach(x => {
        editBuilder.replace(x.selection, x.replacementText);
      });
    });
  });
  context.subscriptions.push(js2text);
}
