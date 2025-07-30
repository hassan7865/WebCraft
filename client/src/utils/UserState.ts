interface User {
  username: string;
  email: string;
  _id: string;
}

const STORAGE_KEY = "web_craft_user_data";

const SetUserData = (userData: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
};

const GetUserData = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as User;
  } catch (error) {
    console.error("Failed to parse user data from localStorage", error);
    return null;
  }
};

const UpdateUserData = (updatedFields: Partial<User>): void => {
  const currentUserData = localStorage.getItem(STORAGE_KEY);
  if (!currentUserData) return;

  try {
    const parsed: User = JSON.parse(currentUserData);
    const updatedUser: User = {
      ...parsed,
      ...updatedFields,
    };
    SetUserData(updatedUser);
  } catch (error) {
    console.error("Failed to update user data", error);
  }
};

const DeleteUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export default {
  SetUserData,
  GetUserData,
  UpdateUserData,
  DeleteUser,
};
