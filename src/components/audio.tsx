"use client"; // Enables client-side rendering for this component

import React, { useState, useRef, useEffect } from "react"; // Import React hooks
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card, CardContent } from "@/components/ui/card"; // Import custom Card components
import { Progress } from "@/components/ui/progress"; // Import custom Progress component
import {
  ForwardIcon,
  PlayIcon,
  RewindIcon,
  UploadIcon,
  PauseIcon,
} from "lucide-react"; // Import icons from lucide-react
import Image from "next/image";
 import profile from "@/components/images/ckia8-music-lockdown-1fa0fb8b.jpg"

// Define types for the component props and state
interface AudioPlayerProps {}

// Define the Track interface
interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]); // State to manage the list of tracks
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0); // State to manage the current track index
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to manage the play/pause status
  const [progress, setProgress] = useState<number>(0); // State to manage the progress of the current track
  const [currentTime, setCurrentTime] = useState<number>(0); // State to manage the current time of the track
  const [duration, setDuration] = useState<number>(0); // State to manage the duration of the track
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to manage the audio element

  // Function to handle file upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
    }
  };

  // Function to handle play/pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Function to handle next track
  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  // Function to handle previous track
  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  // Function to handle time update of the track
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  // Function to handle metadata load of the track
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Function to format time in minutes and seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // useEffect to handle track change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0); // Reset the current time for the new track
      setProgress(0); // Reset the progress for the new track
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  // JSX return statement rendering the Audio Player UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg- text-foreground bg-gradient-to-br from-fuchsia-200 to-fuchsia-300">
      <div className="max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold  text-blue-900 ">Audio Player</h1>
          <label className="flex items-center cursor-pointer">
            <UploadIcon className="w-5 h-5 mr-2 text-blue-900 font-bold" />
            <b><span>Upload</span></b>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <Card className="border border-blue-800 rounded-lg shadow-lg">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8 border-gray-700">
          <Image
  src={profile}
  alt="Album Cover"
  width={100}
  height={100}
  className="rounded-full w-32 h-32 object-cover"
/>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-900">
                {tracks[currentTrackIndex]?.title || "Audio Title"}
              </h2>
              <p className="text-muted-foreground font-bold">
                {tracks[currentTrackIndex]?.artist || "Person Name"}
              </p>
            </div>
            <div className="w-full border border-pink-800 rounded-lg shadow-lg">
              <Progress value={progress} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handlePrevTrack}>
                <RewindIcon className="w-6 h-6 font-bold text-blue-700" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 font-bold text-blue-900" />
                ) : (
                  <PlayIcon className="w-6 h-6 font-bold text-blue-900" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextTrack}>
                <ForwardIcon className="w-6 h-6 font-bold text-blue-900" />
              </Button>
            </div>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </CardContent>
        </Card>
      </div>
      <br></br>  <div className="text-center text-blue-900 font-bold">
  <h1 className="text-1xl font-bold bg-blue-50">Developed By : Hareem Jaweid</h1>
  
</div></div>
  );
};

export default AudioPlayer;