# Everybody Codes GridOS Syntax Checker

DEPRECATED: (Well that was quick...) [Paul Keller's GridOS Everybodycodes Extension](https://github.com/scorixear/gridos-everybodycodes-extension) does everything this extension can do, and actually run your script! After a couple PRs it has complete feature parity with mine, and thus, I can wholeheartedly recommend it. This extension is very unlikely to be updated in the future.

A pretty self-explanatory name: A vscode syntax checker and highlighter for the [Everybody Codes GridOS](https://everybody.codes/gridos/missions) language.

This can:
- Highlight syntax according to your vscode theme
- Check if you have one READ, WRITE and MOVE parameter for each HEAD
- Check if you are using a valid movement option
- Check if any of a state's rules overlap

This extension CAN'T run the script you write!
It's just here so that you can see all your code at once, rather than staring at the tiny box on the website.

## How to Use

Create a file with the ```.gridec``` extension and the checker should start working.

## Note

The problem where when you press enter the autocomplete still tries to complete you movement does still exist, but you can get rid of that by putting "editor.acceptSuggestionOnEnter": "off" into your vscode settings.
