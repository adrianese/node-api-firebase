export const errorHandler = (error, req, res, next) => {
  if (error.status >= 400 && error.status < 500) {
    const message = error.type === "entity.parse.failed"
      ? "JSON inválido"
      : "Solicitud inválida";
    return res.status(error.status).json({ message });
  }

  console.error("Error interno:", error);
  return res.status(500).json({ message: "Error interno del servidor" });
};
