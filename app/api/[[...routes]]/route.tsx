/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Participant } from "../../utils/interface";
import {
  getUserDisplayName,
  getUserPfpUrl,
  getUser,
  postLum0xTestFrameValidation,
} from "../../utils/helpers";
import { getShareImage } from "../../ui/share";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY ?? "" }),
  title: "Raffle among your fans",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 800,
    width: 800,
  },
  initialState: {
    channel: "",
    startDate: "",
    limit: 25,
  },
});

app.frame("/", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "app");

  return c.res({
    image: "/Default.png",
    intents: [<Button action="/channel">Setting</Button>],
  });
});

app.frame("/channel", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "channel");

  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter channel" />,
      <Button action="/">Back</Button>,
      <Button action="/start-date">Next</Button>,
    ],
  });
});

app.frame("/start-date", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "start-date");

  c.deriveState((previousState: any) => {
    previousState.channel = c.inputText;
  });

  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter Start Date... 2024-09-01" />,
      <Button action="/channel">Back</Button>,
      <Button action="/limit">Next</Button>,
    ],
  });
});

app.frame("/limit", async (c) => {
  const fid = c.frameData?.fid;
  await postLum0xTestFrameValidation(Number(fid), "limit");

  c.deriveState((previousState: any) => {
    previousState.endDate = c.inputText;
  });

  return c.res({
    image: "/Steps.png",
    intents: [
      <TextInput placeholder="Enter limit... default: 25" />,
      <Button action="/end-date">Back</Button>,
      <Button action="/raffle">Next</Button>,
    ],
  });
});

app.frame("/raffle", (c) => {
  c.deriveState((previousState: any) => {
    previousState.limit = parseInt(c.inputText ? c.inputText : "25", 10);
  });

  return c.res({
    image: "/Default.png",
    intents: [
      <Button action="/limit">Back</Button>,
      <Button action="/result">Raffle!</Button>,
    ],
  });
});

app.frame("/result", async (c: any) => {
  const { channel, startDate, limit } = c.previousState;
  const winner: Participant = await getUser(channel, startDate, limit);
  const displayName = await getUserDisplayName(winner.fid);
  const pfpUrl = await getUserPfpUrl(winner.fid);

  return c.res({
    image: getShareImage(displayName, pfpUrl),
    intents: [<Button action="/">Home</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
