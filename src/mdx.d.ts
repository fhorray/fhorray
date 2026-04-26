declare module "*.mdx" {
  import type { HtmlEscapedString } from "hono/utils/html";
  const Content: (props: Record<string, unknown>) => HtmlEscapedString | Promise<HtmlEscapedString>;
  export default Content;
}



