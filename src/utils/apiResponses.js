export const sendResponse = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify({ ...data }),
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendSuccessResponse = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify({ success: true, ...data }),
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendError = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({ success: false, error: message }),
  headers: {
    "Content-Type": "application/json",
  },
});
