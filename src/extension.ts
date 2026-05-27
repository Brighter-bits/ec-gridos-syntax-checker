import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ECGridOS'); // Create a collection of errors
    context.subscriptions.push(diagnosticCollection); // Put the logs into the disposables
    
    console.log("Started up Succesfully");

    // If a file is opened, changed: check for any errors. When the file is closed, look into the errors, and delete the logs using the file as a key.
    vscode.workspace.onDidOpenTextDocument(file => check(file, diagnosticCollection));
    vscode.workspace.onDidChangeTextDocument(file => check(file.document, diagnosticCollection));
    vscode.workspace.onDidCloseTextDocument(file => diagnosticCollection.delete(file.uri));

    vscode.workspace.textDocuments.forEach(file => check(file, diagnosticCollection)); //Check all the currently open files.
}

function check(file: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection){
    if (file.languageId !== "ECGridOS") {return;}
    var errors: vscode.Diagnostic[] = [];
    var heads: number = -1;

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
        heads = (firstline.split(" ", 2)[1])?.length;
    }

    for (let i = 1; i < file.lineCount; i++) {
        var line = file.lineAt(i).text;
        if (line.trim() === "") {continue;} // If it's just a newline, skip
        if (line.startsWith("//")) {continue;} // If the line is a comment, skip
        var splitline = line.split(" ", 5); //It turns out you can write whatever you want after a line and it doesn't actually matter
        var spaces: number[] = FindSpaces(line);

        if (splitline.length > 2 && spaces.length > 1 && splitline[1].length !== heads){
            errors.push(
                new vscode.Diagnostic(
                    new vscode.Range(i, spaces[0]+1, i, spaces[1]),
                    "The number of READ instructions does not match the number of heads declared in the first line",
                    vscode.DiagnosticSeverity.Error
                )
            );
        }

        if (splitline.length > 3 && spaces.length > 2 && splitline[3]?.length !== heads){
            errors.push(
                new vscode.Diagnostic(
                    new vscode.Range(i, spaces[2]+1, i, spaces[3]),
                    "The number of WRITE instructions does not match the number of heads declared in the first line",
                    vscode.DiagnosticSeverity.Error
                )
            );
        }

        if (splitline.length === 5){
            if (spaces.length === 4 && splitline[4].length !== heads){ // Check for number of operations
                errors.push(
                    new vscode.Diagnostic(
                        new vscode.Range(i, spaces[3]+1, i, line.length),
                        "The number of MOVE instructions does not match the number of heads declared in the first line",
                        vscode.DiagnosticSeverity.Error
                    )
                );
            }
            if (!/[UDLRS]+/g.test(splitline[4])){ // Check if any unallowed movements are used
                errors.push(
                    new vscode.Diagnostic(
                        new vscode.Range(i, spaces[3]+1, i, line.length),
                        "Invalid MOVE operations: Only U, D, L, R and S are allowed",
                        vscode.DiagnosticSeverity.Error
                    )
                );
            }
        }

    }

    diagnosticCollection.set(file.uri, errors); // put the errors into the diagnostics for that file
    
    function FindSpaces(line:string){ // Find the indexes of the spaces on the line
        var spaces: number[] = [];
        for (let i = 0; i < line.length; i++) {
            if (spaces.length > 3){
                break;
            }
            if (line[i] === " "){
                spaces.push(i);
            }
        }
        return spaces;
    }    
}
