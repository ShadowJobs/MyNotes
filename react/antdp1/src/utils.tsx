
export async function savePageWithStyles() {
    const styles = await getStyles();
    const pageContent = '<html>' + document.head.outerHTML + styles + document.body.outerHTML + '</html>';
    const blob = new Blob([pageContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
  
    // 创建隐藏的下载链接元素
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saved_page_with_styles.html';
    link.style.display = 'none';
  
    // 将链接添加到DOM中，触发点击事件进行下载，然后移除该链接
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // 调用函数以保存页面
  async function getStyles() {
    const styleSheets = Array.from(document.styleSheets);
    let styles = '';
  
    for (const sheet of styleSheets) {
      try {
        if (sheet.cssRules) { // 对于内联CSS样式
          styles += Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } else if (sheet.href) { // 对于外部CSS样式表
          const response = await fetch(sheet.href);
          if (response.ok) {
            const text = await response.text();
            styles += text;
          }
        }
      } catch (e) {
        console.warn(`无法加载样式表：${sheet.href}`, e);
      }
    }
    return `<style>${styles}</style>`;
  }