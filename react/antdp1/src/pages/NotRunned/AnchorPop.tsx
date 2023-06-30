
////锚点菜单
//使用方法：摆按钮：<div style={{marginLeft:-100,marginTop:-50}}>
//<AnchorPop results={aggregations['0']?.data.map(v=>{return {anchor:v.title,title:v.title}})} /></div>
// 然后在需要锚点的<>里加上id属性，

import { Affix, Anchor, BackTop, Button, Card } from "antd";
import { useState } from "react";

const { Link } = Anchor;
const backTopStyle:React.CSSProperties = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};
const AnchorPop:React.FC<{results:any}>=({results})=>{  
    const [visible, setVisible] = useState(false);
    const anchorList=results?.filter(v=>Boolean(v.title)) || []
    return (<div style={{position:"relative",top:-5}}>
        <div style={{position:"absolute",top:40,left:100,zIndex:20}}>
        <Affix offsetTop={10}><div>
          {anchorList.length>0 &&<Button type="primary" onClick={()=>setVisible(v=>!v)}>Quick Links</Button>}
            {visible && <Card style={{height:"80vh",overflow:"scroll"}}>
                <Anchor 
                    onClick={(e)=>{
                        console.log(e)
                        setVisible(false)
                    }} affix={false}>
                    {anchorList.map((result, index)=>{
                        return <Link href={"#"+result.title} title={result.title} key={index}/>
                    })}
                </Anchor>
                </Card>}
            </div>
        </Affix>
        <BackTop><div style={backTopStyle}>Top</div></BackTop>
    </div></div>

    )
  }

export default AnchorPop;