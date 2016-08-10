/* @flow */

type WebpackHot = {
  accept(path: ?string) : void;
}

declare var module: {
  exports: any;
  require(id: string): any;
  id: string;
  filename: string;
  loaded: boolean;
  parent: any;
  children: Array<any>;
  // We extend the common js format with the following to allow for the
  // webpack related feature.
  hot: WebpackHot
};
