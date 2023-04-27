import React from 'react';
import Counter from './counter';
import Controls from './controls';

export default function Welcome(props) {
  return (
    <div>
      Welcome
      <Counter />
      <Controls />
    </div>
  );
}
