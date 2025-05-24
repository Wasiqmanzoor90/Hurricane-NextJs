export const resHandler = (statusCode, message, payload = null) => {
    return new Response(
      JSON.stringify({ message, payload }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  };
  