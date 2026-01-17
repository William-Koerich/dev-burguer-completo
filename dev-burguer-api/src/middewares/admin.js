
const adminMiddleware = async (request, response, next) => {
  // LINHA CRÍTICA: Declaração de authHeader
  const isUserAdmin = request.userIsAdmin;
  let token = null;

  // 1. Verificação de cabeçalho ausente
  if (!isUserAdmin) {
    return response.status(401).json();
  }


    return next();

 
};

export default adminMiddleware;
