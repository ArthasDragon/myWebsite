import React from 'react';
import { connect } from 'dva';
import { Button, Icon, Popconfirm } from 'antd';
import './client.css';
var Routes = connect(function (state) {
  return {
    routes: state.routes
  };
})(function (props) {
  function renderRoutes(routes) {
    return React.createElement("ul", {
      className: "client-list"
    }, routes.map(function (route, i) {
      if (!route.path) return null;
      var keys = Object.keys(route).filter(function (key) {
        if (['exact', 'routes', 'component'].includes(key)) return false;
        if (key.charAt(0) === '_') return false;
        return true;
      });

      function getValue(key) {
        if (key === 'path') {
          return React.createElement("a", {
            href: "http://localhost:8000".concat(route[key])
          }, route[key]);
        }

        return route[key];
      }

      return React.createElement("li", {
        key: route.key || i,
        className: "client-item"
      }, React.createElement("div", null, React.createElement(Icon, {
        className: "client-type",
        type: route.routes ? 'folder-open' : 'file'
      }), React.createElement("span", {
        className: "client-info"
      }, keys.map(function (key, i) {
        return React.createElement("span", {
          key: key
        }, React.createElement("strong", null, key, ": "), React.createElement("code", null, getValue(key)), i === keys.length - 1 ? '' : React.createElement("strong", null, ", "));
      })), React.createElement(Popconfirm, {
        title: "Are you sure delete this component?",
        onConfirm: function (route) {
          window.send('rm', ['page', route.component]);
        }.bind(null, route)
      }, React.createElement(Icon, {
        className: "client-icon",
        type: "delete",
        theme: "filled"
      }))), route.routes ? renderRoutes(route.routes) : null);
    }));
  }

  return React.createElement("div", null, React.createElement("div", {
    className: "client-actions"
  }, React.createElement(Button, {
    type: "primary",
    onClick: function onClick() {
      var name = window.prompt("What's your page name?");

      if (name) {
        window.send('generate', ['page', name]);
      }
    }
  }, "add route"), "\xA0\xA0", React.createElement(Button, {
    type: "primary",
    onClick: function onClick() {
      var name = window.prompt("What's your layout name?");

      if (name) {
        window.send('generate', ['layout', name]);
      }
    }
  }, "add layout")), renderRoutes(props.routes.data));
});
export default (function (api) {
  api.addPanel({
    title: 'Routes Manager',
    path: '/routes',
    component: Routes,
    models: [require('./model').default]
  });
});