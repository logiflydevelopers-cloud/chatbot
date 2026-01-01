import { useRef, useState } from "react";
import "./VoiceAgent.css";
import "./train-page.css";
import {
  FiArrowLeft,
} from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import aiIcon from "../../image/ai.svg"; 

/* ================= CONFIG ================= */
const WEBHOOK_URL = "https://newsworld.app.n8n.cloud/webhook/voice-agent";
const SILENCE_THRESHOLD = 0.015;
const SILENCE_TIME = 1500;

const AUDIO_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,
    sampleRate: 44100
  }
};

export default function VoiceAgent() {
  const [uiState, setUiState] = useState("IDLE");

  const micStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const silenceStartRef = useRef(null);

  const isRecordingRef = useRef(false);
  const isDetectorRunningRef = useRef(false);
  const isCallActiveRef = useRef(false);
  const aiAudioRef = useRef(null);
  const { setSidebarOpen } = useOutletContext();

  /* ================= START ================= */
  const startCall = async () => {
    if (uiState !== "IDLE") return;

    isCallActiveRef.current = true;
    setUiState("WAITING");

    micStreamRef.current = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
    audioCtxRef.current = new AudioContext({ sampleRate: 44100 });
    await audioCtxRef.current.resume();

    const src = audioCtxRef.current.createMediaStreamSource(micStreamRef.current);
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    src.connect(analyserRef.current);

    startDetector();
  };

  const startDetector = () => {
    if (!isCallActiveRef.current || isDetectorRunningRef.current) return;

    isDetectorRunningRef.current = true;
    const data = new Uint8Array(analyserRef.current.fftSize);

    const detect = () => {
      if (!isCallActiveRef.current || !isDetectorRunningRef.current || isRecordingRef.current) return;

      analyserRef.current.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const volume = Math.sqrt(sum / data.length);

      if (volume > SILENCE_THRESHOLD) {
        startRecording();
        return;
      }
      requestAnimationFrame(detect);
    };
    detect();
  };

  const startRecording = () => {
    if (!isCallActiveRef.current || isRecordingRef.current) return;

    isRecordingRef.current = true;
    isDetectorRunningRef.current = false;
    setUiState("LISTENING");

    recorderRef.current = new MediaRecorder(micStreamRef.current, {
      mimeType: "audio/webm;codecs=opus"
    });

    chunksRef.current = [];
    recorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
    recorderRef.current.onstop = sendToWebhook;

    recorderRef.current.start();
    silenceStartRef.current = null;
    detectSilence();
  };

  const detectSilence = () => {
    const data = new Uint8Array(analyserRef.current.fftSize);

    const loop = () => {
      if (!isCallActiveRef.current || !isRecordingRef.current) return;

      analyserRef.current.getByteTimeDomainData(data);

      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const volume = Math.sqrt(sum / data.length);

      if (volume < SILENCE_THRESHOLD) {
        if (!silenceStartRef.current) silenceStartRef.current = Date.now();
        if (Date.now() - silenceStartRef.current > SILENCE_TIME) {
          stopRecording();
          return;
        }
      } else silenceStartRef.current = null;

      requestAnimationFrame(loop);
    };
    loop();
  };

  const stopRecording = () => {
    if (!isRecordingRef.current) return;

    isRecordingRef.current = false;
    setUiState("THINKING");

    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;

    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    recorderRef.current?.stop();
  };

  const sendToWebhook = async () => {
    if (!isCallActiveRef.current) return;

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];

    const fd = new FormData();
    fd.append("audio", blob, "voice.webm");

    const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
    const buffer = await res.arrayBuffer();

    aiAudioRef.current = new Audio(URL.createObjectURL(new Blob([buffer])));
    setUiState("SPEAKING");
    await aiAudioRef.current.play();

    aiAudioRef.current.onended = async () => {
      if (!isCallActiveRef.current) return;
      setUiState("WAITING");
      startCall();
    };
  };

  const stopAll = () => {
    isCallActiveRef.current = false;
    setUiState("IDLE");

    recorderRef.current?.stop();
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    aiAudioRef.current?.pause();
  };

  return (
    <div className="persona-container">
    <div className="persona-header">
            {/* Mobile back button */}
            <button
              className="back-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <FiArrowLeft />
            </button>
    
            <div className="persona-icon">
              <img src={aiIcon} alt="AI Persona" />
            </div>
    
            <div>
              <h2>AI PERSONA</h2>
              <p>Write and customize how the AI talks and acts</p>
            </div>
          </div>
    <div className="voice-card">
      <div className={`pulse ${uiState === "LISTENING" ? "active" : ""}`} />

      <h3 className="title">Voice AI Assistant</h3>
      <p className="status">{uiState}</p>

      <button
        className={`action-btn ${uiState === "IDLE" ? "start" : "stop"}`}
        onClick={uiState === "IDLE" ? startCall : stopAll}
      >
        {uiState === "IDLE" ? "🎤 Start Call" : "⏹ End Call"}
      </button>
    </div>
  </div>

  );
}
