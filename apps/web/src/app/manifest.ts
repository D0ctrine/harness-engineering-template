import type { MetadataRoute } from "next";
import { runtimeConfig } from "../lib/runtime-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: runtimeConfig.appName,
    short_name: runtimeConfig.appShortName,
    description: runtimeConfig.appDescription,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4efe4",
    theme_color: "#0f7668",
    icons: [
      {
        src: "/icons/juyaro-mark.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    shortcuts: [
      {
        name: "오늘의 큐티",
        short_name: "읽기",
        description: "설치된 앱 화면에서 오늘의 읽기 홈을 바로 엽니다.",
        url: "/app#today-reading"
      },
      {
        name: "묵상 단계",
        short_name: "묵상",
        description: "읽기 흐름 안의 묵상 섹션으로 바로 이동합니다.",
        url: "/app#reflection-step"
      },
      {
        name: "메모 쓰기",
        short_name: "메모",
        description: "앱 화면 안의 메모 작업 영역을 바로 엽니다.",
        url: "/app#note-workspace"
      },
      {
        name: "앱 홈 열기",
        short_name: "홈",
        description: "설치형 읽기 워크스페이스 홈을 엽니다.",
        url: "/app"
      }
    ]
  };
}
