"use strict";

function Cs142TemplateProcessor(template) {
  this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
  const regex = /\{\{([^}]+)\}\}/g;

  let ret = this.template;
  let match = regex.exec(ret);
  while (match !== null) {
    if (match[1] in dictionary) {
      ret = ret.replace(match[0], dictionary[match[1]]);
    } else {
      ret = ret.replace(match[0], "");
    }
    match = regex.exec(ret);
  }
  return ret;
};
