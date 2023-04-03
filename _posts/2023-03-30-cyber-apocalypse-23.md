---
layout: post
title: "Cyber Apocalypse 2023 - Writeup"
description: "My solutions for the challenges I managed to solve in this CTF"
date: 2023-03-30
categories: computer-science
tags: writeup ctf cyber-apocalypse hackathon solutions capture-the-flag
image: "/assets/posts/ca-23-cover.webp"
---


## About Cyber Apocalypse 2023
Just like for the previous editions, this year I took part in [Cyber Apocalypse 2023 CTF]({% link _posts/2022-05-31-cyber-apocalypse-22.md %}) (check the link for more info). Briefly explained, a *Capture-The-Flag* competition consists in a series of challenges that contestants need to solve in order to find a hidden flag that will grant points to their team.

Sadly, I could only work on the puzzles during the weekend, but nontheless I had a ton of fun and managed to solve my fair share of challenges. Here's the index of my writeup:

- Misc:
    - [Persistence](#misc-1-persistence)
    - [Remote Computation](#misc-2-remote-computation)
- Hardware:
    - [Critical Flight](#hardware-2-critical-flight)
    - [Debug](#hardware-3-debug)
    - [Secret Codes](#hardware-4-secret-codes)
- Reversing:
    - [Shatetred Tablet](#reversing-1-shattered-tablet)
    - [She Shells C Shells](#reversing-2-she-shells-c-shells)
    - [Needle in a Haystack](#reversing-3-needle-in-a-haystack)
    - [Hunting License](#reversing-4-hunting-license)
- Pwn:
    - [Getting Started](#pwn-3-getting-started)

## MISC 1: Persistence

The provided IP address returned each time a different random short string, so I just kept reading its output until the substring "HTB" matched.

```python
import requests, re

for i in range(1000):
    t = requests.get('http://.../flag').text.strip()
    print("Req#%04d: %s" % (i, t))
    if re.match(r'HTB.+', t):
        print(t)
        break
```

Output:

```
...
Req#0492: {u!w&~[jiS=_XOU!IX+3]\@g4*mK
Req#0493: 1p4|TE@>RT>c:5?qg8gHdu]
Req#0494: O?MOR=ke:n}f}5H}|HtS/t6ZbA[d6v+
...
Req#0509: A0<0L.T%E\L$%O(c$.BAF5u^Tc>K"/
Req#0510: rf_4$f<aQvJh*$&ods%_I\
Req#0511: HTB{y0u_h4v3_p0w3rfuL_sCr1pt1ng_ab1lit13S!}
HTB{y0u_h4v3_p0w3rfuL_sCr1pt1ng_ab1lit13S!}
```

## MISC 2: Remote Computation

This task consisted in solving 500 expressions to be read from a remote IP, with a couple of rules like decimal format and some error messages to rise in specific conditions.

```python
import re
from pwn import *

r = remote(...)
r.recvuntil(b'> ')
r.sendline(b'1')

for i in range(500):
    resp = r.recvline_regexS('\[[0-9]+\].+')
    print("Response:", resp)

    exp = re.findall(r'\[[0-9]{3}\]: (.+) = \?', resp)[0]

    try:
        res = eval(exp)
        print(exp, '  ==>  ', res)

        if res >= -1337 and res <= 1337:
            r.sendline(("%.2f" % res).encode('utf-8'))
        else:
            r.sendline("MEM_ERR")
    except ZeroDivisionError:
        r.sendline("DIV0_ERR")
    except SyntaxError:
        r.sendline("SYNTAX_ERR")

    print()

print(r.recvall())
```

Output:

```
$ python misc4.py
[+] Opening connection to xxx: Done
Response: [001]: 13 / 27 + 30 - 16 + 26 + 19 + 15 * 16 + 18 + 8 + 30 - 21 - 21 / 15 + 11 = ?
13 / 27 + 30 - 16 + 26 + 19 + 15 * 16 + 18 + 8 + 30 - 21 - 21 / 15 + 11   ==>   344.0814814814815

Response: > [002]: 28 - 4 + 30 / 22 * 29 - 27 - 15 * 9 + 4 = ?
28 - 4 + 30 / 22 * 29 - 27 - 15 * 9 + 4   ==>   -94.45454545454547

Response: > [003]: 28 / 6 - 13 + 15 / 20 / 27 / 0 * 21 * 24 * 20 = ?
28 / 6 - 13 + 15 / 20 / 27 / 0 * 21 * 24 * 20   ==>   DIV0_ERR


...


Response: > [498]: 11 - 16 - 10 + 24 / 4 = ?
11 - 16 - 10 + 24 / 4   ==>   -9.0

Response: > [499]: 18 / 2 * 4 + 20 * 20 + 3 + 7 - 17 - 6 - 21 - 5 * 21 = ?
18 / 2 * 4 + 20 * 20 + 3 + 7 - 17 - 6 - 21 - 5 * 21   ==>   297.0

Response: > [500]: 17 - 29 * 29 + 20 + 14 - 9 - 15 * 17 = ?
17 - 29 * 29 + 20 + 14 - 9 - 15 * 17   ==>   -1054

[+] Receiving all data: Done (47B)
[*] Closed connection to xxx

b'> [*] Good job! HTB{d1v1d3_bY_Z3r0_3rr0r}'
```

## Hardware 2: Critical Flight

To solve this challenge, it was sufficient to open the Gerber files in KiCAD ad the two copper layers revealed the shape of the flag split in two substrings:

![HW 2 - KiCAD Gerber Viewer](/assets/posts/ca-23-hw-2.png){:.img-big}

## Hardware 3: Debug

The provided file was a `.sal` archive, i.e. a logic analizer session. Opening it with [SALEAE's Logic 2](https://www.saleae.com/downloads/) revealed an async UART stream. Decoding it as ASCII characters returned a textual boot log.

![HW 3 - Logic 2](/assets/posts/ca-23-hw-3a.png){:.img-big}

Hidden among all the text, was the flag split in pieces:

![HW 3 - Flag](/assets/posts/ca-23-hw-3b.png){:.img-big}

## Hardware 4: Secret Codes

This time, the provided files were another `.sal` archive and a set of Gerber files. The Logic 2 session contained 8 channels that looked like this:

![HW4 Channels](/assets/posts/ca-23-hw-4a.png){:.img-big}

While the Gerber archive contaianed this weird PCB with a 7-segment display in the center of an [Eye of Horus](https://en.wikipedia.org/wiki/Eye_of_Horus):

![HW4 Gerber](/assets/posts/ca-23-hw-4b.png){:.img-big}

The first thing I did was exporting the digital channels into a CSV that I could parse with Python, hopefully finding a sequence of displayed digits that meant something. After realizing that channel 1 was a "clock" signal, I struggled quite some time trying to understand how the other channels mapped to the seven segments of the display. Trial and error didn't help much, but at one point I discovered that the upmost Gerber layer had some engravings near the connectors that indicated the correct mapping between channels and PCB traces.

![HW4 Gerber](/assets/posts/ca-23-hw-4c.png){:.img-big}

At this point, however, I was still missing the mapping between display pins and segments, so I assumed it had the typical pinout of a common-cathode chip, that is:

```
 [3] [7] [-] [2] [5]
__|___|___|___|___|__
| g   f   x   a   b |
|                   |
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
|                   |
|_e___d___x___c___._|
  |   |   |   |   |
 [6] [0] [-] [4] [1]
```

I wrote a script to parse the CSV dump into HEX characters, decoded them, and got the flag:

```python
input = [l.strip().split(',') for l in open('digital.csv').readlines()][1:]

map = {
    '1111110': '0',
    '0110000': '1',
    '1101101': '2',
    '1111001': '3',
    '0110011': '4',
    '1011011': '5',
    '1011111': '6',
    '1110000': '7',
    '1111111': '8',
    '1111011': '9',
    '': 'A',
    '0011111': 'B',
    '': 'C',
    '0111101': 'D',
    '1001111': 'E',
    '1000111': 'F',
}

message = ''

for line in input:
    l = line[1:]
    clk = l[1]

    # Signals order:
    #   01234567
    #   d.agcbef
    code = ''
    for i in [2, 5, 4, 0, 6, 7, 3]:
        code += l[i]

    if clk == '1':
        message += map[code]

print(message)
print(binascii.unhexlify(message))
```

![HW4 Flag](/assets/posts/ca-23-hw-4d.png){:.img-big}

## Reversing 1: Shattered Tablet

We get a binary that propts `Hmmmm... I think the tablet says:`. Decompiling the executable reveals a big if statement:

```c
undefined8 main(void) {
  undefined8 local_48;
  undefined8 local_40;
  undefined8 local_38;
  undefined8 local_30;
  undefined8 local_28;
  undefined8 local_20;
  undefined8 local_18;
  undefined8 local_10;
  
  local_48 = 0;
  local_40 = 0;
  local_38 = 0;
  local_30 = 0;
  local_28 = 0;
  local_20 = 0;
  local_18 = 0;
  local_10 = 0;

  printf("Hmmmm... I think the tablet says: ");
  fgets((char *)&local_48,0x40,stdin);

  if (((((((((local_30._7_1_ == 'p') && (local_48._1_1_ == 'T')) && (local_48._7_1_ == 'k')) &&
          ((local_28._4_1_ == 'd' && (local_40._3_1_ == '4')))) &&
         ((local_38._4_1_ == 'e' && ((local_40._2_1_ == '_' && ((char)local_48 == 'H')))))) &&
        (local_28._2_1_ == 'r')) &&
       ((((local_28._3_1_ == '3' && (local_30._1_1_ == '_')) && (local_48._2_1_ == 'B')) &&
        (((local_30._5_1_ == 'r' && (local_48._3_1_ == '{')) &&
         ((local_30._2_1_ == 'b' && ((local_48._5_1_ == 'r' && (local_40._5_1_ == '4')))))))))) &&
      (((local_30._6_1_ == '3' &&
        (((local_38._3_1_ == 'v' && (local_40._4_1_ == 'p')) && (local_28._1_1_ == '1')))) &&
       (((local_30._3_1_ == '3' && (local_38._1_1_ == 'n')) &&
        (((local_48._4_1_ == 'b' && (((char)local_28 == '4' && (local_40._1_1_ == 'n')))) &&
         ((char)local_38 == ',')))))))) &&
     ((((((((char)local_40 == '3' && (local_48._6_1_ == '0')) && (local_38._7_1_ == 't')) &&
         ((local_40._7_1_ == 't' && ((char)local_30 == '0')))) &&
        ((local_40._6_1_ == 'r' && ((local_28._5_1_ == '}' && (local_38._5_1_ == 'r')))))) &&
       (local_38._6_1_ == '_')) && ((local_38._2_1_ == '3' && (local_30._4_1_ == '_')))))) {
    puts("Yes! That\'s right!");
  }
  else {
    puts("No... not that");
  }
  return 0;
}
```

To reverse it, I created a Python script that worked directly on the Assembly instructions for simplicity:

```python
asm = '''
        001011c6 0f b6 45 df     MOVZX      EAX,byte ptr [RBP + local_30+0x7]
        001011ca 3c 70           CMP        AL,0x70
        001011cc 0f 85 8e        JNZ        LAB_00101360
                 01 00 00
        001011d2 0f b6 45 c1     MOVZX      EAX,byte ptr [RBP + local_48+0x1]
        001011d6 3c 54           CMP        AL,0x54
        001011d8 0f 85 82        JNZ        LAB_00101360
                 01 00 00
        001011de 0f b6 45 c7     MOVZX      EAX,byte ptr [RBP + local_48+0x7]
        001011e2 3c 6b           CMP        AL,0x6b
        001011e4 0f 85 76        JNZ        LAB_00101360
                 01 00 00
        001011ea 0f b6 45 e4     MOVZX      EAX,byte ptr [RBP + local_28+0x4]
        001011ee 3c 64           CMP        AL,0x64
        001011f0 0f 85 6a        JNZ        LAB_00101360
                 01 00 00
        001011f6 0f b6 45 cb     MOVZX      EAX,byte ptr [RBP + local_40+0x3]
        001011fa 3c 34           CMP        AL,0x34
        001011fc 0f 85 5e        JNZ        LAB_00101360
                 01 00 00
        00101202 0f b6 45 d4     MOVZX      EAX,byte ptr [RBP + local_38+0x4]
        00101206 3c 65           CMP        AL,0x65
        00101208 0f 85 52        JNZ        LAB_00101360
                 01 00 00
        0010120e 0f b6 45 ca     MOVZX      EAX,byte ptr [RBP + local_40+0x2]
        00101212 3c 5f           CMP        AL,0x5f
        00101214 0f 85 46        JNZ        LAB_00101360
                 01 00 00
        0010121a 0f b6 45 c0     MOVZX      EAX,byte ptr [RBP + local_48]
        0010121e 3c 48           CMP        AL,0x48
        00101220 0f 85 3a        JNZ        LAB_00101360
                 01 00 00
        00101226 0f b6 45 e2     MOVZX      EAX,byte ptr [RBP + local_28+0x2]
        0010122a 3c 72           CMP        AL,0x72
        0010122c 0f 85 2e        JNZ        LAB_00101360
                 01 00 00
        00101232 0f b6 45 e3     MOVZX      EAX,byte ptr [RBP + local_28+0x3]
        00101236 3c 33           CMP        AL,0x33
        00101238 0f 85 22        JNZ        LAB_00101360
                 01 00 00
        0010123e 0f b6 45 d9     MOVZX      EAX,byte ptr [RBP + local_30+0x1]
        00101242 3c 5f           CMP        AL,0x5f
        00101244 0f 85 16        JNZ        LAB_00101360
                 01 00 00
        0010124a 0f b6 45 c2     MOVZX      EAX,byte ptr [RBP + local_48+0x2]
        0010124e 3c 42           CMP        AL,0x42
        00101250 0f 85 0a        JNZ        LAB_00101360
                 01 00 00
        00101256 0f b6 45 dd     MOVZX      EAX,byte ptr [RBP + local_30+0x5]
        0010125a 3c 72           CMP        AL,0x72
        0010125c 0f 85 fe        JNZ        LAB_00101360
                 00 00 00
        00101262 0f b6 45 c3     MOVZX      EAX,byte ptr [RBP + local_48+0x3]
        00101266 3c 7b           CMP        AL,0x7b
        00101268 0f 85 f2        JNZ        LAB_00101360
                 00 00 00
        0010126e 0f b6 45 da     MOVZX      EAX,byte ptr [RBP + local_30+0x2]
        00101272 3c 62           CMP        AL,0x62
        00101274 0f 85 e6        JNZ        LAB_00101360
                 00 00 00
        0010127a 0f b6 45 c5     MOVZX      EAX,byte ptr [RBP + local_48+0x5]
        0010127e 3c 72           CMP        AL,0x72
        00101280 0f 85 da        JNZ        LAB_00101360
                 00 00 00
        00101286 0f b6 45 cd     MOVZX      EAX,byte ptr [RBP + local_40+0x5]
        0010128a 3c 34           CMP        AL,0x34
        0010128c 0f 85 ce        JNZ        LAB_00101360
                 00 00 00
        00101292 0f b6 45 de     MOVZX      EAX,byte ptr [RBP + local_30+0x6]
        00101296 3c 33           CMP        AL,0x33
        00101298 0f 85 c2        JNZ        LAB_00101360
                 00 00 00
        0010129e 0f b6 45 d3     MOVZX      EAX,byte ptr [RBP + local_38+0x3]
        001012a2 3c 76           CMP        AL,0x76
        001012a4 0f 85 b6        JNZ        LAB_00101360
                 00 00 00
        001012aa 0f b6 45 cc     MOVZX      EAX,byte ptr [RBP + local_40+0x4]
        001012ae 3c 70           CMP        AL,0x70
        001012b0 0f 85 aa        JNZ        LAB_00101360
                 00 00 00
        001012b6 0f b6 45 e1     MOVZX      EAX,byte ptr [RBP + local_28+0x1]
        001012ba 3c 31           CMP        AL,0x31
        001012bc 0f 85 9e        JNZ        LAB_00101360
                 00 00 00
        001012c2 0f b6 45 db     MOVZX      EAX,byte ptr [RBP + local_30+0x3]
        001012c6 3c 33           CMP        AL,0x33
        001012c8 0f 85 92        JNZ        LAB_00101360
                 00 00 00
        001012ce 0f b6 45 d1     MOVZX      EAX,byte ptr [RBP + local_38+0x1]
        001012d2 3c 6e           CMP        AL,0x6e
        001012d4 0f 85 86        JNZ        LAB_00101360
                 00 00 00
        001012da 0f b6 45 c4     MOVZX      EAX,byte ptr [RBP + local_48+0x4]
        001012de 3c 62           CMP        AL,0x62
        001012e0 75 7e           JNZ        LAB_00101360
        001012e2 0f b6 45 e0     MOVZX      EAX,byte ptr [RBP + local_28]
        001012e6 3c 34           CMP        AL,0x34
        001012e8 75 76           JNZ        LAB_00101360
        001012ea 0f b6 45 c9     MOVZX      EAX,byte ptr [RBP + local_40+0x1]
        001012ee 3c 6e           CMP        AL,0x6e
        001012f0 75 6e           JNZ        LAB_00101360
        001012f2 0f b6 45 d0     MOVZX      EAX,byte ptr [RBP + local_38]
        001012f6 3c 2c           CMP        AL,0x2c
        001012f8 75 66           JNZ        LAB_00101360
        001012fa 0f b6 45 c8     MOVZX      EAX,byte ptr [RBP + local_40]
        001012fe 3c 33           CMP        AL,0x33
        00101300 75 5e           JNZ        LAB_00101360
        00101302 0f b6 45 c6     MOVZX      EAX,byte ptr [RBP + local_48+0x6]
        00101306 3c 30           CMP        AL,0x30
        00101308 75 56           JNZ        LAB_00101360
        0010130a 0f b6 45 d7     MOVZX      EAX,byte ptr [RBP + local_38+0x7]
        0010130e 3c 74           CMP        AL,0x74
        00101310 75 4e           JNZ        LAB_00101360
        00101312 0f b6 45 cf     MOVZX      EAX,byte ptr [RBP + local_40+0x7]
        00101316 3c 74           CMP        AL,0x74
        00101318 75 46           JNZ        LAB_00101360
        0010131a 0f b6 45 d8     MOVZX      EAX,byte ptr [RBP + local_30]
        0010131e 3c 30           CMP        AL,0x30
        00101320 75 3e           JNZ        LAB_00101360
        00101322 0f b6 45 ce     MOVZX      EAX,byte ptr [RBP + local_40+0x6]
        00101326 3c 72           CMP        AL,0x72
        00101328 75 36           JNZ        LAB_00101360
        0010132a 0f b6 45 e5     MOVZX      EAX,byte ptr [RBP + local_28+0x5]
        0010132e 3c 7d           CMP        AL,0x7d
        00101330 75 2e           JNZ        LAB_00101360
        00101332 0f b6 45 d5     MOVZX      EAX,byte ptr [RBP + local_38+0x5]
        00101336 3c 72           CMP        AL,0x72
        00101338 75 26           JNZ        LAB_00101360
        0010133a 0f b6 45 d6     MOVZX      EAX,byte ptr [RBP + local_38+0x6]
        0010133e 3c 5f           CMP        AL,0x5f
        00101340 75 1e           JNZ        LAB_00101360
        00101342 0f b6 45 d2     MOVZX      EAX,byte ptr [RBP + local_38+0x2]
        00101346 3c 33           CMP        AL,0x33
        00101348 75 16           JNZ        LAB_00101360
        0010134a 0f b6 45 dc     MOVZX      EAX,byte ptr [RBP + local_30+0x4]
        0010134e 3c 5f           CMP        AL,0x5f
'''

import re, binascii


mem = {
    'local_28': [0]*6,
    'local_30': [0]*8,
    'local_38': [0]*8,
    'local_40': [0]*8,
    'local_48': [0]*8
}

asm = [l.strip() for l in asm.split('\n')]
for i in range(len(asm)):
    line = asm[i]

    if 'MOVZX' in line:
        addr, off = re.findall(r'\[RBP \+ (local_..)\+?(.+)?\]', line)[0]
        off = int(off, 16) if off else 0

        i += 1
        line = asm[i]
        letter = re.findall(r'AL,0x(.+)', line)[0]

        mem[addr][off] = letter
        i += 1

for k in sorted(mem.keys(), reverse=True):
    hex = ''.join(mem[k])
    print(binascii.unhexlify(hex).decode('utf-8'), end='')
  
print()
```

Which yields the input that the binary expects, i.e., our flag:

```
HTB{br0k3n_4p4rt,n3ver_t0_b3_r3p41r3d}
```

## Reversing 2: She Shells C Shells

This challenge gives us a shell with a few commands available:

![Rev 2 Shell](/assets/posts/ca-23-rev-2.png)

The command that interests us is of course `getflag`, which however requires a password. Decompiling the binary reveals this interesting function that is called with that command:

```c

undefined8 func_flag(void) {
  undefined8 uVar1;
  // ...
  undefined8 local_20;
  int local_14;
  uint i, j;
  
  printf("Password: ");

  user_password = 0;
  local_110 = 0;
  // ...
  local_20 = 0;

  fgets((char*)&user_password, 0x100, stdin);
  for (i = 0; i < 0x4d; i = i + 1) {
    *(byte*)(&user_password + i) = *(byte*)(&user_password + i) ^ m1[i];
  }
  local_14 = memcmp(&user_password,t,0x4d);

  if (local_14 == 0) {
    for (j = 0; j < 0x4d; j = j + 1) {
      *(byte*)(&user_password + j) = *(byte*)(&user_password + j) ^ m2[j];
    }

    printf("Flag: %s\n",&user_password);
    uVar1 = 0;
  }
  else {
    uVar1 = 0xffffffff;
  }
  return uVar1;
}

```

Therefore, the password needs to be a string that when XORed with `m1` matches the `t` array. We can find this string by XORing `m1` and `t`:

```python
asm_m = '''001021a0 6e              undefin   6Eh                     [0]                               XREF[2]:     func_flag:00101908(*), 
           001021a1 3f              undefin   3Fh                     [1]
           001021a2 c3              undefin   C3h                     [2]
           ...
           001021ea a8              undefin   A8h                     [74]
           001021eb 7e              undefin   7Eh                     [75]
           001021ec 8d              undefin   8Dh                     [76] '''

asm_t = '''00102200 2c              undefin   2Ch                     [0]                               XREF[1]:     func_flag:0010193b(*)  
           00102201 4a              undefin   4Ah                     [1]
           00102202 b7              undefin   B7h                     [2]
           ...
           0010224a c9              undefin   C9h                     [74]
           0010224b 10              undefin   10h                     [75]
           0010224c e9              undefin   E9h                     [76] '''


import re, binascii

psw = ''
asm_m, asm_t = asm_m.splitlines(), asm_t.splitlines()

for i in range(len(asm_m)):
    m = re.findall(r' (..)h ', asm_m[i])[0]
    t = re.findall(r' (..)h ', asm_t[i])[0]
    psw += chr(ord(binascii.unhexlify(m)) ^ ord(binascii.unhexlify(t)))

print(psw)
```

This yields the password that the program expects and we get the flag:

```
$ ./shell
ctfsh-$ getflag
Password: But the value of these shells will fall, due to the laws of supply and demand
Flag: HTB{cr4ck1ng_0p3n_sh3ll5_by_th3_s34_sh0r3}
ctfsh-$
```

## Reversing 3: Needle in a Haystack

We have a script that returns a random word from a dictionary each time it is invoked.

```sh
$ strings haystack | grep HTB
HTB{d1v1ng_1nt0_th3_d4tab4nk5}
```

## Reversing 4: Hunting License

We connect to the provided IP address with `nc` and we get a type of quiz. I answered to the first questions using the `file` utility, `ldd`, and Ghidra; for the passwords, see below.

```
$ nc xxx yy
What is the file format of the executable?
> ELF
[+] Correct!

What is the CPU architecture of the executable?
> x86-64
[+] Correct!

What library is used to read lines for user answers? (`ldd` may help)
> libreadline
[+] Correct!

What is the address of the `main` function?
> 0x401172
[+] Correct!

How many calls to `puts` are there in `main`? (using a decompiler may help)
> 5
[+] Correct!

What is the first password?
> PasswordNumeroUno
[+] Correct!

What is the reversed form of the second password?
> 0wTdr0wss4P
[+] Correct!

What is the real second password?
> P4ssw0rdTw0
[+] Correct!

What is the XOR key used to encode the third password?
> \x13222\x7fr}zUw}Rwaz{G
[-] Wrong Answer.
What is the XOR key used to encode the third password?
> 0x13
[+] Correct!

What is the third password?
> ThirdAndFinal!!!
[+] Correct!

[+] Here is the flag: `HTB{l1c3ns3_4cquir3d-hunt1ng_t1m3!}`
```

The first password is in plain text:

```c
void exam(void) {
  int iVar1;
  undefined8 local_38;
  undefined8 local_30;
  undefined local_28;
  undefined8 local_1c;
  undefined4 local_14;
  char *user_input;
  
  user_input = (char*)readline("Okay, first, a warmup - what\'s the first password? This one\'s not even hidden: ");
  iVar1 = strcmp(user_input,"PasswordNumeroUno");
  if (iVar1 != 0) {
    puts("Not even close!");
    exit(-1);
  }
  free(user_input);

  local_1c = 0;
  local_14 = 0;
  reverse(&local_1c, t, 0xb);
  user_input = (char*)readline("Getting harder - what\'s the second password? ");
  iVar1 = strcmp(user_input, (char*)&local_1c);
  if (iVar1 != 0) {
    puts("You\'ve got it all backwards...");
    exit(-1);
  }
  free(user_input);
  
  local_38 = 0;
  local_30 = 0;
  local_28 = 0;
  xor(&local_38, t2, 0x11, 0x13);
  user_input = (char*)readline("Your final test - give me the third, and most protected, password: ");
  iVar1 = strcmp(user_input, (char*)&local_38);
  if (iVar1 != 0) {
    puts("Failed at the final hurdle!");
    exit(-1);
  }
  free(user_input);

  return;
}
```

The second password is the reversed contents of vector `t`:

```
                    t                                               XREF[3]:     Entry Point(*), 
00404060 30              undefin   30h                     [0]      XREF[3]:     Entry Point(*), 
00404061 77              undefin   77h                     [1]
00404062 54              undefin   54h                     [2]
00404063 64              undefin   64h                     [3]
00404064 72              undefin   72h                     [4]
00404065 30              undefin   30h                     [5]
00404066 77              undefin   77h                     [6]
00404067 73              undefin   73h                     [7]
00404068 73              undefin   73h                     [8]
00404069 34              undefin   34h                     [9]
0040406a 50              undefin   50h                     [10]
0040406b 00              undefin   00h                     [11]

307754647230777373345000
0wTdr0wss4P
>>> binascii.unhexlify('3077546472307773733450')[::-1]
P4ssw0rdTw0
```

For the third password we need to examine the `xor` function that is being called:

```c
void xor(long result, long s1, ulong len, byte s2) {
  int i;
  
  for (i = 0; (ulong)(long)i < len; i = i + 1) {
    *(byte *)(result + i) = *(byte *)(s1 + i) ^ s2;
  }
  return;
}
```

Which tells us that our password needs to match `t2` XOR'ed with `0x13`:

```
                             t2                                              XREF[3]:     Entry Point(*), 
           00404070 47              undefin   47h                     [0]    XREF[3]:     Entry Point(*), 
           00404071 7b              undefin   7Bh                     [1]
           00404072 7a              undefin   7Ah                     [2]
           00404073 61              undefin   61h                     [3]
           00404074 77              undefin   77h                     [4]
           00404075 52              undefin   52h                     [5]
           00404076 7d              undefin   7Dh                     [6]
           00404077 77              undefin   77h                     [7]
           00404078 55              undefin   55h                     [8]
           00404079 7a              undefin   7Ah                     [9]
           0040407a 7d              undefin   7Dh                     [10]
           0040407b 72              undefin   72h                     [11]
           0040407c 7f              undefin   7Fh                     [12]
           0040407d 32              undefin   32h                     [13]
           0040407e 32              undefin   32h                     [14]
           0040407f 32              undefin   32h                     [15]
           00404080 13              undefin   13h                     [16]

t2 = '477B7A6177527D77557A7D727F32323213'
>>> ''.join(chr(b^0x13) for b in binascii.unhexlify(t2))
'ThirdAndFinal!!!\x00'
```

## PWN 3: Getting Started

This challenge is essentially an interactive, guided buffer overflow attack:

```
nc xxxx yy

Stack frame layout

|      .      | <- Higher addresses
|      .      |
|_____________|
|             | <- 64 bytes
| Return addr |
|_____________|
|             | <- 56 bytes
|     RBP     |
|_____________|
|             | <- 48 bytes
|   target    |
|_____________|
|             | <- 40 bytes
|  alignment  |
|_____________|
|             | <- 32 bytes
|  Buffer[31] |
|_____________|
|      .      |
|      .      |
|_____________|
|             |
|  Buffer[0]  |
|_____________| <- Lower addresses


      [Addr]       |      [Value]
-------------------+-------------------
0x00007ffe41ed0a50 | 0x0000000000000000 <- Start of buffer
0x00007ffe41ed0a58 | 0x0000000000000000
0x00007ffe41ed0a60 | 0x0000000000000000
0x00007ffe41ed0a68 | 0x0000000000000000
0x00007ffe41ed0a70 | 0x6969696969696969 <- Dummy value for alignment
0x00007ffe41ed0a78 | 0x00000000deadbeef <- Target to change
0x00007ffe41ed0a80 | 0x0000559c16f7c800 <- Saved rbp
0x00007ffe41ed0a88 | 0x00007f861b330c87 <- Saved return address
0x00007ffe41ed0a90 | 0x0000000000000001
0x00007ffe41ed0a98 | 0x00007ffe41ed0b68

// [...]

◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉
◉                                                                                                 ◉
◉  Fill the 32-byte buffer, overwrite the alginment address and the "target's" 0xdeadbeef value.  ◉
◉                                                                                                 ◉
◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉◉

>> aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


      [Addr]       |      [Value]
-------------------+-------------------
0x00007ffe41ed0a50 | 0x6161616161616161 <- Start of buffer
0x00007ffe41ed0a58 | 0x6161616161616161
0x00007ffe41ed0a60 | 0x6161616161616161
0x00007ffe41ed0a68 | 0x6161616161616161
0x00007ffe41ed0a70 | 0x6161616161616161 <- Dummy value for alignment
0x00007ffe41ed0a78 | 0x0000000061616161 <- Target to change
0x00007ffe41ed0a80 | 0x0000559c16f7c800 <- Saved rbp
0x00007ffe41ed0a88 | 0x00007f861b330c87 <- Saved return address
0x00007ffe41ed0a90 | 0x0000000000000001
0x00007ffe41ed0a98 | 0x00007ffe41ed0b68

HTB{b0f_s33m5_3z_r1ght?}
```
