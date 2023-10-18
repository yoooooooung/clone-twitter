import styled from "styled-components";
import PostTweetForm from "../components/postTweetForm";

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm></PostTweetForm>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
