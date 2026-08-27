/** A tiny structured content format — richer than plain strings, no MDX pipeline. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "callout"; tone: "info" | "warning" | "success" | "danger"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "steps"; items: Array<{ title: string; text: string }> };

export interface DocArticle {
  slug: string;
  title: string;
  section: DocSectionId;
  description: string;
  readTime: number;
  updated: string;
  keywords: string[];
  body: Block[];
}

export type DocSectionId =
  | "getting-started"
  | "installation"
  | "licensing"
  | "administration"
  | "api-reference"
  | "troubleshooting"
  | "knowledge-base"
  | "tutorials";

export interface DocSection {
  id: DocSectionId;
  title: string;
  description: string;
  icon: string;
}

export type BlogCategory =
  | "accounting"
  | "retail"
  | "payroll"
  | "business-tips"
  | "software-updates"
  | "technology";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
  body: Block[];
}
