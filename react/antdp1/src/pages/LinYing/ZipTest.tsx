import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "antd";
import JSZip from 'jszip';
import { request } from 'umi';
import VirtualList from 'react-tiny-virtual-list';

const ZipTest = () => {
  const [imagesData, setImagesData] = useState([]);


  const loadZipFile = async () => {
    try {
      // const urlResult=await request("https://xx/atp/api/v1/task/get_image_download_link",{method:"GET",params:{task_id:587,entity_id:"rrrr"}})
      // const response = await fetch(urlResult.data);
      const response = await fetch("/compress.zip"); //1,gpt用fetch，下载文件，umi的request没有获取blob()的方法？
      const blob=await response.blob()

      const zip = new JSZip();
      const data = await zip.loadAsync(blob); //2，解压压缩文件
      const images = Object.keys(data.files).filter(file =>
        file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".JPG")
      );

      const imagesData = await Promise.all(images.map(async (image) => {
        const content = await data.files[image].async('base64');
        return {
          name: image,
          url: `data:image/png;base64,${content}` //这里注意
        };
      }));

      setImagesData(imagesData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { loadZipFile(); }, []);

  // 定义单个列表项目渲染
  const renderItem = ({index, style}) => (
    <div key={index} style={style}>
        <Image width={200} src={imagesData[index].url} />
        <p>{imagesData[index].name}</p>
    </div>
  );

  return (
  //2， 虚拟滚动，
    <VirtualList width='100%' height={"85vh"} itemCount={imagesData.length}
      itemSize={220} renderItem={renderItem}
    />
  );
};

export default ZipTest;
