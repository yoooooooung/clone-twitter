import styled from "styled-components";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./tweet";

// 어떤 타입으로 받아오는지 interface로 정의
export interface ITweet {
  id: string;
  photo: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      // 어떤 트윗을 원하느지에 대한 쿼리 생성
      collection(db, "tweet"),
      orderBy("createdAt", "desc") // createdAt을 기준으로 내림차순정렬
    );
    const snapshot = await getDocs(tweetsQuery);
    // ❓ 배열의tweet에 어떻게 push하고 있는 거지?
    const tweetsList = snapshot.docs.map((doc) => {
      // console.log(doc.data());
      // doc.data 내부의 속성들 들고오기
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        // id는 db에서 안보임
        id: doc.id,
      };
    });
    setTweets(tweetsList);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      {tweets.map((t) => (
        <Tweet key={t.id} {...t} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div``;
