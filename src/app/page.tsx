import ViewPostsPage from "@/features/post/pages/ViewPostsPage";
import { envConfig } from "@/shared/configs/envConfig";

export default function Home() {
  console.log({ envConfig });

  return <ViewPostsPage />;
}
