import React from 'react';
import { connect } from 'dva';
var BlocksViewer = connect(function (state) {
  return {
    blocks: state.blocks
  };
})(function (props) {
  function addHandler(name) {
    window.send('blocks', [name]);
  }

  return React.createElement("div", null, React.createElement("h2", null, "Search"), React.createElement("h2", null, "List"), React.createElement("ul", null, props.blocks.data.map(function (item) {
    return React.createElement("li", {
      key: item.name
    }, item.name, React.createElement("button", {
      onClick: addHandler.bind(null, item.name)
    }, "add"));
  })));
});
export default (function (api) {
  api.addPanel({
    title: 'Blocks Viewer',
    path: '/blocks',
    component: BlocksViewer,
    models: [require('./model').default]
  });
});