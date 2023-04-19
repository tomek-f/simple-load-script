export default {
  callback: null,
  callbackURLParamName: 'callback',
  placement: document.head,
  removeScript: false,
  runOriginalCallback: false,
  scriptAttr: {},
} as Omit<Options, 'url'>;

export interface Options {
  callback: string | null;
  callbackURLParamName: string;
  placement: ParentNode;
  removeScript: boolean;
  runOriginalCallback: boolean;
  scriptAttr: Record<string, string>;
  url: string;
}
