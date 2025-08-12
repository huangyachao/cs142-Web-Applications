"use strict";
class DatePicker {
  constructor(id, dataSelectCallback) {
    this.id = id;
    this.dataSelectCallback = dataSelectCallback;
  }

  generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 创建 table
    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const infoRow = document.createElement("tr");

    // 第一格放按钮
    ["<"].forEach((symbol) => {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = symbol;

      btn.addEventListener("click", () => {
        const date = new Date(year, month, 1);
        date.setMonth(month - 1);
        const oldElement = document.getElementById(this.id);
        oldElement.removeChild(oldElement.firstChild);
        this.render(date);
      });

      td.appendChild(btn);
      infoRow.appendChild(td);
    });

    //五格显示当前年月
    const infoCell = document.createElement("td");
    infoCell.colSpan = 5;
    infoCell.textContent = `${year}年 ${month + 1}月`;
    infoRow.appendChild(infoCell);

    // 最后一格放按钮
    [">"].forEach((symbol) => {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = symbol;

      btn.addEventListener("click", () => {
        const date = new Date(year, month, 1);
        date.setMonth(month + 1);
        const oldElement = document.getElementById(this.id);
        oldElement.removeChild(oldElement.firstChild);
        this.render(date);
      });

      td.appendChild(btn);
      infoRow.appendChild(td);
    });

    thead.appendChild(infoRow);

    // 表头
    const headRow = document.createElement("tr");
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    daysOfWeek.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // 表格主体;
    const tbody = document.createElement("tbody");
    const rowCount = Math.ceil((firstDay + daysInMonth) / 7);

    // 表格第一行
    const daysInlastMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < rowCount; ++i) {
      const row = document.createElement("tr");
      for (let j = 1; j <= 7; ++j) {
        const cell = document.createElement("td");

        if (i * 7 + j - firstDay <= 0) {
          cell.textContent = daysInlastMonth + i * 7 + j - firstDay;
        } else if (i * 7 + j - firstDay <= daysInMonth) {
          cell.textContent = i * 7 + j - firstDay;
          const date = {};
          date.year = year;
          date.month = month + 1;
          date.day = i * 7 + j - firstDay;
          cell.addEventListener("click", () => {
            this.dataSelectCallback(this.id, date);
          });
          cell.className = "light-cell";
        } else {
          cell.textContent = i * 7 + j - firstDay - daysInMonth;
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return table;
  }

  render(date) {
    const oldElement = document.getElementById(this.id);
    oldElement.appendChild(
      this.generateCalendar(date.getFullYear(), date.getMonth()),
    );
  }
}
