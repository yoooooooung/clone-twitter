import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreateAccout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로딩중이거나, 이름/이메일/비번 중 하나라도 빈값으로 온다면 아래 로직으로 안가도록 처리
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setIsLoading(true);
      // 1. 계정을 만듬
      // 성공하게 되면 자격증명을 받게 됨
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      // 2. 계정 이름 설정
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // 3. 홈페이지로 리다이렉트
      navigate("/");
    } catch (e) {
      // setError()
    } finally {
      setIsLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          onChange={onChange}
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error != "" ? <Error>error</Error> : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;
const Title = styled.h2`
  font-size: 42px;
`;
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;
