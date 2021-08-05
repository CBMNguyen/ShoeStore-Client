const { useState } = require("react");

const useModel = () => {
  const [model, setmodel] = useState({ data: null, show: false });

  const showModel = (data) => {
    setmodel({ data, show: true });
  };

  const closeModel = () => {
    setmodel({ data: null, show: false });
  };

  return { model, showModel, closeModel };
};

export default useModel;
