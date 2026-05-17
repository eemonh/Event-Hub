export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch((err) => {
      console.log("asyncHandler caught error:", err.message);
      if (typeof next === "function") {
        next(err);
      } else {
        res.status(500).json({ message: err.message });
      }
    });
  };
}