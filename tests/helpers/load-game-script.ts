import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

type Sandbox = Record<string, any>;

export function createGameScriptContext(initialState: Sandbox = {}): vm.Context {
    const sandbox: Sandbox = {
        console,
        Math,
        Date,
        performance: { now: () => 0 },
        ...initialState
    };

    sandbox.globalThis = sandbox;
    sandbox.window = sandbox;

    return vm.createContext(sandbox);
}

export function loadGameScript(context: vm.Context, workspaceRelativePath: string): void {
    const absolutePath = path.resolve(process.cwd(), workspaceRelativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');

    const transpiled = ts.transpileModule(source, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.None
        }
    }).outputText;

    vm.runInContext(transpiled, context, { filename: workspaceRelativePath });
}
