import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  margin: 5px 0;
  padding: 8px;
`;

const BookingDetailsStage = ({
  name,
  email,
  phone,
  comment,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onCommentChange,
  onPrevious,
  onSubmit,
}) => {
  return (
    <Wrapper>
      <h3>Enter Your Details</h3>
      <Input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="Phone (optional)"
      />
      <Input
        type="text"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Comment (optional)"
      />
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onSubmit}>Submit</button>
    </Wrapper>
  );
};

export default BookingDetailsStage;
