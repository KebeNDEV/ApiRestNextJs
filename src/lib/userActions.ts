interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const updateUser = async (data: User) => {
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteUser = async (id: string) => {
  const response = await fetch('/api/users', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id })
  });
  return response.json();
};
