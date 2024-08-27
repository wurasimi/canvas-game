import Head from "next/head";
import Image from "next/image";
import Board from "@/components/board";
import Score from "@/components/score";
import styles from "@/styles/index.module.css";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";
import { useEffect } from "react";

export default function Home() {
  //is iframed

  useEffect(function onFirstMount() {
    if (window.self !== window.top) {
      const canvasClient = new CanvasClient();
    }
  }, []); // empty dependencies array means "run this once on first mount"

  return (
    <div className={styles.twenty48}>
      <Head>
        <title>Play 2048</title>
        <meta
          name="description"
          content="Canvas 2048."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicon16.png" />
        <meta property="og:image" content="/cover.png" />
        <meta property="dscvr:canvas:version" content="vNext" />
      </Head>
      <header>
        <h1>2048</h1>
        <Score />
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}
