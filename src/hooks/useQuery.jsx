const { useMemo } = require("react");
const { useLocation } = require("react-router-dom");

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default useQuery;
