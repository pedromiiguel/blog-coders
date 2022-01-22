import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { Container, ButtonContainer } from './styles';
import 'react-quill/dist/quill.snow.css';
import { InputRow } from 'aws-amplify-react';
import { useNavigate } from 'react-router-dom';

import { Button, withAuthenticator } from '@aws-amplify/ui-react';
import { API, graphqlOperation, Storage, Auth } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { createPost } from '../../graphql/mutations';
import { CreatePostMutation } from '../../API';

type Thumbnail = {
  filename: string;
  file: File;
  fileUrl: string;
};

function Editor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<Thumbnail>();

  const navigate = useNavigate();

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

  const handlePostCreations = async () => {
    if (!thumbnail) return;

    try {
      const { key } = await Storage.put(
        `${thumbnail.filename}_${Date.now()}`,
        thumbnail.file
      );

      const user = await Auth.currentAuthenticatedUser();

      (await API.graphql(
        graphqlOperation(createPost, {
          input: {
            title,
            content,
            thumbnailKey: key,
            authorName: user.attributes.name,
            blogID: String(process.env.REACT_APP_BLOG_ID)
          },
        })
      )) as GraphQLResult<CreatePostMutation>;

      navigate('/posts')
    } catch (error) {}
  };

  const goToHome = () => {
    navigate('/');
  };
  return (
    <Container>
      <ButtonContainer>
        <Button onClick={goToHome}>Voltar aos posts</Button>
        <Button onClick={handlePostCreations}>Salvar post</Button>
      </ButtonContainer>
      {thumbnail && <img src={thumbnail.fileUrl} alt="Capa" />}
      <InputRow
        type="file"
        placeholder="Capa"
        onChange={handleThumbnailChange}
        accept="image/png, image/jpeg"
      />

      <InputRow
        placeholder="Título"
        value={title}
        onChange={handleTitleChange}
      />
      <ReactQuill theme="snow" value={content} onChange={handleContentChange} />
    </Container>
  );
}

export default withAuthenticator(Editor, { socialProviders: ['google'] });
