---
name: Mobile voice boundary
description: Why the Android first build uses Samsung keyboard dictation for input and Expo speech for output.
---

The Android first build keeps voice input compatible with Expo Go by focusing the text composer and relying on the Samsung keyboard's native dictation; spoken replies use expo-speech.

**Why:** A full native speech-recognition module would require a custom Android build and would not run in the standard Expo Go preview.

**How to apply:** If native push-to-talk is requested later, add a dedicated Android build path and speech-recognition module rather than pretending the Expo Go mic button transcribes audio.