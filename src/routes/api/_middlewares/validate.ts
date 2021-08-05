export default function _validate(validators: boolean[], callback: () => any) {
  const hasError = validators.some((bool) => !bool);
  if (hasError)
    return {
      status: 400,
      body: "The request body is malformed",
    };

  return callback();
}
