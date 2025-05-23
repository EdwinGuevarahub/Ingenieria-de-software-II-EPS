export async function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error('Error al decodificar token:', e);
    return null;
  }
}