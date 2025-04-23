import { api as axios } from "@/plugins/axios";
import { UpdateUserPayload, User } from "@repo/entities/user";

async function fetchUsers() {
  return axios.get<User[]>(`/api/user/fetch-user-data`);
}
async function fetchUser(uid: string) {
  return axios.get<User>(`/api/user/fetch-user-data/${uid}`);
}

async function updateUser(payload: UpdateUserPayload) {
  return axios.put<User>(`/api/user/update-user-data/${payload.uid}`, payload);
}

export { fetchUsers, fetchUser, updateUser };
