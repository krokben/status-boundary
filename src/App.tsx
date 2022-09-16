import { useState, useEffect, ReactNode } from "react";
import "./App.css";

enum Status {
  Idle,
  Fetching,
  Success,
  Error,
}

enum ErrorMessage {
  Unauthorized,
  Server,
}

const errorMessage: Record<ErrorMessage, string> = {
  [ErrorMessage.Unauthorized]: "Couldn't fetch because not authorized.",
  [ErrorMessage.Server]: "Server error occurred.",
};

const fetchResources = async () => {
  try {
    const response = await fetch("https://swapi.dev/api");
    const resources = await response.json();

    if (response.status !== 200) {
      return {
        fetchedStatus: Status.Error,
        fetchedError: ErrorMessage.Unauthorized,
      };
    }

    return {
      fetchedResources: Object.keys(resources),
      fetchedStatus: Status.Success,
    };
  } catch (error) {
    console.error(error);
    return { fetchedStatus: Status.Error, fetchedError: ErrorMessage.Server };
  }
};

const StatusBoundary = ({
  children,
  status,
  error,
}: {
  children: ReactNode;
  status: Status;
  error: ErrorMessage;
}) =>
  status === Status.Idle ? (
    <></>
  ) : status === Status.Fetching ? (
    <p>Fetching data...</p>
  ) : status === Status.Error ? (
    <p>{errorMessage[error]}</p>
  ) : (
    <>{children}</>
  );

function App() {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.Server);
  const [resources, setResources] = useState<string[]>([]);

  useEffect(() => {
    const fetchAndSetResources = async () => {
      const { fetchedResources, fetchedStatus, fetchedError } =
        await fetchResources();

      if (fetchedError) {
        setError(fetchedError);
        setStatus(fetchedStatus);
        return;
      }

      if (fetchedResources) {
        setResources(fetchedResources);
        setStatus(fetchedStatus);
      }
    };
    fetchAndSetResources();
  }, []);

  return (
    <div className="App">
      <h1>Star Wars</h1>
      <StatusBoundary status={status} error={error}>
        <ul>
          {resources.map((resource) => (
            <li key={resource}>{resource}</li>
          ))}
        </ul>
      </StatusBoundary>
    </div>
  );
}

export default App;
