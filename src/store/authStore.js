import { create } from 'zustand'

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('accessToken') || null,

    login: (userData, token) => {
        localStorage.setItem('accessToken', token)
        localStorage.setItem('user', JSON.stringify(userData))
        set({ user: userData, token })
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        set({ user: null, token: null })
    },
}))

export default useAuthStore