import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.BASE_URL || "http://localhost:3000"}/api`
  );
  return {
    other: frameTags,
  };
}

export default function Home() {
  return (
    <>
      <div>
        This Frame enables you to conduct a raffle among your Farcaster fans
      </div>
    </>
  );
}
