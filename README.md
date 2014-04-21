Gnome Shell Grub Boot Menu
==========================

![sample boot menu grub](https://dl.dropboxusercontent.com/u/1755358/grub-boot.png)

*gnome-shell-extension-grub* is an extension for gnome shell that allows you to reboot into a selected boot entry. This extension makes use of files and commands that can only be accessed by root, read the installation manual below to set it up correctly.

-----

# Installation

## Using GNU autotools.

Download the [distribution archive](https://github.com/JeffreyVdb/gnome-shell-extension-grub/releases/download/v1.0/gnome-shell-extension-grub-1.0.tar.gz) and extract it to any location.

Navigate to the extracted directory and run these commands:

    $ ./configure --prefix=/usr
    $ make
    $ sudo make install

Restart Gnome shell using alt+f2, typing *r* in the dialog box. Enable the extension using gnome tweak tool.