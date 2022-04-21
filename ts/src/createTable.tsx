import { message } from 'antd';
import React from 'react';
//用代码创建一个原生html表格
const Table: React.FC<{ tableResult; isMerged: boolean,mid?:number }> = ({
  tableResult, isMerged, mid
}) => {
    const headers: string[] = []; //第一行，表头
    const indicators: string[] = [];//第一列，
  const tableEl = document.createElement('table');
  tableEl.className = 'table table-hover rounded table-bordered';
  const theadEl = document.createElement('thead');
  theadEl.setAttribute('id', 'custom-header');
  const trEl = document.createElement('tr');
  ['', ...headers].map((indicator) => {
    const thEl = document.createElement('th');
    thEl.className = 'text-center mth';
    const pEl = document.createElement('p');
    pEl.className = 'p-header';
    pEl.innerText = indicator;
    thEl.appendChild(pEl);
    trEl.appendChild(thEl);
  });
  theadEl.appendChild(trEl);
  tableEl.appendChild(theadEl);
  const tbodyEl = document.createElement('tbody');
  tbodyEl.setAttribute('id', 'custom-row');
  indicators.map((indicator, idx) => {
    const trEl = document.createElement('tr');
    trEl.setAttribute('data-rowid', idx.toString());
    const tdEl = document.createElement('td');
    tdEl.className = 'text-center mtd-t';
    tdEl.setAttribute('data-id', idx.toString());
    tdEl.setAttribute('rowspan', '1');
    const pEl = document.createElement('p');
    pEl.className = 'mmms-p-tdtile';
    pEl.innerText = indicator;
    tdEl.appendChild(pEl);
    trEl.appendChild(tdEl);
    headers.map((header) => {
      const tdEl = document.createElement('td');
      tdEl.className = 'text-center mtd-r';
      tdEl.setAttribute('data-id', idx.toString());
      let value=tableResult.values[indicator][header]
      if (value !== undefined && value !== null) {
        const pEl = document.createElement('p');
        pEl.className = 'mmms-p-value';

        if (!isMerged || typeof value == 'number') {
          if(header=="url" && value.indexOf("http")==0){
            pEl.innerHTML=`<a href="${value}&mmid=${mid}" target="_blank">前往 </a>`
          }else
            pEl.innerText = value.toString();
          tdEl.appendChild(pEl);
        } else {
          const [val, delta] = (value as string).split( '|');
          pEl.innerText = val;
          tdEl.appendChild(pEl);
        }
        if(tableResult.withColor && header in tableResult.withColor){
          if(value==100) tdEl.classList.add("mmms-value-with-green")
          else tdEl.classList.add("mmms-value-with-red")
        }
      }
      trEl.appendChild(tdEl);
    });
    tbodyEl.appendChild(trEl);
  });

  tableEl.appendChild(tbodyEl);

  return <div dangerouslySetInnerHTML={{ __html: tableEl.outerHTML }}></div>;
};

export default Table;
