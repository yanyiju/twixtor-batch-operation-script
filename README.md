English | [中文](README_CN.md)

# twixtor-batch-operation-script
This script is applied to Adobe After Effects to help users do batch operations of [twixtor plugin](https://revisionfx.com/products/twixtor/) on one video layer or all video layers of a selected composition for making a slow-motion video or increasing clip frame rate. Here video layers include original video material clips or composition clips with video channel, which can be added with a twixtor effect, thus other layers like solid layers will be ignored by this script naturally. 

The script will do all the stuff from precomposing layers, adding twixtor effects, removing repetitive frames, and finally to creating a new composition where user can adjust video speed by using time remapping (Shortcut: Ctrl+Alt+T). **The only thing users need to do is a single click. :)**

This script is initially designed for AMV makers. The twixtor usage tutorial can be easily found on youtube, so if you don't know what twixtor is, please check it yourself.

![screenshot](screenshot.png)<br>
Screenshot of the script UI. 

***Repetitive Frame Rate*** refers to how many frames each unique scene takes. For example, for Anime video, this value is often 2 or 3 under 24fps, which means every original paintings will last for 2 or 3 frames and during every second (24 frames), there are 24/2=12 or 24/3=8 original paintings. For other 3D filming, this value is often 1. This value is used by the script for computing the input frame rate in twixtor paramenters, so as to remove the repetitive frames.

# Installation
Put the ```.jsx``` file into

* :open_file_folder: ```<Ae installation folder>/support file/script/```

or

* :open_file_folder: ```<Ae installation folder>/support file/script/ScriptUI Panels/```

and run it from the AE menu

* <kbd>file</kbd>><kbd>scripts</kbd>><kbd>twixtor-batch-operation-script.jsx</kbd> 

or

* <kbd>window</kbd>><kbd>twixtor-batch-operation-script.jsx</kbd>

# Dependencies & Compatibility
* Adobe After Effects cc 2020 and above.
* Twixtor plugin (Twixtor Pro is used in this script). 
* Please support original.