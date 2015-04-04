___
Frequently Asked Questions
---

> How do you run chatty on windows?

Bash commands as far as executing git and change directory are no different.
___
> Port 80 is already in use, how do I allocate a different number to chatty?

Well as of right now, beta doesn't support that feature yet, but the basic version does.  Executing ```basic.js``` without any arguments automatically assigns a random open port, but if the server crashes and you run it again the port may change so this isn't recommended. Passing basic with ```-s``` uses the default port 80 for http and 23 for telnet. The flags ```--httpd-port``` and ```--telnet-port``` allow manual specification.
```
#!/bin/bash
cd chatty
#node basic -s
node basic --httpd-port=8080 --telnet-port 4879
```
---
> Why can't others access my chatty server?

Well, this could be several different things.

- Your friend is typing in the wrong ip address.
- Your computer is not properly accessible to the world wide web.
- Firewalls are inhibiting the connection.

All of these can be resolved by searching the internet or your local library on __port forwarding__ and may not be achievable on an environment where you do not personally own the router and computer.
___
> Can I use this...

I'm going to stop you there and tell you that the answer is always yes. Just know all contributions to the original project would be greatly appreciated; do whatever you want with it, just try not to get into to much trouble ;)