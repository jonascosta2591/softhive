

// ----------------------------------------------------------------------

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    localStorage.removeItem('token')

    location.href = './sign-in'
  }, [])

  return (
    <>
      <title>Saindo...</title>

      <p>Saindo...</p>
    </>
  );
}
