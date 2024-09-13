import create from 'zustand';

export const useAuthStore = create((set)=>({
    auth: {
        username: '',
        active:false
    },
    setUserName: (name) => set((state)=>({auth : {...state.auth,username:name}}))
}))