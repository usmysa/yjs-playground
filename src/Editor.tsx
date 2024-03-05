import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Provider } from "@lexical/yjs";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { Theme } from "./EditorTheme";

export function Editor() {
  const config = {
    namespace: "Collaborative Editing Demo",
    nodes: [],
    onError(error: Error) {
      throw error;
    },
    theme: Theme,
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">入力してください...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CollaborationPlugin
            id="collaboration-plugin"
            providerFactory={(id, map) => {
              const doc = new Y.Doc();
              map.set(id, doc);

              const provider = new WebsocketProvider(
                "ws://localhost:1234",
                id,
                doc
              );

              return provider as unknown as Provider;
            }}
            shouldBootstrap
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
