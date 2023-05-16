import React from 'react';
import { useParams } from 'react-router';

export default function Reading(props) {
  const { id } = useParams();
  return <div> Current Reading: {id} </div>;
}
