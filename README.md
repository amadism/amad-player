# Amad Player

**Amad Player** is a customizable Vue.js component for creating audio and video players. It provides a simple and flexible player with basic controls such as play/pause, volume control, seek functionality, and full-screen mode for videos. This package is perfect for integrating audio and video players into your Vue.js applications.

## Installation

To install **Amad Player** via npm:

```bash
npm install amad-player
```

# Usage
Once installed, you can use the audio and video player components in your Vue.js app.

# Importing the Player Component

```
import { AmadAudio, AmadVideo } from 'amad-player';
```

# Using Amad Audio
Add the AmadAudio component in your template

```
  <AmadAudio
    :file="audioFile"
    :autoPlay="true"
    :title="'My Audio File'"
    :customClass="'add custom classes'"
    :barStyle="'custom class for bar'"
    :barSeeker="'custom class for bar seeker'"
  />
```

# Using Amad Video
Add the AmadVideo component in your template

```
  <AmadVideo
    :file="audioFile"
    :autoPlay="true"
    :title="'My Audio File'"
    :skip="true"
  />
```