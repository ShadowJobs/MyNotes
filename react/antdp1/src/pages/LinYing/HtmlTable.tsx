import "./HtmlTable.css"
export var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return function (table:any, name:string, filename:string) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        document.getElementById("dlink").href = uri + base64(format(template, ctx));
        document.getElementById("dlink").download = filename;
        document.getElementById("dlink").click();
    }
  })()
window.tableToExcel=tableToExcel

export const reportHtml=`<html>
  <head>
  <style>

  table,
    td {
        border: 1px solid rgb(67, 219, 11);
        border-collapse:collapse;
        text-align:center;
    }
  </style>
  </head>
    <body>
      <table class="table" id="tables" border="1">
      <caption>统计表</caption><!--可以生成表格的标题-->
      <thead>
          <tr rowspan="2">
              <th rowspan="2">品牌</th>
              <th rowspan="2">门店</th>
                <div> 可以插入div标签，但是会显示在头部
              <th rowspan="2">本周成交数</th>
              <th rowspan="2">本月成交数</th>
              <th rowspan="2">总成交数</th>
              <th colspan="3">合并头</th>
              </div>
          </tr>
          <tr>
              <th>异常量</th>
              <th>成交转化率</th>
              <th>经手人</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td rowspan="2">华为</td>
              <td>深圳</td>
              <td rowspan="2">20</td>
              <td  colSpan="2">3</td>
              <td>1</td>
              <td>4.0%</td>
              <td>黄</td>
          </tr>
          <tr>
              <td>东莞</td>
              <td>3</td>
              <td>20</td>
              <td>1</td>
              <td>4.0%</td>
              <td>黄</td>
          </tr>
          <tr>
              <td rowspan="3">小米</td>
              <td>广州</td>
              <td>20</td>
              <td>3</td>
              <td>20</td>
              <td>1</td>
              <td>4.0%</td>
              <td>林</td>
          </tr>
      </tbody>

      <thead>
          <tr rowspan="2">
              <th rowspan="2">品牌</th>
              <th rowspan="2">门店</th>

              <th rowspan="2">本周成交数</th>
              <th rowspan="2">本月成交数</th>
              <th rowspan="2">总成交数</th>
              <th colspan="3">合并头</th>
          </tr>
          <tr>
              <th>异常量</th>
              <th>成交转化率</th>
              <th>经手人</th>
          </tr>
      </thead>
  </table>
      <a id="dlink" style="display:none;"></a>
      <input type="button" onclick="window.tableToExcel('tables', 'name', 'myfile.xls')" value="Export to Excel">
    </body>
  </html>`
const HtmlTable:React.FC=()=>{
    return <div>
    <div>sss</div>
        <iframe title="resg" srcDoc={reportHtml}
            style={{ width: '100%', border: '0px', height: '900px',borderCollapse:"collapse" }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            scrolling="auto"
        />
        <div>sss</div>
      <table id="tables">
        <caption>统计表</caption>
        <thead>
            <tr aria-rowspan={2}>
                <th rowSpan={2}>品牌</th>
                <th rowSpan={2}>门店</th>

                <th rowSpan={2}>本周成交数</th>
                <th rowSpan={2}>本月成交数</th>
                <th rowSpan={2}>总成交数</th>
                <th colSpan={3}>合并头</th>
            </tr>
            <tr>
                <th>异常量</th>
                <th>成交转化率</th>
                <th>经手人</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowSpan={2}>华为</td>
                <td>深圳</td>
                <td rowSpan={2}>20</td>
                <td colSpan={2}>3</td>
                <td>1</td>
                <td>4.0%</td>
                <td>黄</td>
            </tr>
            <tr>
                <td>东莞</td>
                <td>3</td>
                <td>20</td>
                <td>1</td>
                <td>4.0%</td>
                <td>黄</td>
            </tr>
            <tr>
                <td rowSpan={3}>小米</td>
                <td>广州</td>
                <td>20</td>
                <td>3</td>
                <td>20</td>
                <td>1</td>
                <td>4.0%</td>
                <td>林</td>
            </tr>
        </tbody>
      </table>
    </div>
}

export default HtmlTable
