import * as vscode from "vscode";
import * as _ from "lodash";
import * as math from "mathjs";
declare const global: any;

global._ = _;
global.math = math;
global.n2w = (function() {
    const n = (function() {
        let o = [
            "",
            "One",
            "Two",
            "Three",
            "Four",
            "Five",
            "Six",
            "Seven",
            "Eight",
            "Nine"
        ];
        let t = [
            "Ten",
            "Eleven",
            "Twelve",
            "Thirteen",
            "Fourteen",
            "Fifteen",
            "Sixteen",
            "Seventeen",
            "Eighteen",
            "Nineteen"
        ];
        let n = [
            "Twenty",
            "Thirty",
            "Forty",
            "Fifty",
            "Sixty",
            "Seventy",
            "Eighty",
            "Ninety"
        ].map(v => o.map(x => v + (x && " " + x)));
        return _([o, t, ...n])
            .flatten()
            .value();
    })();

    const fg = [
        "",
        "Thousand",
        "Million",
        "Billion",
        "Trillion",
        "Quadrillion",
        "Quintillion",
        "Sextillion",
        "Septillion",
        "Octillion",
        "Nonillion",
        "Decillion",
        "Undecillion",
        "Duodecillion",
        "Tredecillion",
        "Quattuordecillion",
        "Quinquadecillion",
        "Sedecillion",
        "Septendecillion",
        "Octodecillion",
        "Novendecillion",
        "Vigintillion",
        "Unvigintillion",
        "Duovigintillion",
        "Tresvigintillion",
        "Quattuorvigintillion",
        "Quinquavigintillion",
        "Sesvigintillion",
        "Septemvigintillion",
        "Octovigintillion",
        "Novemvigintillion",
        "Trigintillion",
        "Untrigintillion",
        "Duotrigintillion",
        "Trestrigintillion",
        "Quattuortrigintillion",
        "Quinquatrigintillion",
        "Sestrigintillion",
        "Septentrigintillion",
        "Octotrigintillion",
        "Noventrigintillion",
        "Quadragintillion",
        "Unquadragintillion",
        "Duoquadragintillion",
        "Tresquadragintillion",
        "Quattorquadragintillion",
        "Quinquaquadragintillion",
        "Sesquadragintillion"
    ];
    const d3 = (x, y = ("000" + x).slice(-3)) =>
        `${+y[0] ? n[y[0]] + " Hundred" : ""} ${
            +y[1] + +y[2] ? n[+(y[1] + y[2])] : ""
        }`.trim();
    return (x, y = ((x += ""), "0".repeat(3 - (x.length % 3)) + x)) =>
        y
            .match(/.{3}/g)
            .map((v, i, k) =>
                (d3(v) && d3(v) + " " + fg[k.length - i - 1]).trim()
            )
            .join(" ")
            .trim();
})();

export function activate(context: vscode.ExtensionContext) {
    const js2text = vscode.commands.registerTextEditorCommand(
        "extension.js2text",
        (textEditor, edit) => { 
            const selectionsTransformed = textEditor.selections.map(
                selection => {
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
                }
            );

            textEditor.edit(editBuilder => {
                selectionsTransformed.forEach(x => {
                    editBuilder.replace(x.selection, x.replacementText);
                });
            });
        }
    );
    context.subscriptions.push(js2text);
    const mathJs2text = vscode.commands.registerTextEditorCommand(
        "extension.mathJs2text",
        (textEditor, edit) => {
            const selectionsTransformed = textEditor.selections.map(
                selection => {
                    const text = textEditor.document.getText(selection);
                    let replacementText = math.eval(text) as any;
                    if (typeof replacementText != "string") {
                        replacementText = JSON.stringify(replacementText);
                    }
                    return {
                        selection,
                        replacementText
                    };
                }
            );

            textEditor.edit(editBuilder => {
                selectionsTransformed.forEach(x => {
                    editBuilder.replace(x.selection, x.replacementText);
                });
            });
        }
    );
    context.subscriptions.push(mathJs2text);
}
