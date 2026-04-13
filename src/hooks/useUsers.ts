import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toast';

export const useUsers = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
  };

  const useUsersQuery = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });
  };

  const addUserMutation = useMutation({
    mutationFn: async (user: Omit<User, 'id'>) => {
      const response = await api.post('/users', user);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Usuário adicionado com sucesso!', 'success');
    },
    onError: (error: any) => {
      console.error('Failed to add user', error);
      showToast('Erro ao adicionar usuário.', 'error');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, user }: { id: number; user: Partial<User> }) => {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Usuário atualizado com sucesso!', 'success');
    },
    onError: (error: any) => {
      console.error('Failed to update user', error);
      showToast('Erro ao atualizar usuário.', 'error');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Usuário excluído com sucesso!', 'success');
    },
    onError: (error: any) => {
      console.error('Failed to delete user', error);
      showToast('Erro ao excluir usuário.', 'error');
    },
  });

  return {
    useUsersQuery,
    addUserMutation,
    updateUserMutation,
    deleteUserMutation,
  };
};
