import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

const authService = {
  getNonce: async (publicKey: string) => {
    const response = await axios.post(`${API_URL}/nonce`, { publicKey });
    return response.data;
  },
  verifySignature: async (publicKey: string, signature: string) => {
    const response = await axios.post(`${API_URL}/verify`, { publicKey, signature });
    return response.data.token;
  },
};

export default authService;
