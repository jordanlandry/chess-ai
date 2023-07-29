import { AUDIO_PATH } from "../constants/paths";

type AudioFiles = "capture" | "move" | "clock-low" | "lose" | "win";

export default function playAudio(audioName: AudioFiles, volume = 1) {
  const audio = new Audio(`${AUDIO_PATH}/${audioName}.mp3`);
  audio.volume = volume;
  audio.play();
}
