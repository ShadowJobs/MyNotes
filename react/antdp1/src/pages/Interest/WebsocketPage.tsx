import { useEffect, useState, useRef } from 'react';
import { Input, Button, List, message } from 'antd';
import { WebsocketUrl } from '@/global';

function WebSocketPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // 随机名字
  const myName = useRef(Math.random().toString(36).slice(-6))
  const [to, setTo] = useState('all')
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(WebsocketUrl);
    socketRef.current.onopen = () => {
      console.log('socket connected');
      socketRef.current.send(JSON.stringify({ type: 'login', name: myName.current }))
    }
    socketRef.current.onmessage = (event) => {
      const messageObj = JSON.parse(event.data);
      if (messageObj.type === 'user_list') {
        // 如果是用户列表消息，更新 users 状态
        setUsers(messageObj.users);
      } else if(messageObj.type==='error'){
        console.log(messageObj.message)
        message.error(messageObj.msg)
      }else {
        // 如果是聊天消息，添加到 messages 状态
        const formattedMessage = `${messageObj.from} ${messageObj.to} (${messageObj.timestamp}): ${messageObj.message}`;
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
      // const reader = new FileReader();
      // reader.onload = function () {
      //   const messageObj = JSON.parse(this.result);
      //   if (messageObj.type === 'user_list') {
      //     // 如果是用户列表消息，更新 users 状态
      //     setUsers(messageObj.users);
      //   } else {
      //     const formattedMessage = `${messageObj.from} (${messageObj.timestamp}): ${messageObj.message}`;
      //     setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      //   }
      // };
      // reader.readAsText(event.data);
    };
    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleSend = () => {
    if (socketRef.current && input) {
      const messageObj = { from: myName.current, to, message: input, type: 'message' };
      socketRef.current.send(JSON.stringify(messageObj));
      setInput('');
    }
  };

  return (<>
    <h1>{myName.current} 的聊天</h1>
    <h1>Online users:</h1>打开多个标签，可以聊天<br/>
    {users.map((user) => <span key={user} style={{marginLeft:10}}>{user}</span>)}
    
    <List style={{ minHeight: 200 }} dataSource={messages} renderItem={(item) => <List.Item>{item}</List.Item>} />
    <div style={{ display: "flex" }}>
      To:<Input value={to} onChange={(e) => setTo(e.target.value)} />
      Message:<Input value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={handleSend} />
      <Button onClick={handleSend}>Send</Button>
    </div>
  </>);
}

export default WebSocketPage;
