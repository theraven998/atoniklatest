import { create } from "zustand";

type profilePhotoStore = {
    profilePhoto: string;
    setProfilePhoto: (photo: string) => void;
    isPromoter: boolean;
    setIsPromoter: (isPromoter: boolean) => void;
};

export const useProfilePhotoStore = create<profilePhotoStore>((set) => ({
    profilePhoto: "",
    setProfilePhoto: (photo: string) => set({ profilePhoto: photo }),
    isPromoter: false,
    setIsPromoter: (isPromoter: boolean) => set({ isPromoter: isPromoter }),
}));
