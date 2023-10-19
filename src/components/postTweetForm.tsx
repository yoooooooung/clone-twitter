import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    } else {
      // 처리안함?
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    // 유저가 로그인했지 않거나
    // 아직 로딩중이거나
    // 트위터 내용이 아무것도 없거나
    // 트위터 내용 길이가 180이상일 땐 함수실행 x 종료
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setIsLoading(true);
      /** Firebase에 데이터를 보내기
       * Firebase SDK에 포함된 addDoc 함수
       * 새로운 documnet를 생성
       * addDoc(collection(Friestore 인스턴스(=db), 'collectoin이름'), {추가하고 싶은 데이터})
       */
      await addDoc(collection(db, "tweet"), {
        tweet, // tweet : tweet 이랑 같은 뜻인듯
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <From onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        placeholder="What is Happening?"
        onChange={onChange}
        value={tweet}
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo Added ☑" : "Add Photo"}
      </AttachFileButton>
      <AttachFileInput
        type="file"
        id="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </From>
  );
}
const From = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;

  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
