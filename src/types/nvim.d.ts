declare namespace NvimLsp {
  interface Client {
    name: string;
    resolved_capabilities: {
      document_formatting: boolean;
      document_range_formatting: boolean;
    };
    offset_encoding: string;
    request: <T>(
      this: void,
      method: import("./methods").Methods,
      params: Record<string, unknown>,
      handler?: (err: unknown, res: T[]) => void,
      bufnr?: number
    ) => boolean;
    request_sync: <T>(
      this: void,
      method: import("./methods").Methods,
      params: Record<string, unknown>,
      timeout_ms?: number,
      bufnr?: number
    ) => { result: T[] };
  }
  interface ServerOptions {
    on_attach?: (this: void, client: Client, bufnr: number) => void;
    on_init?: (this: void, client: Client, initialize_result: unknown) => void;
  }
}

declare namespace Nvim {
  interface CommandOptions {
    bang: boolean;
  }
  interface CommandAttributes {
    bang?: boolean;
  }
}

declare namespace vim {
  const inspect: (args: unknown) => void;
  const lsp: {
    get_active_clients: (this: void) => NvimLsp.Client[];
    util: {
      make_range_params: (this: void) => {
        textDocument: import("vscode-languageserver-types").TextDocumentIdentifier;
        range: import("vscode-languageserver-types").Range;
        context?: import("vscode-languageserver-types").CodeActionContext;
      };
      apply_text_edits: (
        this: void,
        edits: import("vscode-languageserver-types").TextEdit[],
        bufnr: number,
        offset_encoding: string
      ) => void;
    };
  };
  const diagnostic: {
    get: (
      this: void,
      bufnr?: number
    ) => import("vscode-languageserver-types").Diagnostic[];
  };
  const api: {
    nvim_get_current_buf: (this: void) => number;
    nvim_buf_get_name: (this: void, bufnr: number) => string;
    nvim_buf_add_user_command: (
      this: void,
      bufnr: number,
      name: string,
      command: (opts: Nvim.CommandOptions) => void,
      attributes: Nvim.CommandAttributes
    ) => void;
    nvim_buf_get_option: <T>(this: void, bufnr: number, name: string) => T;
  };
  const ui: {
    input: (
      this: void,
      opts: { prompt?: string; default?: string },
      on_confirm: (this: void, input?: string) => void
    ) => void;
  };
  const fn: {
    confirm: (this: void, message: string, choices: string) => number;
  };
  const cmd: (this: void, command: string) => void;
  const uri_from_fname: (this: void, fname: string) => string;
  const loop: {
    fs_rename: (
      this: void,
      source: string,
      target: string
    ) => LuaMultiReturn<[boolean, string | undefined]>;
  };
}