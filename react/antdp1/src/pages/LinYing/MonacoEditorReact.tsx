import { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import * as monaco from 'monaco-editor';
import { logLanguage, logTheme } from './monaco-theme';

export const LogCard = ({ curLog }) => {
  const [monacoInited, setMonacoInited] = useState(false);
  const editorRef = useRef(null);
  useEffect(() => {
    // Register the custom language
    monaco.languages.register({ id: 'log' });
    monaco.languages.setMonarchTokensProvider('log', logLanguage);
    // https://microsoft.github.io/monaco-editor/docs.html#functions/editor.defineTheme.html
    // 参数文档
    monaco.editor.defineTheme('logTheme', logTheme);
    setMonacoInited(true);
    const updateEditorLayout = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
    window.addEventListener('resize', updateEditorLayout);
    return () => {
      window.removeEventListener('resize', updateEditorLayout);
      // monaco.editor.setTheme("vs") //还原，同一页面多个monaco的时候，不还原会污染
    };
  }, []);
  return <Card style={{ backgroundColor: '#454545', color: '#27aa5e', whiteSpace: 'pre-wrap' }}
    bodyStyle={{ maxHeight: '75vh', overflow: 'scroll' }}
  >
    {monacoInited && <MonacoEditor
      height={550}
      language="log"
      theme="logTheme"
      editorDidMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        selectOnLineNumbers: true, readOnly: true,
        // 横向滚动条设置1：通过换行保证内容不会超出编辑器，从而省略横向滚动条
        wordWrap: 'on',           // 打开自动换行
        scrollBeyondLastLine: false, // 防止滚动超过最后一行
        horizontalScrollbarSize: 0   // 将横向滚动条的大小设置为0，从而隐藏它
        // 横向滚动条设置2：强制显示滚动条：  
        // scrollbar: { horizontal: "visible" }
      }}
      value={(curLog)}
    />}
  </Card>
}