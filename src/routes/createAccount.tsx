import styled from "styled-components"

export default function CreateAccout() {
    return (
        <Wrapper>
            <Form>
                <Input name="name" placeholder="Name" type="text" required/>
                <Input name="email" placeholder="Email" type="email" required/>
                <Input name="name" placeholder="Name" type="text" required/>
            </Form>
        </Wrapper>
    )
}


const Wrapper = styled.div``;
const Form = styled.form``;
const Input = styled.input``;