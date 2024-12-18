# Amad Player

**Amad Player** is a customizable Vue.js component for creating audio and video players. It provides a simple and flexible player with basic controls such as play/pause, volume control, seek functionality, and full-screen mode for videos. This package is perfect for integrating audio and video players into your Vue.js applications.

## Demo  
Check out the live demo here: [Demo Link](https://amad-player.netlify.app/). 


## Installation

To install **Amad Player** via npm:

```bash
npm i amad-player
```

# Usage
Once installed, you can use the audio and video player components in your Vue.js app.

# Importing the Player Component

```
import { AmadAudio, AmadVideo } from 'amad-player';
```


Import the AmadPlayer styles from 'amad-player/style.css'. For example:


```
@import 'amad-player/style.css';
```

# Using Amad Audio

Add the AmadAudio component in your template

```
import { AmadAudio } from 'amad-player';
```

```
  <AmadAudio
    :file="audioFile"
  />
```

# Using Amad Video
Add the AmadVideo component in your template

```
import { AmadVideo } from 'amad-player';
```

```
  <AmadVideo
    :file="audioFile"
  />
```


### Configuration

# Props for Audio Player (AmadAudio)

| Prop           | Type    | Default | Description            |
|----------------|---------|---------|------------------------|
| file           | string  | null    | audio src (required)   |
| autoPlay       | boolean | false   | for autoplay audio     |
| skip           | boolean | true    | for skip buttons       |
| preload        | string  | metadata| preload                |
| loop           | boolean | false   | play audio in loop     |
| title          | string  | null    | the title of the audio |
| bgColor        | string  | #333    | background color       |
| textColor      | string  | #fff    | text color             |
| barColor       | string  | #d1d5db | bar color              |
| barSeekerColor | string  | null    | bar seeker color       |
| iconStyle      | string  | #333    | icons color            |
| spinnerColor   | string  | #fff    | loading spinner        |
| showLoading    | boolean | true    | display loading on load|


# Props for Video Player (AmadVideo)

| Prop           | Type    | Default | Description            |
|----------------|---------|---------|------------------------|
| file           | string  | null    | audio src (required)   |
| poster         | string  | null    | poster or thumbnail    |
| preload        | string  | metadata| preload                |
| autoPlay       | boolean | false   | for autoplay audio     |
| loop           | boolean | false   | play audio in loop     |
| title          | string  | null    | the title of the audio |
| skip           | boolean | true    | for skip buttons       |
| iconStyle      | string  | #333    | icons color            |

