declare module "react-syntax-highlighter" {
  import type { ComponentType, ReactNode } from "react";

  export type SyntaxHighlighterProps = {
    children?: ReactNode;
    language?: string;
    [key: string]: unknown;
  };

  export const Prism: ComponentType<SyntaxHighlighterProps>;
}
