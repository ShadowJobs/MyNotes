import { useEffect, useState } from 'react';
import { Card } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/esm/vs/language/json/monaco.contribution'
import * as monaco from 'monaco-editor';
import { logLanguage, logTheme } from './monaco-theme';

export const LogCard = ({ curLog }) => {
  const [monacoInited, setMonacoInited] = useState(false);
  useEffect(() => {
    // Register the custom language
    monaco.languages.register({ id: 'log' });
    monaco.languages.setMonarchTokensProvider('log', logLanguage);

    monaco.editor.defineTheme('logTheme', logTheme);
    setMonacoInited(true);
  }, []);
  return <Card style={{ backgroundColor: '#454545', color: '#27aa5e', whiteSpace: 'pre-wrap' }}
    bodyStyle={{ maxHeight: '75vh', overflow: 'scroll' }}
  >
    {monacoInited && <MonacoEditor
      height={550}
      language="log"
      theme="logTheme"
      options={{ selectOnLineNumbers: true, readOnly: true }}
      value={(curLog)}
    />}
  </Card>
}