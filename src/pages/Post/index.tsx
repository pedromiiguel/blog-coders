import { Button } from '@aws-amplify/ui-react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetPostQuery } from '../../API';
import { getPost } from '../../graphql/queries';
import { ButtonContainer, Container } from './styles';
import { GraphQLResult } from '@aws-amplify/api-graphql';

const sanitize = DOMPurify.sanitize;

function Post() {
  const params = useParams();
  const [post, setPost] = useState<GetPostQuery['getPost']>();
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPost() {
      const { data } = (await API.graphql(
        graphqlOperation(getPost, { id: params.id })
      )) as GraphQLResult<GetPostQuery>;

      if (data?.getPost?.thumbnailKey) {
        const thumbnail = await Storage.get(data?.getPost?.thumbnailKey);
        console.log(thumbnail)
        setThumbnailUrl(thumbnail);
      }

      setPost(data?.getPost);
    }
    loadPost();
  }, [params.id]);

  const goToHome = () => {
    navigate('/');
  };

  const goToPostCreation = () => {
    navigate('/new-post');
  };
  return (
    <Container>
      <ButtonContainer>
        <Button onClick={goToHome}>Voltar aos posts</Button>
        <Button onClick={goToPostCreation}>Criar post</Button>
      </ButtonContainer>
      {thumbnailUrl && <img src={thumbnailUrl} alt="Capa" />}
      <h1>{post?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitize(post?.content || '') }} />
    </Container>
  );
}

export default Post;
