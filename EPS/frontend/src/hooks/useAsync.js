import { useEffect } from 'react';

export const useAsync = (
  asyncFn,
  successFunction,
  returnFunction,
  dependencies = []
) => {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((result) => {
      if (isActive) successFunction(result.data);
    });
    return () => {
      returnFunction && returnFunction();
      isActive = false;
    };
  }, dependencies);
};
