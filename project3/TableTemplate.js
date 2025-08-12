"use strict";
class TableTemplate {
  static fillIn(id, dictionary, columnName) {
    const table = document.getElementById(id);
    table.style.visibility = "visible";

    let replaceAll = false;
    let replaceColIndex = 0;
    if (columnName === undefined) {
      replaceAll = true;
    }

    // 获取第一行
    const trs = table.querySelectorAll("tr");
    let tds = trs[0].querySelectorAll("td");

    tds.forEach((td, index) => {
      const template = new Cs142TemplateProcessor(td.innerText);
      td.innerText = template.fillIn(dictionary);
      if (!replaceAll && td.innerText === columnName) {
        replaceColIndex = index;
      }
    });

    // 遍历剩下的所有行
    for (let i = 1; i < trs.length; ++i) {
      tds = trs[i].querySelectorAll("td");

      if (replaceAll) {
        //替换所有列
        tds.forEach((td) => {
          const template = new Cs142TemplateProcessor(td.innerText);
          td.innerText = template.fillIn(dictionary);
        });
      } else {
        //替换指定列
        const template = new Cs142TemplateProcessor(
          tds[replaceColIndex].innerText,
        );
        tds[replaceColIndex].innerText = template.fillIn(dictionary);
      }
    }
  }
}
