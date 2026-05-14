"use client";

import { Minus, Plus, RefreshCw, Volume2, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SAMPLE_URL = "/webharmonium/harmonium-kannan-orig.wav";
const REVERB_URL = "/webharmonium/reverb.wav";
const LOOP_START = 0.5;
const MIDDLE_C = 60;
const ROOT_KEY = 62;
const DEFAULT_OCTAVE = 3;
const OCTAVE_MAP = [-36, -24, -12, 0, 12, 24, 36];
const BASE_KEY_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const KEYBOARD_MAP: Record<string, number> = {
  s: 53,
  S: 53,
  a: 54,
  A: 54,
  "`": 55,
  "1": 56,
  q: 57,
  Q: 57,
  "2": 58,
  w: 59,
  W: 59,
  e: 60,
  E: 60,
  "4": 61,
  r: 62,
  R: 62,
  "5": 63,
  t: 64,
  T: 64,
  y: 65,
  Y: 65,
  "7": 66,
  u: 67,
  U: 67,
  "8": 68,
  i: 69,
  I: 69,
  "9": 70,
  o: 71,
  O: 71,
  p: 72,
  P: 72,
  "-": 73,
  "[": 74,
  "=": 75,
  "]": 76,
  "\\": 77,
  "'": 78,
  ";": 79,
};

const SWARAM_MAP: Record<string, string> = {
  s: "Ṃ",
  S: "Ṃ",
  a: "Ṃ",
  A: "Ṃ",
  "`": "P̣",
  "1": "Ḍ",
  q: "Ḍ",
  Q: "Ḍ",
  "2": "Ṇ",
  w: "Ṇ",
  W: "Ṇ",
  e: "S",
  E: "S",
  "4": "R",
  r: "R",
  R: "R",
  "5": "G",
  t: "G",
  T: "G",
  y: "M",
  Y: "M",
  "7": "M",
  u: "P",
  U: "P",
  "8": "D",
  i: "D",
  I: "D",
  "9": "N",
  o: "N",
  O: "N",
  p: "Ṡ",
  P: "Ṡ",
  "-": "Ṙ",
  "[": "Ṙ",
  "=": "Ġ",
  "]": "Ġ",
  "\\": "Ṁ",
  "'": "Ṁ",
  ";": "Ṗ",
};

const PIANO_KEYS = [
  { keyName: "`", type: "white", points: "0,0 14,0 14,50 21,50 21,100 0,100 0,0" },
  { keyName: "1", type: "black", points: "14,0 28,0 28,50 14,50 14,0" },
  { keyName: "q", type: "white", points: "21,50 28,50 28,0 35,0 35,50 42,50 42,100 21,100 21,50" },
  { keyName: "2", type: "black", points: "35,0 49,0 49,50 35,50 35,0" },
  { keyName: "w", type: "white", points: "42,50 49,50 49,0 63,0 63,100 42,100 42,50" },
  { keyName: "e", type: "white", points: "63,0 77,0 77,50 84,50 84,100 63,100 63,0" },
  { keyName: "4", type: "black", points: "77,0 91,0 91,50 77,50 77,0" },
  { keyName: "r", type: "white", points: "84,50 91,50 91,0 98,0 98,50 105,50 105,100 84,100 84,50" },
  { keyName: "5", type: "black", points: "98,0 112,0 112,50 98,50 98,0" },
  { keyName: "t", type: "white", points: "105,50 112,50 112,0 126,0 126,100 105,100 105,50" },
  { keyName: "y", type: "white", points: "126,0 140,0 140,50 147,50 147,100 126,100 126,0" },
  { keyName: "7", type: "black", points: "140,0 154,0 154,50 140,50 140,0" },
  { keyName: "u", type: "white", points: "147,50 154,50 154,0 161,0 161,50 168,50 168,100 147,100 147,50" },
  { keyName: "8", type: "black", points: "161,0 175,0 175,50 161,50 161,0" },
  { keyName: "i", type: "white", points: "168,50 175,50 175,0 182,0 182,50 189,50 189,100 168,100 168,50" },
  { keyName: "9", type: "black", points: "182,0 196,0 196,50 182,50 182,0" },
  { keyName: "o", type: "white", points: "189,50 196,50 196,0 210,0 210,100 189,100 189,50" },
  { keyName: "p", type: "white", points: "210,0 224,0 224,50 231,50 231,100 210,100 210,0" },
  { keyName: "-", type: "black", points: "224,0 238,0 238,50 224,50 224,0" },
  { keyName: "[", type: "white", points: "231,50 238,50 238,0 245,0 245,50 252,50 252,100 231,100 231,50" },
  { keyName: "=", type: "black", points: "245,0 259,0 259,50 245,50 245,0" },
  { keyName: "]", type: "white", points: "252,50 259,50 259,0 273,0 273,100 252,100 252,50" },
  { keyName: "\\", type: "white", points: "273,0 294,0 294,100 273,100 273,0" },
] as const;

const WHITE_LABELS = [
  ["`", 7],
  ["q", 28],
  ["w", 49],
  ["e", 70],
  ["r", 91],
  ["t", 112],
  ["y", 133],
  ["u", 154],
  ["i", 175],
  ["o", 196],
  ["p", 217],
  ["[", 238],
  ["]", 259],
  ["\\", 280],
] as const;

const BLACK_LABELS = [
  ["1", 16],
  ["2", 37],
  ["4", 79],
  ["5", 100],
  ["7", 142],
  ["8", 163],
  ["9", 184],
  ["-", 226],
  ["=", 247],
] as const;

const NOTE_LABELS = [
  ["C", 70],
  ["D", 91],
  ["E", 112],
  ["F", 133],
  ["G", 154],
  ["A", 175],
  ["B", 196],
] as const;

const WHITE_KEY_BOTTOM_RADIUS = 7;

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function buildWhiteKeyPath(points: string) {
  const coordinates = points.split(" ").map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });
  const bottomY = Math.max(...coordinates.map(({ y }) => y));
  const leftX = Math.min(...coordinates.map(({ x }) => x));
  const rightX = Math.max(...coordinates.map(({ x }) => x));
  const path = [`M ${coordinates[0].x} ${coordinates[0].y}`];

  for (let index = 1; index < coordinates.length; index += 1) {
    const { x, y } = coordinates[index];

    if (y === bottomY && x === rightX) {
      path.push(
        `L ${x} ${y - WHITE_KEY_BOTTOM_RADIUS}`,
        `Q ${x} ${y} ${x - WHITE_KEY_BOTTOM_RADIUS} ${y}`
      );
    } else if (y === bottomY && x === leftX) {
      path.push(
        `L ${x + WHITE_KEY_BOTTOM_RADIUS} ${y}`,
        `Q ${x} ${y} ${x} ${y - WHITE_KEY_BOTTOM_RADIUS}`
      );
    } else {
      path.push(`L ${x} ${y}`);
    }
  }

  return `${path.join(" ")} Z`;
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

