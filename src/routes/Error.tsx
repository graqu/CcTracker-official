import { useRouteError, isRouteErrorResponse } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {isRouteErrorResponse(error) && (
        <div>
          <p>{error.statusText}</p>
          <p>{error.status}</p>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
