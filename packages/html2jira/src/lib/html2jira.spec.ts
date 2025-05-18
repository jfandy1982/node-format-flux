import { html2jira } from './html2jira.js';

describe('html2jira', () => {
  it('should receive undefined for an empty HTML', () => {
    expect(html2jira('')).toBeUndefined();
  });
  it('should parse HTML to receive `Hello World!`', () => {
    expect(html2jira('<p>Hello World!</p>')).toEqual('Hello World!');
  });
});