type AudioContextConstructor = typeof AudioContext;

type MidiInput = {
  id: string;
  name?: string | null;
  manufacturer?: string | null;
  onmidimessage: ((message: MIDIMessageEvent) => void) | null;
};

type MidiAccess = {
  inputs: {
    values(): IterableIterator<MidiInput>;
  };
  onstatechange: ((event: MIDIConnectionEvent) => void) | null;
};

type MidiMessage = {
  data: Uint8Array | number[];
  target: {
    id: string;
  };
};

type MidiNavigator = Navigator & {
  requestMIDIAccess?: (options?: { sysex?: boolean }) => Promise<MidiAccess>;
};

type MidiDevice = {
  id: string;
  label: string;
};

export default function WebHarmonium() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to play. First note loads the harmonium samples.");
  const [volume, setVolume] = useState(30);
  const [useReverb, setUseReverb] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [octave, setOctave] = useState(DEFAULT_OCTAVE);
  const [stackCount, setStackCount] = useState(0);
  const [notation, setNotation] = useState("");
  const [midiStatus, setMidiStatus] = useState("MIDI keyboard: click refresh to connect");
  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([]);
  const [selectedMidiId, setSelectedMidiId] = useState("");
  const [visuallyPressedNotes, setVisuallyPressedNotes] = useState<Set<number>>(() => new Set());

  const contextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const midiAccessRef = useRef<MidiAccess | null>(null);
  const sourceNodesRef = useRef<Array<AudioBufferSourceNode | null>>([]);
  const sourceStateRef = useRef<number[]>([]);
  const keyMapRef = useRef<number[]>([]);
  const octaveRef = useRef(octave);
  const stackCountRef = useRef(stackCount);
  const selectedMidiIdRef = useRef(selectedMidiId);
  const useReverbRef = useRef(useReverb);
  const loadedRef = useRef(loaded);
  const loadingPromiseRef = useRef<Promise<boolean> | null>(null);
  const loadModuleRef = useRef<() => Promise<boolean>>(async () => false);
  const pressedNotesRef = useRef<Set<number>>(new Set());
  const midiPressedNotesRef = useRef<Set<number>>(new Set());
  const activePointerNoteRef = useRef<number | null>(null);

  const rootNote = useMemo(
    () => BASE_KEY_NAMES[transpose >= 0 ? transpose % 12 : transpose + 12],
    [transpose]
  );

  useEffect(() => {
    octaveRef.current = octave;
  }, [octave]);

  useEffect(() => {
    stackCountRef.current = stackCount;
  }, [stackCount]);

  useEffect(() => {
    selectedMidiIdRef.current = selectedMidiId;
  }, [selectedMidiId]);

  useEffect(() => {
    useReverbRef.current = useReverb;
  }, [useReverb]);

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    const savedVolume = Number(localStorage.getItem("webharmonium.volume"));
    const savedTranspose = Number(localStorage.getItem("webharmonium.transpose"));
    const savedStack = Number(localStorage.getItem("webharmonium.stack"));
    const savedReverb = localStorage.getItem("webharmonium.useReverb");

    localStorage.setItem("webharmonium.octave", String(DEFAULT_OCTAVE));

    if (!Number.isNaN(savedVolume) && savedVolume >= 1 && savedVolume <= 100) {
      setVolume(savedVolume);
    }
    if (!Number.isNaN(savedTranspose) && savedTranspose >= -11 && savedTranspose <= 11) {
      setTranspose(savedTranspose);
    }
    if (!Number.isNaN(savedStack) && savedStack >= 0 && savedStack <= 6) {
      setStackCount(savedStack);
    }
    if (savedReverb !== null) {
      setUseReverb(savedReverb === "true");
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is optional; audio playback still works without it.
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const idleWindow = window as IdleWindow;
    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const prefetchAudioFiles = () => {
      void Promise.allSettled([
        fetch(SAMPLE_URL, { signal: controller.signal }),
        fetch(REVERB_URL, { signal: controller.signal }),
      ]);
    };

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(prefetchAudioFiles, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(prefetchAudioFiles, 500);
    }

    return () => {
      controller.abort();
      if (idleId !== undefined) {
        idleWindow.cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const setSourceNode = useCallback((index: number) => {
    const context = contextRef.current;
    const buffer = audioBufferRef.current;
    const gainNode = gainNodeRef.current;

    if (!context || !buffer || !gainNode || index < 0 || index >= 128) {
      return;
    }

    const currentSource = sourceNodesRef.current[index];
    if (currentSource && sourceStateRef.current[index] === 1) {
      currentSource.stop(0);
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = LOOP_START;
    source.detune.value = (keyMapRef.current[index] || 0) * 100;
    source.connect(gainNode);

    sourceNodesRef.current[index] = source;
    sourceStateRef.current[index] = 0;
  }, []);

  const buildSources = useCallback(
    (currentTranspose: number) => {
      const startKey = MIDDLE_C - 124 + (ROOT_KEY - MIDDLE_C);
      keyMapRef.current = Array.from(
        { length: 128 },
        (_, index) => startKey + index + currentTranspose
      );

      for (let index = 0; index < 128; index += 1) {
        setSourceNode(index);
      }
    },
    [setSourceNode]
  );

  const noteOn = useCallback((note: number) => {
    const playIndex = (index: number) => {
      const source = sourceNodesRef.current[index];
      if (source && sourceStateRef.current[index] === 0) {
        source.start(0);
        sourceStateRef.current[index] = 1;
      }
    };

    const baseIndex = note + OCTAVE_MAP[octaveRef.current];
    if (baseIndex >= 0 && baseIndex < 128) {
      playIndex(baseIndex);
    }

    for (let count = 1; count <= stackCountRef.current; count += 1) {
      const stackedOctave = octaveRef.current + count;
      const index = note + OCTAVE_MAP[stackedOctave];
      if (index >= 0 && index < 128) {
        playIndex(index);
      }
    }
  }, []);

  const noteOff = useCallback(
    (note: number) => {
      const baseIndex = note + OCTAVE_MAP[octaveRef.current];
      if (baseIndex >= 0 && baseIndex < 128) {
        setSourceNode(baseIndex);
      }

      for (let count = 1; count <= stackCountRef.current; count += 1) {
        const stackedOctave = octaveRef.current + count;
        const index = note + OCTAVE_MAP[stackedOctave];
        if (index >= 0 && index < 128) {
          setSourceNode(index);
        }
      }
    },
    [setSourceNode]
  );

  const showPressedKey = useCallback((note: number) => {
    setVisuallyPressedNotes((current) => {
      const next = new Set(current);
      next.add(note);
      return next;
    });
  }, []);

  const hidePressedKey = useCallback((note: number) => {
    setVisuallyPressedNotes((current) => {
      const next = new Set(current);
      next.delete(note);
      return next;
    });
  }, []);

  const releaseMidiNotes = useCallback(() => {
    const notes = Array.from(midiPressedNotesRef.current);
    midiPressedNotesRef.current.clear();

    notes.forEach((note) => {
      pressedNotesRef.current.delete(note);
      hidePressedKey(note);
      if (loadedRef.current) {
        noteOff(note);
      }
    });
  }, [hidePressedKey, noteOff]);

  const updateReverbConnection = useCallback((enabled: boolean) => {
    const gainNode = gainNodeRef.current;
    const reverbNode = reverbNodeRef.current;

    if (!gainNode || !reverbNode) {
      return;
    }

    try {
      gainNode.disconnect(reverbNode);
    } catch {
      // The node may not be connected yet.
    }

    if (enabled) {
      gainNode.connect(reverbNode);
    }
  }, []);

  const loadAudioBuffer = useCallback(async (url: string, context: AudioContext) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}`);
    }

    return context.decodeAudioData(await response.arrayBuffer());
  }, []);

  const handleMidiMessage = useCallback(
    (message: MidiMessage) => {
      if (selectedMidiIdRef.current && message.target.id !== selectedMidiIdRef.current) {
        return;
      }

      const [command, note, velocity = 0] = message.data;
      const status = command & 0xf0;

      if (status === 0x90) {
        if (velocity > 0) {
          midiPressedNotesRef.current.add(note);
          pressedNotesRef.current.add(note);
          showPressedKey(note);
          if (loadedRef.current) {
            noteOn(note);
          } else {
            void loadModuleRef.current().then((ready) => {
              if (ready && pressedNotesRef.current.has(note)) {
                noteOn(note);
              }
            });
          }
        } else {
          midiPressedNotesRef.current.delete(note);
          pressedNotesRef.current.delete(note);
          hidePressedKey(note);
          noteOff(note);
        }
      } else if (status === 0x80) {
        midiPressedNotesRef.current.delete(note);
        pressedNotesRef.current.delete(note);
        hidePressedKey(note);
        noteOff(note);
      } else if (status === 0xb0 && note === 7) {
        const nextVolume = Math.round((100 * velocity) / 127);
        setVolume(nextVolume);
        localStorage.setItem("webharmonium.volume", String(nextVolume));
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = nextVolume / 100;
        }
      }
    },
    [hidePressedKey, noteOff, noteOn, showPressedKey]
  );

  const requestMidiAccess = useCallback(async () => {
    const midiNavigator = navigator as MidiNavigator;

    if (!midiNavigator.requestMIDIAccess) {
      setMidiStatus("MIDI keyboard: not supported in this browser");
      return;
    }

    try {
      releaseMidiNotes();

      const midiAccess = midiAccessRef.current || (await midiNavigator.requestMIDIAccess({ sysex: false }));
      midiAccessRef.current = midiAccess;

      const refreshDevices = () => {
        releaseMidiNotes();

        const devices = Array.from(midiAccess.inputs.values()).map((input) => {
          input.onmidimessage = (event) => {
            handleMidiMessage({
              data: Array.from(event.data || []),
              target: { id: input.id },
            });
          };
          return {
            id: input.id,
            label: `${input.name || "MIDI input"}${input.manufacturer ? ` by ${input.manufacturer}` : ""}`,
          };
        });

        setMidiDevices(devices);
        setSelectedMidiId((current) => {
          if (devices.some((device) => device.id === current)) {
            return current;
          }

          return devices[0]?.id || "";
        });
        setMidiStatus(devices.length ? "MIDI keyboard: connected" : "MIDI keyboard: no input devices");
      };

      midiAccess.onstatechange = refreshDevices;
      refreshDevices();
    } catch (error) {
      setMidiStatus(`MIDI keyboard: failed (${error instanceof Error ? error.message : "unknown error"})`);
    }
  }, [handleMidiMessage, releaseMidiNotes]);

  const loadModule = useCallback(async (): Promise<boolean> => {
    if (loadedRef.current) {
      return true;
    }

    if (loadingPromiseRef.current) {
      return loadingPromiseRef.current;
    }

    const promise = (async () => {
      setLoading(true);
      setStatus("Loading harmonium samples...");

      try {
        const AudioContextCtor = (window.AudioContext ||
          (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext) as
          | AudioContextConstructor
          | undefined;

        if (!AudioContextCtor) {
          throw new Error("Web Audio is not supported in this browser.");
        }

        const context = contextRef.current || new AudioContextCtor();
        contextRef.current = context;

        if (context.state === "suspended") {
          await context.resume();
        }

        const gainNode = gainNodeRef.current || context.createGain();
        gainNode.gain.value = volume / 100;
        if (!gainNodeRef.current) {
          gainNode.connect(context.destination);
        }
        gainNodeRef.current = gainNode;

        const [audioBuffer, reverbBuffer] = await Promise.all([
          audioBufferRef.current || loadAudioBuffer(SAMPLE_URL, context),
          reverbNodeRef.current?.buffer || loadAudioBuffer(REVERB_URL, context),
        ]);

        audioBufferRef.current = audioBuffer;

        if (!reverbNodeRef.current) {
          const reverbNode = context.createConvolver();
          reverbNode.buffer = reverbBuffer;
          reverbNode.connect(context.destination);
          reverbNodeRef.current = reverbNode;
        }

        buildSources(transpose);
        updateReverbConnection(useReverbRef.current);
        loadedRef.current = true;
        setLoaded(true);
        setStatus("Ready");
        return true;
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Failed to load the module.");
        return false;
      } finally {
        setLoading(false);
        loadingPromiseRef.current = null;
      }
    })();

    loadingPromiseRef.current = promise;
    return promise;
  }, [buildSources, loadAudioBuffer, transpose, updateReverbConnection, volume]);

  useEffect(() => {
    loadModuleRef.current = loadModule;
  }, [loadModule]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.repeat) {
        return;
      }

      const note = KEYBOARD_MAP[event.key];
      if (note !== undefined) {
        pressedNotesRef.current.add(note);
        showPressedKey(note);
        if (loadedRef.current) {
          noteOn(note);
        } else {
          void loadModuleRef.current().then((ready) => {
            if (ready && pressedNotesRef.current.has(note)) {
              noteOn(note);
            }
          });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const note = KEYBOARD_MAP[event.key];
      if (note !== undefined) {
        pressedNotesRef.current.delete(note);
        hidePressedKey(note);
        if (loadedRef.current) {
          noteOff(note);
        }
      }

      if (event.key === "Backspace") {
        setNotation((current) => Array.from(current).slice(0, -1).join(""));
      } else if (event.key === "Delete") {
        setNotation("");
      } else if (event.key === "Enter") {
        setNotation("");
      } else if (event.key === "Tab") {
        event.preventDefault();
        setNotation((current) => `${current},`);
      } else if (SWARAM_MAP[event.key]) {
        setNotation((current) => `${current}${SWARAM_MAP[event.key]}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [hidePressedKey, noteOff, noteOn, showPressedKey]);

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    localStorage.setItem("webharmonium.volume", String(nextVolume));
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = nextVolume / 100;
    }
  };

  const handleMidiDeviceChange = (nextMidiId: string) => {
    releaseMidiNotes();
    setSelectedMidiId(nextMidiId);
  };

  const handleReverbChange = (enabled: boolean) => {
    setUseReverb(enabled);
    localStorage.setItem("webharmonium.useReverb", enabled ? "true" : "false");
    updateReverbConnection(enabled);
  };

  const shiftSemitone = (delta: number) => {
    setTranspose((current) => {
      const next = Math.max(-11, Math.min(11, current + delta));
      localStorage.setItem("webharmonium.transpose", String(next));
      if (loaded) {
        buildSources(next);
      }
      return next;
    });
  };

  const shiftOctave = (delta: number) => {
    setOctave((current) => {
      const next = Math.max(0, Math.min(6, current + delta));
      localStorage.setItem("webharmonium.octave", String(next));
      return next;
    });
  };

  const changeStack = (delta: number) => {
    setStackCount((current) => {
      const next = Math.max(0, Math.min(6 - octaveRef.current, current + delta));
      localStorage.setItem("webharmonium.stack", String(next));
      return next;
    });
  };

  const playKey = (keyName: string) => {
    const note = KEYBOARD_MAP[keyName];
    activePointerNoteRef.current = note;
    pressedNotesRef.current.add(note);
    showPressedKey(note);
    if (loadedRef.current) {
      noteOn(note);
    } else {
      void loadModule().then((ready) => {
        if (ready && pressedNotesRef.current.has(note)) {
          noteOn(note);
        }
      });
    }
  };

  const stopKey = () => {
    if (activePointerNoteRef.current !== null) {
      pressedNotesRef.current.delete(activePointerNoteRef.current);
      hidePressedKey(activePointerNoteRef.current);
      if (loadedRef.current) {
        noteOff(activePointerNoteRef.current);
      }
      activePointerNoteRef.current = null;
    }
  };

  return (
    <section className="w-full bg-neutral-100 text-neutral-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              Free Harmonium: Web Harmonium You Can Play Online
            </h1>
            <p className="mt-1 text-sm text-neutral-600">{status}</p>
          </div>
          {loading && <RefreshCw className="h-5 w-5 animate-spin text-teal-700" aria-label="Loading samples" />}
        </div>

        <>
            <div className={`overflow-x-auto rounded-md border border-neutral-300 bg-transparent p-4 shadow-[0_10px_24px_rgba(212,212,212,0.45)] ${loading ? "opacity-80" : ""}`}>
              <svg
                width="588"
                height="220"
                viewBox="0 0 294 110"
                className="mx-auto h-auto min-w-[588px] max-w-none touch-none"
                role="img"
                aria-label="Playable harmonium keyboard"
              >
                <defs>
                  <linearGradient id="harmonium-white-key" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="62%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <linearGradient id="harmonium-white-key-pressed" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#dff7ef" />
                    <stop offset="62%" stopColor="#c9f2e4" />
                    <stop offset="100%" stopColor="#9de4c9" />
                  </linearGradient>
                  <linearGradient id="harmonium-black-key" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1f2937" />
                    <stop offset="42%" stopColor="#070b12" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>
                  <linearGradient id="harmonium-black-key-pressed" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#11363f" />
                    <stop offset="46%" stopColor="#08272f" />
                    <stop offset="100%" stopColor="#031016" />
                  </linearGradient>
                  <filter id="harmonium-white-shadow" x="-18%" y="-10%" width="136%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1.1" floodColor="#020617" floodOpacity="0.2" />
                  </filter>
                  <filter id="harmonium-black-shadow" x="-24%" y="-18%" width="148%" height="150%">
                    <feDropShadow dx="0" dy="3" stdDeviation="1.4" floodColor="#020617" floodOpacity="0.5" />
                  </filter>
                </defs>

                {PIANO_KEYS.map((pianoKey) => {
                  const isPressed = visuallyPressedNotes.has(KEYBOARD_MAP[pianoKey.keyName]);
                  const isWhite = pianoKey.type === "white";

                  const keyProps = {
                    className: "cursor-pointer transition-[filter,opacity,transform] duration-75 ease-out",
                    fill: isWhite
                      ? `url(#${isPressed ? "harmonium-white-key-pressed" : "harmonium-white-key"})`
                      : `url(#${isPressed ? "harmonium-black-key-pressed" : "harmonium-black-key"})`,
                    filter: `url(#${isWhite ? "harmonium-white-shadow" : "harmonium-black-shadow"})`,
                    stroke: isWhite ? "#dbe3ec" : "#334155",
                    strokeLinejoin: "round" as const,
                    strokeWidth: isWhite ? "1.35" : "1",
                    style: {
                      transform: isPressed ? "translateY(1.4px)" : "translateY(0)",
                      transformBox: "fill-box" as const,
                      transformOrigin: "center",
                    },
                    onMouseDown: () => playKey(pianoKey.keyName),
                    onMouseUp: stopKey,
                    onMouseLeave: stopKey,
                    onTouchStart: (event: React.TouchEvent<SVGPathElement | SVGPolygonElement>) => {
                      event.preventDefault();
                      playKey(pianoKey.keyName);
                    },
                    onTouchEnd: (event: React.TouchEvent<SVGPathElement | SVGPolygonElement>) => {
                      event.preventDefault();
                      stopKey();
                    },
                    onTouchCancel: stopKey,
                  };

                  return isWhite ? (
                    <path
                      key={pianoKey.keyName}
                      d={buildWhiteKeyPath(pianoKey.points)}
                      {...keyProps}
                    />
                  ) : (
                    <polygon
                      key={pianoKey.keyName}
                      points={pianoKey.points}
                      {...keyProps}
                    />
                  );
                })}

                {WHITE_LABELS.map(([label, x]) => (
                  <text key={label} x={x} y="65" fill="#0f172a" fontFamily="Courier New" fontSize="14" className="pointer-events-none select-none">
                    {label}
                  </text>
                ))}
                {BLACK_LABELS.map(([label, x]) => (
                  <text key={label} x={x} y="30" fill="#f8fafc" fontFamily="Courier New" fontSize="14" className="pointer-events-none select-none">
                    {label}
                  </text>
                ))}
                {NOTE_LABELS.map(([label, x]) => (
                  <text
                    key={label}
                    x={x}
                    y="90"
                    fill="#1d4ed8"
                    fontFamily="Courier New"
                    fontSize="14"
                    fontWeight="700"
                    className="pointer-events-none select-none"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ControlPanel title={`Volume: ${volume}%`} icon={<Volume2 className="h-5 w-5" />}>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={volume}
                  onChange={(event) => handleVolumeChange(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-teal-700"
                />
              </ControlPanel>

              <ControlPanel title="Reverb" icon={<Waves className="h-5 w-5" />}>
                <label className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-600">{useReverb ? "Enabled" : "Disabled"}</span>
                  <input
                    type="checkbox"
                    checked={useReverb}
                    onChange={(event) => handleReverbChange(event.target.checked)}
                    className="h-6 w-6 accent-teal-700"
                  />
                </label>
              </ControlPanel>

              <Stepper title={`Transpose - ${rootNote}`} value={transpose} onMinus={() => shiftSemitone(-1)} onPlus={() => shiftSemitone(1)} />
              <Stepper title="Octave" value={octave} onMinus={() => shiftOctave(-1)} onPlus={() => shiftOctave(1)} />
              <Stepper title="Reeds" value={stackCount} onMinus={() => changeStack(-1)} onPlus={() => changeStack(1)} />

              <ControlPanel
                title={midiStatus}
                icon={
                  <button
                    type="button"
                    onClick={requestMidiAccess}
                    className="rounded-md p-1 hover:bg-neutral-100"
                    aria-label="Refresh MIDI devices"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                }
              >
                <select
                  value={selectedMidiId}
                  onChange={(event) => handleMidiDeviceChange(event.target.value)}
                  className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
                >
                  {midiDevices.length === 0 ? (
                    <option value="">No MIDI input selected</option>
                  ) : (
                    midiDevices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.label}
                      </option>
                    ))
                  )}
                </select>
              </ControlPanel>
            </div>

            <div className="rounded-md border border-neutral-300 bg-white p-4">
              <div className="text-sm font-medium text-neutral-700">Notation</div>
              <div className="mt-2 min-h-10 min-w-0 max-w-full overflow-x-auto whitespace-nowrap rounded-md bg-neutral-100 px-3 py-2 font-mono text-lg">
                {notation || <span className="text-sm text-neutral-400">Play keys to collect swaram notation.</span>}
              </div>
            </div>
          </>
      </div>
    </section>
  );
}

function ControlPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-neutral-300 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3 text-base font-semibold">
        <span>{title}</span>
        {icon}
      </div>
      {children}
    </div>
  );
}

function Stepper({
  title,
  value,
  onMinus,
  onPlus,
}: {
  title: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <ControlPanel title={title} icon={<span className="text-lg font-semibold">{value}</span>}>
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
        <button
          type="button"
          onClick={onMinus}
          className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 hover:bg-neutral-300"
          aria-label={`Decrease ${title}`}
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="text-center text-2xl font-semibold">{value}</div>
        <button
          type="button"
          onClick={onPlus}
          className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-200 hover:bg-neutral-300"
          aria-label={`Increase ${title}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </ControlPanel>
  );
}
