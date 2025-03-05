import { Lum0x } from "lum0x-sdk";

Lum0x.init(process.env.LUM0X_API_KEY || "");

export async function getUserPfpUrl(fid: number): Promise<string> {
  const res = await Lum0x.farcasterUser.getUserByFids({ fids: String(fid) });
  const user = res.users[0];
  return user.pfp_url;
}

export async function getUserDisplayName(fid: number): Promise<string> {
  const res = await Lum0x.farcasterUser.getUserByFids({ fids: String(fid) });
  const user = res.users[0];
  return user.display_name;
}

export async function postLum0xTestFrameValidation(fid: number, path: string) {
  fetch("https://testnetapi.lum0x.com/frame/validation", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      farcasterFid: fid,
      frameUrl: `${process.env.BASE_URL}/api/${path}`,
    }),
  });
}

export async function getUser(
  channel: string | undefined,
  startDate: string | undefined,
  limit: number | undefined
) {
  let res = await Lum0x.farcasterFeed.getFeed({
    feed_type: "filter",
    filter_type: "channel_id",
    channel_id: channel,
    limit: limit,
  });

  let startDateUnix = startDate && new Date(startDate).getTime();
  let filteredCasts = res.casts.filter(
    (cast: { timestamp: number }) =>
      Number(startDateUnix) < new Date(cast.timestamp).getTime()
  );

  if (filteredCasts.length === 0) {
    return { fid: 1, display_name: "" };
  }

  let authors = filteredCasts.map((cast: any) => cast.author.fid);
  let authorSet: Set<any> = new Set(authors);

  const authorList = Array.from(authorSet);
  const randomArray = authorList.sort(() => Math.random() - 0.5);
  const displayName = await getUserDisplayName(randomArray[0]);

  return { fid: randomArray[0], display_name: displayName };
}
