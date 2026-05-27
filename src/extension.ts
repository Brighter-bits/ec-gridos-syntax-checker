// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ECGridOS'); // Create a collection of errors
    context.subscriptions.push(diagnosticCollection); // Put the logs into the disposables

    // If a file is opened, changed: check for any errors. When the file is closed, look into the errors, and delete the logs using the file as a key.
    vscode.workspace.onDidOpenTextDocument(file => check(file, diagnosticCollection));
    vscode.workspace.onDidChangeTextDocument(file => check(file.document, diagnosticCollection));
    vscode.workspace.onDidCloseTextDocument(file => diagnosticCollection.delete(file.uri));

    vscode.workspace.textDocuments.forEach(file => check(file, diagnosticCollection)); //Check all the currently open files.
}

function check(file: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection){
    if (file.languageId !== "ECGridOS") {return;}
    var errors: vscode.Diagnostic[] = [];
    var heads = -1;

    // Firstly, check for any HEADS, and how many there are
    var firstline = file.lineAt(0).text;
    if (!firstline.startsWith("HEADS")){
        errors.push(
            new vscode.Diagnostic(
                new vscode.Range(0, 0, 0, 0),
                "No HEADS declaration",
                vscode.DiagnosticSeverity.Error
            )
        );
    } else{
        heads = firstline.split(" ", 2)[1].length;
    }

    for (let i = 1; i < file.lineCount; i++) {
        var line = file.lineAt(i).text;
        if (line === "\n") {continue;} // If it's just a newline
        if (line.startsWith("//")) {continue;}

    }
}
