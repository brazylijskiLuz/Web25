import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  desired_pension_amount: number;
  age: number;
  gender: "male" | "female";
  current_salary: number;
  konto_zus: number;
  subkonto_zus: number;
  rok_rozpoczecia_pracy: number;
  rok_przejscia_na_emeryture: number;
  kod_pocztowy: string;
}

interface UserDataStore {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
}

const initialUserData: UserData = {
  desired_pension_amount: 0,
  age: 0,
  gender: "male",
  current_salary: 0,
  konto_zus: 0,
  subkonto_zus: 0,
  rok_rozpoczecia_pracy: 0,
  rok_przejscia_na_emeryture: 0,
  kod_pocztowy: "",
};

const useUserData = create<UserDataStore>()(
  persist(
    (set) => ({
      userData: initialUserData,
      setUserData: (data) => {
        console.log("setUserData called with:", data);
        set((state) => {
          const newState = { userData: { ...state.userData, ...data } };
          console.log("old state:", state.userData);
          console.log("new state:", newState.userData);
          return newState;
        });
      },
      resetUserData: () => set({ userData: initialUserData }),
    }),
    {
      name: "user-data-storage",
    }
  )
);

export default useUserData;
