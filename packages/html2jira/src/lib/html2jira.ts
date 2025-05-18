import parse, { DOMNode } from 'html-dom-parser';

export function html2jira(htmlTextToParse: string): string | undefined {
  const parsedObject: DOMNode[] = parse(htmlTextToParse);

  for (const node of parsedObject) {
    if (node.type === 'tag') {
      for (const child of node.children) {
        if (child.type === 'text') {
          return child.data;
        }
      }
    }
  }

  return undefined;
}
