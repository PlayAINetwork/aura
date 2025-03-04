import { ethers } from "ethers";

export async function generateKoalaImage(prompt: string) {
  const account = ethers.Wallet.createRandom();

  console.log(account.address);

  await fetch("https://art.koalaai.vip/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountAddress: account.address,
    }),
  });

  const res = await fetch("https://art.koalaai.vip/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      accountAddress: account.address,
    }),
  });
  return res.json();
  //  `Generate a meme that should picture a koala saying "Let 's Kooo" refering to the term "Let's go". The meme should have a retro and vintage atmosphere Based on this description and the atmosphere you have to understand the intent of the meme`,
  // {
  //     imageUrl: "https://koala-ai.s3.tebi.io/generated-images/0xcdc2CB5679f95FEFE66EaDD9FD5dfDA7d0D7e89a/generated-image-2025-03-04T23%3A42%3A21.587Z.png",
  //     originalImageUrl: "https://koala-ai.s3.tebi.io/generated-images/0xcdc2CB5679f95FEFE66EaDD9FD5dfDA7d0D7e89a/original-image-2025-03-04T23%3A42%3A18.942Z.png",
  // }
}
