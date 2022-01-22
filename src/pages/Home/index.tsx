import React, { useEffect, useState } from 'react';
import {
  ButtonContainer,
  Container,
  HighlightPost,
  Post,
  PostsContainer,
  TitleBlog,
} from './styles';
import { GetBlogQuery } from '../../API';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getBlog } from '../../graphql/queries';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [blog, setBlog] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBlog() {
      const { data } = (await API.graphql(
        graphqlOperation(getBlog, { id: String(process.env.REACT_APP_BLOG_ID) })
      )) as GraphQLResult<GetBlogQuery>;

      async function getThumbnail(item: any) {
        const thumbnail = await Storage.get(item.thumbnailKey!);
        return thumbnail;
      }
      if (data?.getBlog?.posts?.items) {
        const dataWithThumbnail = data?.getBlog?.posts?.items.map(
          async (item) => {
            const response = await getThumbnail(item);

            return {
              ...item,
              thumbnailUrl: response,
            };
          }
        );
        (async () => {
          const resultado = await Promise.all(dataWithThumbnail);
          console.log(resultado);
          setBlog({ ...data?.getBlog, posts: resultado });
        })();
      }
    }

    loadBlog();
  }, []);

  console.log(blog);
  const goToHome = () => {
    navigate('/');
  };

  const goToPostCreation = () => {
    navigate('/new-post');
  };

  const goToPostData = (id: string) => {
    navigate(`/post/${id}`);
  }

  const [firstPost, ...posts] = blog?.posts || [];

  return (
    <Container>
      <ButtonContainer>
        <Button onClick={goToHome}>Voltar aos posts</Button>
        <Button onClick={goToPostCreation}>Criar post</Button>
      </ButtonContainer>
      <TitleBlog>{blog?.name}</TitleBlog>
      <HighlightPost></HighlightPost>
      <PostsContainer >
        {posts.map((post: any) => (
          <Post key={`Home-Post-${post.id}`} onClick={() => goToPostData(post.id)}>
            <img src={post.thumbnailUrl} alt={post.title} />
            <h1>{post.title}</h1>
          </Post>
        ))}
      </PostsContainer>
    </Container>
  );
}

export default Home;
