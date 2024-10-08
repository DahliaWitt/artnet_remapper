## artnet_remapper

This is a simple tool to remap Art-Net universes. It is designed to be used with the [Art-Net](https://en.wikipedia.org/wiki/Art-Net) protocol, which is a protocol for transmitting DMX data over IP networks. This tool is useful when you have a lighting console that is outputting Art-Net data, but you need to remap the universes to match the physical layout of your fixtures. In my case, I'm remapping output from Resolume (which is limited to 16 universes per subnet) to WLED and separately, Unreal Engine DMX.

The code is a mess right now, and probably will remain so.
