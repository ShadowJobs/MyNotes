
//----------------------------
//确认框的函数式写法：
import confirm from 'antd/lib/modal/confirm';
const showConfirm = async (id:any) => {
    confirm({
      title: '确认删除？',
      icon: <ExclamationCircleOutlined />,
      content: '删除id:'+id,
      onOk:async ()=>{
        // generateRestrictToken();
        await deleteModel(id);await getData()
      },
      onCancel() {},
    });
  };
<Button type='link' onClick={async ()=>{await showConfirm(row.id)}}>Delete</Button>
//----------------------------
