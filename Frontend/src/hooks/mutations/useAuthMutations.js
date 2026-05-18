import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) =>
      apiClient("/auth/login", { method: "POST", body: { email, password }, noAuth: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, email, password }) =>
      apiClient("/auth/register", { method: "POST", body: { name, email, password }, noAuth: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["saved-events"] });
    },
  });
}
