/*
 * This can make any table sortable by any heading.
 * We use a stable sort algorithm so that sorting by multiple headings can be useful.
 * We sort numerically, unless we cannot or the number are the same,
 * in which case we sort as a string.
 * We only sort the table body.
 *
 * To use this library, call instrumentSorTableTable.
 * If the contents of the table body have changed, call sortTable()
 * to re-sort by the last sort column.
 */

/*
 * Make a table sortable
 *
 * table: an HTML table element
 * presort: if given, the number of column by which to sort (starting with 0)
 * direction: ("asc" or "desc") the direction by which to pre-sort.
 */
export function instrumentSortableTable(table, presort, direction) {
  // add style element to document head to set table style
  installCSS();

  if (table.tHead) {
    table.classList.add('sortable');

    const ths = table.tHead.rows[0].children;
    for (let i = 0; i < ths.length; i += 1) {
      ths[i].addEventListener('click', (e) => {
        // prevent selecting text
        e.stopPropagation();
        e.preventDefault();
        sort(table, i);
      });
    }
  }

  if (presort != null) sort(table, presort, direction);
}

/*
 * Re-sort a table by the column by which the table was last sorted.
 * This is mainly useful if the contents of the tbody change and you want to apply
 * the current sort again.
 */
export function sortTable(table) {
  const activeSortTD = table.querySelector('[data-active-sort]');
  if (activeSortTD) {
    sort(table, activeSortTD.cellIndex, activeSortTD.dataset.activeSort);
  }
}

function sort(table, n, direction) {
  const tbody = table.tBodies[0];

  let reverse = direction === 'desc';
  if (table.tHead && table.tHead.rows[0] && table.tHead.rows[0].children[n]) {
    const th = table.tHead.rows[0].children[n];
    if (th.dataset.activeSort && !direction) {
      reverse = th.dataset.activeSort === 'asc';
    }

    // clean up old active sort heading(s)
    for (const el of table.querySelectorAll('[data-active-sort]')) {
      delete el.dataset.activeSort;
    }

    th.dataset.activeSort = reverse ? 'desc' : 'asc';
  }

  // sort all the children of tbody by their nth child (starting from 0)
  // in a try block in case there aren't enough elements around and array lookups fail
  try {
    // going through rows from the back, find last biggest row until the current one,
    // put it after the current one
    for (let i = tbody.children.length - 1; i > 0; i -= 1) {
      let max = tbody.children[i];
      let maxText = max.children[n].textContent.trim();
      let maxNum = Number.parseFloat(maxText);
      for (let j = i - 1; j >= 0; j -= 1) {
        const text = tbody.children[j].children[n].textContent.trim();
        const num = Number.parseFloat(text);

        // must use reverse in the conditions to keep search stability
        let greater = reverse ? text < maxText : text > maxText;
        if (!Number.isNaN(maxNum) && !(Number.isNaN(num)) && maxNum !== num) {
          greater = reverse ? num < maxNum : num > maxNum;
        }

        if (greater) {
          max = tbody.children[j];
          maxText = text;
          maxNum = num;
        }
      }
      if (max !== tbody.children[i]) {
        tbody.insertBefore(max, tbody.children[i + 1]);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const STYLE = `
  table th {
    padding: 1rem;
    border: 1px solid lightgrey;
  }
  th[data-active-sort='asc']::after {
    content: "△";
  }
  th[data-active-sort='desc']::after {
    content: "▽";
  }
  th[data-active-sort]::after {
    padding-left: .5rem;
    display: block;
    position: absolute;
    right: .2rem;
    top: calc(50% - .5em);
    font: normal normal normal 1rem/1 monospace;
  }
  th[data-active-sort] {
    position: relative;
  }
`;

function installCSS() {
  if (!document.querySelector('#sort-table-style')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'sort-table-style';
    styleElement.textContent = STYLE;
    document.head.append(styleElement);
  }
}
