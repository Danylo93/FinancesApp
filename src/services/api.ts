const API_URL = 'http://192.168.100.7:3000/api/auth'; // Atualize para a URL correta do seu servidor

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao registrar usuário');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao fazer login');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};
