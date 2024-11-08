import React, { useState, useRef, useCallback, useEffect } from 'react';
import './avarta.css';
import { Button, message, Progress } from 'antd';
import { SyncOutlined, UploadOutlined } from '@ant-design/icons';
import { request, useModel } from 'umi';
import { PythonUrl } from '@/global';
import { Chunk, getFileChunks, getFileMd5 } from '@/utils';

const BigFileUpload: React.FC<{}> = ({ }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const { initialState } = useModel('@@initialState');
  const user_id = initialState?.currentUser?.userid;
  // 已经上传的文件片段
  const [localChunks, setLocalChunks] = useState<{ blob: Blob, progress: number, finished: boolean }[]>([]);

  const syncChunks = async () => {
    const res = await request(`${PythonUrl}/file-trans/bigfile/lastuploadinfo`, {
      method: 'GET',
      params: { user_id }
    })
    if (res.data) {
      const { chunks, finished } = res.data;
      if (!finished) {
        const newChunks = chunks.map((v: any, index: number) => ({ blob: null, progress: v == 1 ? 100 : 0, finished: v == 1 }));
        setLocalChunks(newChunks);
      }
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
    console.log(file);
    console.log(file?.slice(0, 5));

    const chunkSize = 5 * 1025 * 1024;
    const chunks: Chunk[] = getFileChunks(file, chunkSize);
    if (localChunks.length > 0) {
      chunks.forEach((v, idx) => {
        v.progress = localChunks[idx]?.progress || 0;
        v.finished = localChunks[idx]?.finished || false;
      })
    }
    setLocalChunks(chunks);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file)
  };

  const openFileDialog = () => fileInputRef.current?.click()

  useEffect(() => {
    syncChunks()
  }, [])

  const uploadChunk = async (chunks: Chunk[], index: number, md5: string) => {
    const chunk: Chunk = chunks[index];
    const formData = new FormData();
    formData.append('file', chunk.blob, selectedFile!.name);
    formData.append('user_id', user_id!);
    formData.append('md5', md5);
    formData.append('index', index.toString());
    formData.append('chunk_num', chunks.length.toString());
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${PythonUrl}/file-trans/bigfile/upload-chunk`, true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && localChunks[index]) {
          const percent = Math.round((e.loaded / e.total) * 100);
          const newChunks = [...localChunks];
          newChunks[index].progress = percent;
          setLocalChunks(newChunks);
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200 && localChunks[index]) {

          // 返回如果有 finished==1，说明所有的片段都上传完了
          const res = JSON.parse(xhr.responseText);
          if (res?.finished) {
            message.success('上传成功');
            setLocalChunks([]);
          } else {
            const newChunks = [...localChunks];
            newChunks[index].finished = true;
            newChunks[index].progress = 100;
            setLocalChunks(newChunks);
          }
        }
      };
      xhr.send(formData);
    } catch (e) {
      console.error('Error uploading avatar:', e);
    }
  }
  const handleUpdate = async () => {
    if (!selectedFile) {
      message.error('请选择文件');
      return;
    }

    let md5 = await getFileMd5(selectedFile);
    console.log(md5);
    for (let i = 0; i < localChunks.length; i++) {
      if (!localChunks[i].finished) uploadChunk(localChunks, i, md5);
    }
  };
  return (
    <div>
      <h1>大文件断点上传下载</h1>
      <div style={{ margin: "0 auto ", width: 300, height: 100 }}>
        <div className="drop-zone" ref={dropZoneRef} style={{ width: 300, height: 100 }}
          onClick={() => !selectedFile && openFileDialog()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile ? <div>{selectedFile.name}</div> : <p>点击或拖拽文件到此处上传</p>}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect}
            accept="*/*"
            style={{ display: 'none' }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Button icon={<SyncOutlined />} type="text" onClick={openFileDialog} disabled={!selectedFile}>
            重新选择
          </Button>
          <Button icon={<UploadOutlined />} type="primary" disabled={!selectedFile} onClick={handleUpdate}>上传</Button>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        {localChunks.map((v, idx) => <div style={{ margin: "0 auto" }} key={idx}>
          <span>片段{idx}</span>
          <span style={{ display: "inline-block", width: 300 }}><Progress type="line" percent={v.progress} width={80} /></span>
        </div>)}
      </div>
    </div>
  );
};


export default BigFileUpload;