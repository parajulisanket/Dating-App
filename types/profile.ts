export interface ProfilePicture {
  url: string;
}

export interface ProfileImage {
  id: number;
  url: string;
}

export interface SocialLink {
  id: number;
  platform: "facebook" | "instagram";
  username: string;
}

export interface ProfileFormData {
  profilePicture: ProfilePicture;
  images: ProfileImage[];
  bio: string;
  interestedIn: string;
  sexualOrientation: string;
  hobbies: string[];
  socialLinks: SocialLink[];
}
