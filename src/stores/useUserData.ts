import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  desired_pension_amount: number;
  age: number;
  gender: "male" | "female";
  current_salary: number;
  konto_zus: number;
  subkonto_zus: number;
}

interface UserDataStore {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
}

const initialUserData: UserData = {
  desired_pension_amount: 5000,
  age: 35,
  gender: "male",
  current_salary: 8000,
  konto_zus: 508432.67,
  subkonto_zus: 111567.33,
};

const useUserData = create<UserDataStore>()(
  persist(
    (set) => ({
      userData: initialUserData,
      setUserData: (data) => {
        console.log('setUserData called with:', data);
        set((state) => {
          const newState = { userData: { ...state.userData, ...data } };
          console.log('old state:', state.userData);
          console.log('new state:', newState.userData);
          return newState;
        });
      },
      resetUserData: () => set({ userData: initialUserData }),
    }),
    {
      name: 'user-data-storage',
    }
  )
);

export default useUserData;