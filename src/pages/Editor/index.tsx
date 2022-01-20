import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Container } from './styles';
import 'react-quill/dist/quill.snow.css';
import { InputRow } from 'aws-amplify-react';

type Thumbnail = {
  filename: string;
  file: File;
  fileUrl: string;
};

function Editor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<Thumbnail>();

  const handleContentChange = (text: string) => {
    setContent(text);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0) return;

    const file = e.target.files![0];

    setThumbnail({
      file,
      filename: file.name,
      fileUrl: URL.createObjectURL(file),
    });
  };

  return (
    <Container>
      <img src={thumbnail?.fileUrl} alt="Capa" />
      <InputRow placeholder="Capa" onChange={handleThumbnailChange} />

      <InputRow
        placeholder="Título"
        value={title}
        onChange={handleTitleChange}
      />
      <ReactQuill theme="snow" value={content} onChange={handleContentChange} />
    </Container>
  );
}

export default Editor;
