import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
      const doc = await addDoc(collection(db, "tweets"), {
        tweet, // tweet : tweet 이랑 같은 뜻인듯
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      // 만약 파일까지 첨부했다면
      if (file) {
        // 해당 파일 참조 위치를 받아야함
        // ref(storage인스턴스, 파일이 저장될 URL)
        // tweets라는 폴더내에 각자의 userid 안에 트윗id 안에 저장하기
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        // uploadByte(어디에 저장할지, 저장할 파일)
        // uploadByte는 promise를 반환.
        // 반환되는 값(업로드 결과 참조값)을 저장해서
        const result = await uploadBytes(locationRef, file);
        // 파라미터로 받은 데이터를 URL로 반환
        const url = await getDownloadURL(result.ref);
        // 데이터(document) 업데이트함수(어떤 데이터, 추가할 데이터)
        await updateDoc(doc, {
          photo: url,
        });
      }
      // DB에 저장 후 textarea 리셋
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <From onSubmit={onSubmit}>
      <TextArea
        required
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
