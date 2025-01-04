# ADB Key Events for Fire TV Automation

This document lists all the key events that can be used with ADB to control Fire TV devices.

## Usage

To send a key event via ADB, use the following command:
```bash
adb shell input keyevent <KEYCODE>
# or
adb shell input keyevent KEYCODE_NAME
```

## Navigation Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_DPAD_UP | 19 | D-pad Up |
| KEYCODE_DPAD_DOWN | 20 | D-pad Down |
| KEYCODE_DPAD_LEFT | 21 | D-pad Left |
| KEYCODE_DPAD_RIGHT | 22 | D-pad Right |
| KEYCODE_DPAD_CENTER | 23 | D-pad Center/Select |
| KEYCODE_BACK | 4 | Back button |
| KEYCODE_HOME | 3 | Home button |
| KEYCODE_MENU | 82 | Menu button |

## Media Control Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_MEDIA_PLAY | 126 | Play |
| KEYCODE_MEDIA_PAUSE | 127 | Pause |
| KEYCODE_MEDIA_PLAY_PAUSE | 85 | Play/Pause toggle |
| KEYCODE_MEDIA_STOP | 86 | Stop |
| KEYCODE_MEDIA_NEXT | 87 | Next track |
| KEYCODE_MEDIA_PREVIOUS | 88 | Previous track |
| KEYCODE_MEDIA_REWIND | 89 | Rewind |
| KEYCODE_MEDIA_FAST_FORWARD | 90 | Fast forward |

## Volume Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_VOLUME_UP | 24 | Volume up |
| KEYCODE_VOLUME_DOWN | 25 | Volume down |
| KEYCODE_VOLUME_MUTE | 164 | Mute volume |

## Input Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_TAB | 61 | Tab key |
| KEYCODE_SPACE | 62 | Space key |
| KEYCODE_ENTER | 66 | Enter key |
| KEYCODE_DEL | 67 | Delete/Backspace |
| KEYCODE_CLEAR | 28 | Clear key |

## Number Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_0 | 7 | Number 0 |
| KEYCODE_1 | 8 | Number 1 |
| KEYCODE_2 | 9 | Number 2 |
| KEYCODE_3 | 10 | Number 3 |
| KEYCODE_4 | 11 | Number 4 |
| KEYCODE_5 | 12 | Number 5 |
| KEYCODE_6 | 13 | Number 6 |
| KEYCODE_7 | 14 | Number 7 |
| KEYCODE_8 | 15 | Number 8 |
| KEYCODE_9 | 16 | Number 9 |

## App Control Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_APP_SWITCH | 187 | Recent apps |
| KEYCODE_SETTINGS | 176 | Settings |
| KEYCODE_SEARCH | 84 | Search |

## Special Function Keys

| Key Name | Keycode | Description |
|----------|---------|-------------|
| KEYCODE_LANGUAGE_SWITCH | 204 | Switch language |
| KEYCODE_CHANNEL_UP | 166 | Channel up |
| KEYCODE_CHANNEL_DOWN | 167 | Channel down |
| KEYCODE_GUIDE | 172 | Program guide |
| KEYCODE_INFO | 165 | Information |
| KEYCODE_CAPTIONS | 175 | Toggle captions |

## Examples

1. Navigate using D-pad:
```bash
# Move up
adb shell input keyevent KEYCODE_DPAD_UP
# or
adb shell input keyevent 19

# Select item
adb shell input keyevent KEYCODE_DPAD_CENTER
# or
adb shell input keyevent 23
```

2. Media control:
```bash
# Play/Pause
adb shell input keyevent KEYCODE_MEDIA_PLAY_PAUSE
# or
adb shell input keyevent 85

# Fast forward
adb shell input keyevent KEYCODE_MEDIA_FAST_FORWARD
# or
adb shell input keyevent 90
```

3. System navigation:
```bash
# Go home
adb shell input keyevent KEYCODE_HOME
# or
adb shell input keyevent 3

# Go back
adb shell input keyevent KEYCODE_BACK
# or
adb shell input keyevent 4
```

## Notes

- Not all key events may be supported on all Fire TV devices
- Some apps may handle key events differently
- Key events can be combined with other ADB commands for automation
- Response to key events may vary based on the current app state 