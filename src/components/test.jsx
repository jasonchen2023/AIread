import React from 'react';
import { useParams } from 'react-router';

export default function Test(props) {
  const { id } = useParams();
  return <div>ID: {id}</div>;
}
