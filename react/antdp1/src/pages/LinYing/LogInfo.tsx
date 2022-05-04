
import { Card, Space } from 'antd';
import React from 'react';


const LogInfo: React.FC = () => {
    return <Space direction="vertical">
        <Card style={{ backgroundColor: '#454545', color: '#27aa5e', whiteSpace: 'pre-wrap', }}
        //保留换行符whiteSpace
            bodyStyle={{ maxHeight: '65vh', overflow: 'scroll' }}
        >
            <Space>{"asjdlf\nfjalsjd;f\nafsdlfkssksss"}</Space>
        </Card>
    </Space>
}

export default LogInfo