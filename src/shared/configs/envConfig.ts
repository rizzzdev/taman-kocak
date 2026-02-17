const env = process.env.NEXT_PUBLIC_ENV;
const devApiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;
const prodApiUrl = process.env.NEXT_PUBLIC_PROD_API_URL;
const imageHostingUrl = process.env.NEXT_PUBLIC_IMAGE_HOSTING_URL;

export const envConfig = {
  env,
  apiUrl: env === "dev" ? devApiUrl : prodApiUrl,
  imageHostingUrl,
};
