import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, message, Typography } from 'antd';

import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';
import { CopyOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const AggregationShare: React.FC<{ node: Node; path?: string }> = ({ node, path }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imgData, setImgData] = useState<string>();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImgData(undefined);
  };

  useEffect(() => {
    if (isModalVisible && node) {
      domtoimage
        .toPng(node)
        .then((dataUrl) => {
          setImgData(dataUrl);
        })
        .catch((error) => {
          message.error(`${("errr")}： ${error}`);
        });
    }
  }, [isModalVisible, node]);

  const handlePNGDownload = () => {
    try {
      if (!imgData) {
        throw Error(('errr')+'!');
      }
      const link = document.createElement('a');
      link.download = 'Report.png';
      link.href = imgData;
      link.click();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handlePDFDownload = () => {
    try {
      if (!imgData) {
        throw Error(('err')+'!');
      }
      const doc = new jsPDF();
      const imgProps = doc.getImageProperties(imgData);

      const pdfHeight = doc.internal.pageSize.getHeight();
      const pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
      const marginX = Math.abs(doc.internal.pageSize.getWidth() - pdfWidth) / 2;

      doc.addImage(imgData, 'PNG', marginX, 0, pdfWidth, pdfHeight);
      doc.save('Report.pdf');
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        <ShareAltOutlined /> Share
      </Button>
      <Modal title={"Report Preview"} visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {path && (
            <Text
              copyable={{
                icon: (
                  <Link>
                    <CopyOutlined /> CopyLink
                  </Link>
                ),
                text: window.location.origin + path,
              }}
              style={{ marginRight: '1rem' }}
            />
          )}
          <Button
            type="primary"
            style={{ margin: 8 }}
            onClick={() => handlePNGDownload()}
            disabled={!imgData}
          >
            <DownloadOutlined /> PNG
          </Button>
          <Button
            type="primary"
            style={{ margin: 8 }}
            onClick={() => handlePDFDownload()}
            disabled={!imgData}
          >
            <DownloadOutlined /> PDF
          </Button>
        </div>
        <Image src={imgData} />
      </Modal>
    </>
  );
};

export default AggregationShare;
