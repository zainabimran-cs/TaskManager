import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

// Task ke saath user ki email bhi save karo.

// Is ke liye ek chhota sa raasta zaroori hai. Backend ko login ki settings chahiye taake wo pooch sake “kaun login hai?”. Is liye settings ko ek alag file mein rakhna padta hai. Yeh Next.js ka rule hai, isse aasan tareeqa nahi.